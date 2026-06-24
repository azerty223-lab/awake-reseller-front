"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
// ── YouTube IFrame API types ──────────────────────────────────────────────────
interface _YTPlayer {
  getCurrentTime(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  destroy(): void;
}

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
    id: "atmosphere",
    bg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=90&w=1920&auto=format&fit=crop",
    eyebrow: "Awakenings Festival 2026",
    lines: ["Three Days.", "One Sound."],
    sub: "July 10–12 · Hilvarenbeek · 7+ Stages · 100+ Artists",
  },
  {
    id: "tickets",
    // Vitalii Onyshchuk — concert crowd, hands raised, blue/purple stage lights (Unsplash free)
    bg: "https://images.unsplash.com/photo-b7gi_rqKxcQ?q=90&w=1920&auto=format&fit=crop",
    eyebrow: "Verified Resale",
    lines: ["Get Your", "Pass."],
    sub: "Every ticket authenticated · Name transfer included · Stripe secured",
    cta: true,
  },
];

// Total panel count (hero + content panels) — used for GSAP sizing
const TOTAL_PANELS = 1 + CONTENT_PANELS.length;

// Charlotte de Witte @ Awakenings Festival 2025 (official Awakenings channel)
const YT_ID    = "m1SvbXLYEEc";
const YT_START = 22;  // 0:22
const YT_END   = 32;  // 0:32  — polling seeks back to YT_START when reached

// ── Component ─────────────────────────────────────────────────────────────────
export function CinematicHero() {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);

  // YouTube IFrame API refs — no state dependency, no black mask
  const ytDivRef    = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<_YTPlayer | null>(null);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activePanel, setActivePanel] = useState(0);

  const { d, h, m, s } = useCountdown(FESTIVAL_DATE);

  // ── YouTube: precise 0:22 → 0:32 loop via IFrame API polling ────────────────
  // No black mask — the gradient overlay covers YouTube UI during load.
  useEffect(() => {
    function createPlayer() {
      if (!window.YT?.Player || !ytDivRef.current) return;

      ytPlayerRef.current = new window.YT.Player(ytDivRef.current, {
        videoId: YT_ID,
        width:   "100%",
        height:  "100%",
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, disablekb: 1,
          rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3,
          start: YT_START,
        },
        events: {
          onReady: () => {
            // Start polling immediately once the player is ready
            pollRef.current = setInterval(() => {
              try {
                if ((ytPlayerRef.current?.getCurrentTime() ?? 0) >= YT_END)
                  ytPlayerRef.current?.seekTo(YT_START, true);
              } catch { /* player destroyed during cleanup */ }
            }, 150);
          },
        },
      }) as unknown as _YTPlayer;
    }

    const win = window as typeof window & {
      YT?: { Player: new (el: HTMLElement, opts: object) => _YTPlayer };
      onYouTubeIframeAPIReady?: () => void;
    };

    if (win.YT?.Player) {
      createPlayer();
    } else {
      if (!document.getElementById("yt-api-script")) {
        const s = document.createElement("script");
        s.id = "yt-api-script";
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      const prev = win.onYouTubeIframeAPIReady;
      win.onYouTubeIframeAPIReady = () => { prev?.(); createPlayer(); };
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      ytPlayerRef.current?.destroy();
    };
  }, []);

  // ── GSAP horizontal scroll ─────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track) return;

    const panels    = Array.from(track.children) as HTMLElement[];
    const numPanels = panels.length;

    const ctx = gsap.context(() => {
      // ── 1. Translate the entire track leftward as the user scrolls ──────
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger:           container,
          pin:               true,
          scrub:             0.4,
          snap: {
            snapTo:      1 / (numPanels - 1),
            directional: true,   // any scroll forward = next panel, backward = prev
            duration:    { min: 0.1, max: 0.3 },
            delay:       0,
            ease:        "power3.out",
          },
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,

          // Track active panel for dot indicator
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (numPanels - 1));
            setActivePanel(idx);
          },
        },
      });

      // ── 2. Background parallax — images move at 80% of panel speed ──────
      // Backgrounds are in .data-parallax divs.
      // They're carried by the track (100%), but we add back +20% rightward
      // offset so their net movement is 80% — creating depth illusion.
      const bgs = Array.from(
        track.querySelectorAll<HTMLElement>("[data-parallax]")
      );
      if (bgs.length) {
        gsap.to(bgs, {
          x: () => (track.scrollWidth - window.innerWidth) * 0.22,
          ease: "none",
          scrollTrigger: {
            trigger:             container,
            start:               "top top",
            end:     () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub:               0.4,
            invalidateOnRefresh: true,
          },
        });
      }

      // Text content is animated via Framer Motion on panels 2-3 (see JSX).
      // Per-panel GSAP text triggers are skipped here to avoid
      // containerAnimation typing complexity.
    }, container);

    return () => ctx.revert();
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

        {/* ══ Panel 1 — YouTube video hero (m1SvbXLYEEc, 0:22→0:32) ══ */}
        <div className="relative w-screen h-screen shrink-0 overflow-hidden">

          {/* YouTube IFrame API — cover-sized wrapper, player replaces inner div */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "max(177.78vh, 100%)",
              height: "max(100vh, 56.25vw)",
              // scale(1.05) adds ~2.5% overhang on every edge.
              // The panel's overflow:hidden clips that fringe,
              // hiding YouTube's corner logo and any edge UI.
              transform: "translate(-50%, -50%) scale(1.05)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <div ref={ytDivRef} style={{ width: "100%", height: "100%" }} />
          </div>

          {/* Mouse-event interceptor — transparent, sits between iframe (z-0)
              and overlay (z-10). Absorbs all hover/click events so they
              never reach the YouTube iframe → YouTube's hover UI (play/pause
              button) is never triggered. Content at z-20 still works normally
              because its z-index is higher than this layer. */}
          <div
            className="absolute inset-0"
            style={{ zIndex: 5 }}
            aria-hidden="true"
          />

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
          >
            {/* Dark pill — covers YouTube button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pointer-events-none select-none mt-8"
            >
              <div className="flex items-center gap-4 px-8 py-[19px] rounded-full border border-white/[0.15] bg-black/60 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                <span className="text-white/80 text-[12px] uppercase tracking-[0.28em] font-semibold whitespace-nowrap">
                  Awakenings Festival · July 10–12, 2026
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
              </div>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="flex items-baseline justify-center gap-6 sm:gap-10"
            >
              {[
                { val: d, label: "days" },
                { val: h, label: "hrs" },
                { val: m, label: "min" },
                { val: s, label: "sec" },
              ].map(({ val, label }, i) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <span
                    className="font-[var(--font-playfair)] font-black text-white tabular-nums"
                    style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em" }}
                  >
                    {String(val).padStart(2, "0")}
                  </span>
                  <span className="text-zinc-600 text-[10px] uppercase tracking-[0.15em] font-medium">
                    {label}
                  </span>
                  {i < 3 && (
                    <span className="text-zinc-700 ml-4 font-light text-xl leading-none select-none">·</span>
                  )}
                </div>
              ))}
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
