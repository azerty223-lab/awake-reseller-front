"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
// ── Countdown ─────────────────────────────────────────────────────────────────
const FESTIVAL_DATE = new Date("2026-07-10T15:00:00+02:00");

function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

// ── Panel data ────────────────────────────────────────────────────────────────
interface ContentPanel {
  id: string;
  bg: string;
  eyebrow: string;
  lines: [string, string];
  sub: string;
  cta?: boolean;
}

// Panel 1 (hero) is rendered separately with YouTube video.
// Panels 2+ use this typed array.
const CONTENT_PANELS: ContentPanel[] = [
  {
    // Slide 2: festival crowd background + "Get Your Pass" content (slide 3 text)
    id: "tickets",
    bg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=90&w=1920&auto=format&fit=crop",
    eyebrow: "Verified Resale",
    lines: ["Get Your", "Pass."],
    sub: "Every ticket authenticated · Name transfer included · Stripe secured",
    cta: true,
  },
];

// Total panel count (hero + content panels) — used for GSAP sizing
const TOTAL_PANELS = 1 + CONTENT_PANELS.length;

// Pexels free festival crowd video — royalty-free, no player UI, loops cleanly
// "People at a Concert" by Kelly Lacy (pexels.com/video/3042698)
const BG_VIDEO = "https://videos.pexels.com/video-files/3042698/3042698-hd_1920_1080_25fps.mp4";

// ── Component ─────────────────────────────────────────────────────────────────
export function CinematicHero() {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);

  const [activePanel, setActivePanel] = useState(0);

  const { d, h, m, s } = useCountdown(FESTIVAL_DATE);


  // ── Panel navigation — wheel-event driven, one tick = one panel ──────────────
  // Replaces scrub+snap approach which stopped halfway with Lenis smoothing.
  // The container is pinned via ScrollTrigger; wheel events advance the index
  // and gsap.to() animates the track. A "busy" lock prevents double-firing.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track) return;

    const numPanels = TOTAL_PANELS;
    let current   = 0;
    let busy      = false;
    let cooldown: ReturnType<typeof setTimeout> | null = null;

    // Pin the container in the viewport for the duration of all panels
    const pin = ScrollTrigger.create({
      trigger: container,
      pin:     true,
      start:   "top top",
      end:     `+=${(numPanels - 1) * window.innerHeight}`,
      invalidateOnRefresh: true,
    });

    const goTo = (index: number) => {
      if (busy) return;
      const next = Math.max(0, Math.min(numPanels - 1, index));
      if (next === current) return;
      busy    = true;
      current = next;
      setActivePanel(next);

      gsap.to(track, {
        x:        -next * window.innerWidth,
        duration: 0.55,
        ease:     "power3.inOut",
        onComplete: () => {
          // Extra cooldown after animation — prevents touchpad from
          // firing a second panel change mid-swipe gesture
          cooldown = setTimeout(() => { busy = false; }, 750);
        },
      });
    };

    const onWheel = (e: WheelEvent) => {
      const rect = container.getBoundingClientRect();
      // Only intercept when pinned (container flush with top of viewport)
      if (rect.top < -2 || rect.top > 2) return;
      // At last panel scrolling down → release; at first scrolling up → release
      if (e.deltaY > 0 && current >= numPanels - 1) return;
      if (e.deltaY < 0 && current <= 0) return;
      e.preventDefault();
      goTo(current + (e.deltaY > 0 ? 1 : -1));
    };

    // Touch support
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd   = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 30) return;
      const rect = container.getBoundingClientRect();
      if (rect.top < -2 || rect.top > 2) return;
      if (delta > 0 && current >= numPanels - 1) return;
      if (delta < 0 && current <= 0) return;
      e.preventDefault();
      goTo(current + (delta > 0 ? 1 : -1));
    };

    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchend",   onTouchEnd,   { passive: false });

    return () => {
      if (cooldown) clearTimeout(cooldown);
      pin.kill();
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  return (
    // Overflow hidden so the horizontal track doesn't create a scrollbar
    <div ref={containerRef} className="overflow-hidden">

      {/* ── Horizontal track ─────────────────────────────────────────── */}
      <div
        ref={trackRef}
        className="flex h-screen will-change-transform"
        style={{ width: `${TOTAL_PANELS * 100}vw` }}
      >

        {/* ══ Panel 1 — native video hero (Pexels, royalty-free) ══════ */}
        <div className="relative w-screen h-screen shrink-0 overflow-hidden">

          {/* Native <video> — no iframe, no player UI, no YouTube dependency */}
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <source src={BG_VIDEO} type="video/mp4" />
          </video>

          {/* Visual overlay — z-index 10, pointer-events:none (visual only) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 10,
              background: [
                "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.88))",
                "radial-gradient(circle at 50% 20%, rgba(210,170,55,0.18), transparent 45%)",
              ].join(", "),
            }}
          />

          {/* Content — centered */}
          <div
            data-content
            className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 lg:px-20 max-w-[1400px] mx-auto w-full gap-6"
            style={{ marginTop: "80px" }}
          >
            {/* Dark container — pill label + countdown inside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pointer-events-none select-none mt-8 w-full max-w-2xl"
            >
              <div className="flex flex-col items-center gap-5 px-8 py-6 rounded-2xl border border-white/[0.15] bg-black/60 backdrop-blur-md">
                {/* Label row */}
                <div className="flex items-center gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                  <span className="text-white/80 text-[12px] uppercase tracking-[0.28em] font-semibold whitespace-nowrap">
                    Awakenings Festival · July 10–12, 2026
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                </div>

                {/* Countdown inside the container */}
                <div className="flex items-baseline justify-center gap-3 sm:gap-8">
                  {[
                    { val: d, label: "days" },
                    { val: h, label: "hrs" },
                    { val: m, label: "min" },
                    { val: s, label: "sec" },
                  ].map(({ val, label }, i) => (
                    <div key={label} className="flex items-baseline gap-1">
                      <span
                        className="font-[var(--font-playfair)] font-black text-white tabular-nums"
                        style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
                      >
                        {String(val).padStart(2, "0")}
                      </span>
                      <span className="text-zinc-400 text-[9px] uppercase tracking-[0.1em] font-medium">
                        {label}
                      </span>
                      {i < 3 && (
                        <span className="hidden sm:inline text-zinc-600 ml-2 font-light text-xl leading-none select-none">·</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* CTA — directly under countdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
            >
              <button
                onClick={() => router.push("/tickets")}
                className="group inline-flex items-center gap-3 text-sm font-semibold text-black tracking-wide rounded-full px-8 py-4 transition-all duration-500"
                style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E4BA65 100%)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 60px rgba(201,168,76,0.4), 0 8px 32px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                Browse Tickets
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* ══ Panels 2 & 3 ══════════════════════════════════════════════ */}
        {CONTENT_PANELS.map((panel) => (
          <div
            key={panel.id}
            className="relative w-screen h-screen shrink-0 overflow-hidden"
          >
            {/* Background image with parallax wrapper */}
            <div
              data-parallax
              className="absolute inset-0"
              style={{ width: "115%", left: "-7.5%" }}
            >
              <Image
                src={panel.bg}
                alt=""
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  opacity: 0.65,
                  filter: "brightness(0.78) saturate(0.88)",
                }}
              />
            </div>

            {/* Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: [
                  "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.85))",
                  "radial-gradient(circle at 60% 40%, rgba(201,168,76,0.06), transparent 55%)",
                ].join(", "),
              }}
            />

            {/* Text content */}
            <div
              data-content
              className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-20 sm:pb-28 max-w-[1400px] mx-auto w-full"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-6 font-medium">
                {panel.eyebrow}
              </p>

              <h2
                className="font-[var(--font-playfair)] font-black text-white leading-[0.9] mb-8"
                style={{ fontSize: "clamp(4rem, 11vw, 9rem)", letterSpacing: "-0.03em" }}
              >
                {panel.lines.map((line, i) => (
                  <span key={i} className={i === 1 ? "block" : "block"}>
                    {i === 1 ? (
                      <span style={{
                        background: "linear-gradient(to right, #C9A84C, #E4BA65 50%, #C9A84C)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}>
                        {line}
                      </span>
                    ) : line}
                  </span>
                ))}
              </h2>

              <p className="text-zinc-400 text-sm tracking-[0.08em] mb-10 max-w-lg leading-relaxed">
                {panel.sub}
              </p>

              {"cta" in panel && panel.cta && (
                <button
                  onClick={() => router.push("/tickets")}
                  className="group inline-flex items-center gap-3 text-sm font-semibold text-black tracking-wide rounded-full px-8 py-4 w-fit transition-all duration-300"
                  style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E4BA65 100%)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 60px rgba(201,168,76,0.4), 0 8px 32px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  Browse Tickets
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Panel dot indicators ─────────────────────────────────────── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5 pointer-events-none">
        {Array.from({ length: TOTAL_PANELS }, (_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-400"
            style={{
              width:      activePanel === i ? "6px"               : "5px",
              height:     activePanel === i ? "6px"               : "5px",
              background: activePanel === i ? "#C9A84C"           : "rgba(255,255,255,0.25)",
              boxShadow:  activePanel === i ? "0 0 8px #C9A84C66" : "none",
            }}
          />
        ))}
      </div>

      {/* ── Scroll cue (panel 1 only) ────────────────────────────────── */}
      {activePanel === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        >
          <div className="h-10 w-px bg-gradient-to-b from-transparent to-white/20" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">Scroll</span>
        </motion.div>
      )}

    </div>
  );
}
