import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  // Next.js requires unsafe-inline for its inline hydration scripts; unsafe-eval for dev HMR
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://res.cloudinary.com",
  "font-src 'self' data:",
  // Turnstile and Stripe embed iframes
  "frame-src https://challenges.cloudflare.com https://js.stripe.com",
  // API calls out to Stripe + self
  "connect-src 'self' https://api.stripe.com",
  // Stripe redirects the form action to checkout.stripe.com
  "form-action 'self' https://checkout.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options",           value: "DENY" },
          // Stop MIME-type sniffing
          { key: "X-Content-Type-Options",    value: "nosniff" },
          // Limit referrer information sent cross-origin
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          // Enforce HTTPS for 2 years, include subdomains
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Restrict hardware API access
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // Content Security Policy
          { key: "Content-Security-Policy",   value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
