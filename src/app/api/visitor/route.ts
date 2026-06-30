import { NextRequest } from "next/server";
import { rateLimit, getIp } from "@/backend/lib/rate-limit";

function flag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  return String.fromCodePoint(
    ...countryCode.toUpperCase().split("").map((c) => 0x1f1e0 + c.charCodeAt(0) - 65)
  );
}

export async function POST(request: NextRequest) {
  // 3 pings per minute per IP — return 204 silently so bots don't know they're blocked
  const { allowed } = await rateLimit(`visitor:${getIp(request)}`, { windowSeconds: 60, maxRequests: 3 });
  if (!allowed) return new Response(null, { status: 204 });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return new Response(null, { status: 204 });

  const ip = getIp(request);
  const body = await request.json().catch(() => ({}));
  const { userAgent, language, timezone, screen, referrer, page } = body as Record<string, string>;

  // Geolocate IP
  // In production behind Cloudflare, cf-ipcountry gives the country code
  // for free with no outbound HTTP request. Fall back to ip-api.com only
  // in dev (where CF headers are absent). ip-api.com free plan is HTTP-only.
  let geo: Record<string, string> = {};
  const cfCountry = request.headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX" && cfCountry !== "T1") {
    geo = { countryCode: cfCountry, query: ip };
  } else {
    try {
      const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,isp,org,query`, { signal: AbortSignal.timeout(3000) });
      const data = await res.json() as Record<string, string>;
      if (data.status === "success") geo = data;
    } catch { /* fail silently */ }
  }

  const now = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
  const emoji = flag(geo.countryCode ?? "");
  const location = [geo.city, geo.regionName, geo.country].filter(Boolean).join(", ") || "Unknown";
  const isp = geo.isp || geo.org || "Unknown";

  const text = [
    `🔔 <b>New Visitor — AW Tickets</b>`,
    ``,
    `🕐 <b>Time:</b> ${now}`,
    `📍 <b>Location:</b> ${emoji} ${location}`,
    `🌐 <b>IP:</b> <code>${geo.query || ip}</code>`,
    `🏢 <b>ISP:</b> ${isp}`,
    ``,
    `🖥️ <b>Browser:</b> ${userAgent || "Unknown"}`,
    `🗣️ <b>Language:</b> ${language || "Unknown"}`,
    `⏰ <b>Timezone:</b> ${timezone || "Unknown"}`,
    `📐 <b>Screen:</b> ${screen || "Unknown"}`,
    ``,
    `📄 <b>Page:</b> ${page || "/"}`,
    `🔗 <b>Referrer:</b> ${referrer || "Direct"}`,
  ].join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch { /* fail silently */ }

  return new Response(null, { status: 204 });
}
