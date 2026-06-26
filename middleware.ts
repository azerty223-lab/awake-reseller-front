import { NextRequest, NextResponse } from "next/server";

/* ── Environment flags ──────────────────────────────────────────────
   CLOUDFLARE_ONLY=true   → block requests that bypassed Cloudflare
                            (i.e. hit the raw Railway URL directly)
   ADMIN_ALLOWED_IPS      → comma-separated list of IPs allowed to
                            access /admin (e.g. your home/office IP)
   Both are optional. Set them in Railway's environment variables.  */

const CLOUDFLARE_ONLY   = process.env.CLOUDFLARE_ONLY   === "true";
const ADMIN_ALLOWED_IPS = (process.env.ADMIN_ALLOWED_IPS ?? "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

/* ── Helper: resolve real client IP ────────────────────────────────
   Priority: CF-Connecting-IP (Cloudflare) → X-Real-IP → last XFF.
   Matches the same logic used in the rate limiter.                */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip")?.trim() ??
    req.headers.get("x-real-ip")?.trim()        ??
    req.headers.get("x-forwarded-for")
      ?.split(",").at(-1)?.trim()               ??
    "unknown"
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* ── 1. Cloudflare bypass protection ───────────────────────────
     When CLOUDFLARE_ONLY is enabled, any request that arrives
     WITHOUT the CF-Connecting-IP header came directly to your
     Railway origin, bypassing Cloudflare's WAF and bot filtering.
     Return 403 to make your origin invisible to scanners.

     Only enable this AFTER you confirm Cloudflare is fully active
     and all your traffic flows through it — otherwise you lock
     yourself out.                                                */
  if (CLOUDFLARE_ONLY) {
    const cfIp = request.headers.get("cf-connecting-ip");
    if (!cfIp) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  /* ── 2. Admin IP allowlist ──────────────────────────────────────
     /admin routes are only accessible from IPs you explicitly list
     in ADMIN_ALLOWED_IPS. Anyone else gets 403 immediately —
     before NextAuth even checks their credentials.

     Set ADMIN_ALLOWED_IPS in Railway to your home/office IP(s):
     Example: ADMIN_ALLOWED_IPS="12.34.56.78,98.76.54.32"

     Leave ADMIN_ALLOWED_IPS empty to disable this check (default). */
  if (pathname.startsWith("/admin") && ADMIN_ALLOWED_IPS.length > 0) {
    const clientIp = getClientIp(request);
    if (!ADMIN_ALLOWED_IPS.includes(clientIp)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  /* Run on all routes except static assets and Next.js internals */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot)).*)",
  ],
};
