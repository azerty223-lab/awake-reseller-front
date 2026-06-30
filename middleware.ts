import { NextRequest, NextResponse } from "next/server";

/* ── Environment flags ──────────────────────────────────────────────
   CLOUDFLARE_ONLY=true   → block requests that bypassed Cloudflare
   ADMIN_ALLOWED_IPS      → comma-separated IPs allowed on /admin
   Both are optional. Set them in Railway environment variables.    */
const CLOUDFLARE_ONLY   = process.env.CLOUDFLARE_ONLY   === "true";
const ADMIN_ALLOWED_IPS = (process.env.ADMIN_ALLOWED_IPS ?? "")
  .split(",").map(s => s.trim()).filter(Boolean);

/* ── Helper: resolve real client IP ────────────────────────────────
   Priority: CF-Connecting-IP → X-Real-IP → last X-Forwarded-For.
   In production behind Cloudflare, CF-Connecting-IP is always set
   and cannot be spoofed by the client.                            */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip")?.trim() ??
    req.headers.get("x-real-ip")?.trim()        ??
    req.headers.get("x-forwarded-for")
      ?.split(",").at(-1)?.trim()               ??
    "unknown"
  );
}

/* ── Bad-bot user-agent blocklist ───────────────────────────────────
   Matches UAs belonging to:
     • Vulnerability scanners  (nikto, sqlmap, nuclei, wfuzz, …)
     • AI training crawlers    (GPTBot, CCBot, ClaudeBot, Bytespider, …)
     • Mass SEO / audit bots   (SemrushBot, AhrefsBot, MJ12bot, …)
     • Scripted scraping tools (scrapy, mechanize, python-requests, …)
   Legitimate browsers always contain "Mozilla/5.0"; these don't.  */
const BAD_BOT_RE = /\b(nikto|sqlmap|nmap|masscan|nuclei|wfuzz|gobuster|dirbuster|feroxbuster|commix|openvas|acunetix|nessus|netsparker|appscan|skipfish|w3af|zgrab|shodan-crawler|censys|gptbot|claudebot|claude-web|anthropic-ai|google-extended|ccbot|bytespider|perplexitybot|youbot|diffbot|cohere-ai|semrushbot|ahrefsbot|mj12bot|dotbot|blexbot|sistrix|ia_archiver|archive\.org_bot|scrapy|mechanize|python-requests|python-httpx)\b/i;

/* ── Scanner honeypot paths ─────────────────────────────────────────
   Paths that no legitimate browser visits but every automated
   scanner probes. Return 404 (not 403) to avoid revealing the trap. */
const HONEYPOT_RE = /^\/(wp-admin|wp-login\.php|wp-content|xmlrpc\.php|\.env|\.git|\.htaccess|\.htpasswd|\.aws|\.ssh|phpmyadmin|pma|adminer|admin\.php|login\.php|config\.php|configuration\.php|shell\.php|eval\.php|phpinfo|info\.php|vendor\/phpunit|etc\/passwd|proc\/self|swagger|swagger-ui|api-docs|actuator)(\/|$)/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent") ?? "";

  /* 1. Cloudflare bypass protection ──────────────────────────────
        Reject direct hits to the Railway origin that bypassed CF.
        Enable only after Cloudflare is fully active.             */
  if (CLOUDFLARE_ONLY && !request.headers.get("cf-connecting-ip")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  /* 2. Scanner honeypot ──────────────────────────────────────────
        Return 404 silently — don't hint that the path was blocked. */
  if (HONEYPOT_RE.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  /* 3. Block known bad bots, vuln scanners, and AI scrapers ──────
        UA strings that belong to automated tools, not browsers.   */
  if (ua && BAD_BOT_RE.test(ua)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  /* 4. Block zero-UA requests to API endpoints ───────────────────
        Every real browser sends a User-Agent. A missing UA on an
        API call is a strong signal of raw automation.
        Webhooks (Stripe, BTCPay) and health checks are excluded.  */
  if (
    !ua &&
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/webhooks/") &&
    !pathname.startsWith("/api/health")
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  /* 5. Admin IP allowlist ─────────────────────────────────────── */
  if (pathname.startsWith("/admin") && ADMIN_ALLOWED_IPS.length > 0) {
    const clientIp = getClientIp(request);
    if (!ADMIN_ALLOWED_IPS.includes(clientIp)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  /* 6. Inject X-Robots-Tag for non-indexable paths ───────────────
        API routes, admin panel, checkout and ticket pages must not
        appear in search engine results or be archived.            */
  const res = NextResponse.next();
  if (
    pathname.startsWith("/api/")     ||
    pathname.startsWith("/admin")    ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/ticket/")
  ) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot)).*)",
  ],
};
