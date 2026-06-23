import { NextResponse, type NextRequest } from "next/server";

const BOT_UA = /curl|wget|python|java(?!script)|perl|ruby|php|go-http|axios|node-fetch|httpx|aiohttp|mechanize|scrapy|phantomjs|headlesschrome|selenium|webdriver|zgrab|masscan|nmap|libwww|lwp-|htmlunit/i;

export function proxy(request: NextRequest) {
  // Block known scraper / scripting user-agents on API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ua = request.headers.get("user-agent") ?? "";
    if (BOT_UA.test(ua)) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
