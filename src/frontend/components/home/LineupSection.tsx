"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";

// ── Types ────────────────────────────────────────────────────────────────────

interface Slot { time: string; artist: string; }
interface Area { id: string; label: string; note?: string; slots: Slot[]; }
type DayKey = "Friday" | "Saturday" | "Sunday";

// ── Lineup data ──────────────────────────────────────────────────────────────

const LINEUP: Record<DayKey, Area[]> = {
  Friday: [
    {
      id: "V", label: "Area V",
      slots: [
        { time: "15:00 – 17:30", artist: "Saidah" },
        { time: "17:30 – 19:00", artist: "Pegassi" },
        { time: "19:00 – 20:30", artist: "Patrick Mason" },
        { time: "20:30 – 22:00", artist: "I Hate Models" },
        { time: "22:00 – 23:30", artist: "DJ Gigola & Funk Tribu" },
        { time: "23:30 – 01:00", artist: "Amelie Lens" },
      ],
    },
    {
      id: "A", label: "Area A",
      slots: [
        { time: "15:00 – 17:00", artist: "Olive Anguz" },
        { time: "17:00 – 18:30", artist: "Franck & Upper90" },
        { time: "18:30 – 20:00", artist: "Serafina" },
        { time: "20:00 – 22:00", artist: "Future.666 & Überkikz" },
        { time: "22:00 – 23:30", artist: "Cloudy" },
        { time: "23:30 – 01:00", artist: "Adrián Mills" },
      ],
    },
    {
      id: "B", label: "Area B",
      slots: [
        { time: "15:00 – 16:30", artist: "AAT" },
        { time: "16:30 – 18:30", artist: "M-high & Sidney Charles" },
        { time: "18:30 – 20:00", artist: "Cloonee" },
        { time: "20:00 – 21:30", artist: "Wade" },
        { time: "21:30 – 23:30", artist: "East End Dubs & Vintage Culture" },
        { time: "23:30 – 01:00", artist: "Gordo" },
      ],
    },
    {
      id: "C", label: "Area C",
      slots: [
        { time: "15:00 – 17:00", artist: "Helsloot" },
        { time: "17:00 – 18:30", artist: "KASIA" },
        { time: "18:30 – 20:00", artist: "Marco Faraone" },
        { time: "20:00 – 21:30", artist: "Alan Fitzpatrick" },
        { time: "21:30 – 23:00", artist: "Anfisa Letyago" },
        { time: "23:00 – 01:00", artist: "Joris Voorn" },
      ],
    },
    {
      id: "X", label: "Area X",
      slots: [
        { time: "16:00 – 18:00", artist: "Bullzeye" },
        { time: "18:00 – 19:30", artist: "Elli Acula" },
        { time: "19:30 – 21:00", artist: "Marrøn" },
        { time: "21:00 – 23:00", artist: "DJ Rush" },
        { time: "23:00 – 01:00", artist: "Speedy J" },
      ],
    },
    {
      id: "H", label: "Area H",
      slots: [
        { time: "16:30 – 18:00", artist: "BIANKA" },
        { time: "18:00 – 19:30", artist: "Zisko" },
        { time: "19:30 – 21:00", artist: "Mac Declos" },
        { time: "21:00 – 22:30", artist: "Philippa Pacho" },
        { time: "22:30 – 00:00", artist: "Lobster" },
      ],
    },
    {
      id: "N", label: "Area N", note: "Camping After",
      slots: [
        { time: "00:30 – 02:00", artist: "Locus Error" },
        { time: "02:00 – 03:30", artist: "Estella Boersma" },
        { time: "03:30 – 05:00", artist: "Lacchesi" },
      ],
    },
  ],
  Saturday: [
    {
      id: "V", label: "Area V",
      slots: [
        { time: "13:00 – 15:00", artist: "Benja & Franc Fala" },
        { time: "15:00 – 16:30", artist: "Adam Ten" },
        { time: "16:30 – 18:00", artist: "Miss Monique" },
        { time: "18:00 – 19:30", artist: "Enrico Sangiuliano" },
        { time: "19:30 – 21:30", artist: "Joris Voorn & Kevin de Vries" },
        { time: "21:30 – 23:00", artist: "Joseph Capriati" },
        { time: "23:00 – 01:00", artist: "Adam Beyer" },
      ],
    },
    {
      id: "A", label: "Area A",
      slots: [
        { time: "13:00 – 14:30", artist: "Kara Okay" },
        { time: "14:30 – 16:00", artist: "Paige Tomlinson" },
        { time: "16:00 – 17:45", artist: "Southstar" },
        { time: "17:45 – 19:15", artist: "Mischluft" },
        { time: "19:15 – 21:00", artist: "DJ Heartstring" },
        { time: "21:00 – 23:00", artist: "Malugi" },
        { time: "23:00 – 01:00", artist: "Anetha" },
      ],
    },
    {
      id: "B", label: "Area B",
      slots: [
        { time: "13:00 – 15:00", artist: "Julian Fijma" },
        { time: "15:00 – 17:00", artist: "Jamback & Marsolo" },
        { time: "17:00 – 19:00", artist: "Enzo Siragusa" },
        { time: "19:00 – 21:00", artist: "Max Dean & Prospa" },
        { time: "21:00 – 23:00", artist: "Josh Baker" },
        { time: "23:00 – 01:00", artist: "Kettama" },
      ],
    },
    {
      id: "C", label: "Area C",
      slots: [
        { time: "13:00 – 15:30", artist: "Niiomi" },
        { time: "15:30 – 18:30", artist: "NOVA:II" },
        { time: "18:30 – 21:00", artist: "Mahmut Orhan & Shimza" },
        { time: "21:00 – 23:00", artist: "Colyn" },
        { time: "23:00 – 01:00", artist: "Stephan Bodzin (live)" },
      ],
    },
    {
      id: "X", label: "Area X",
      slots: [
        { time: "13:00 – 14:45", artist: "SHE/HER" },
        { time: "14:45 – 16:15", artist: "Grace Dahl" },
        { time: "16:15 – 18:00", artist: "Adiel" },
        { time: "18:00 – 19:45", artist: "Rødhåd" },
        { time: "19:45 – 21:30", artist: "Len Faki" },
        { time: "21:30 – 23:15", artist: "FJAAK" },
        { time: "23:15 – 01:00", artist: "Dax J" },
      ],
    },
    {
      id: "Y", label: "Area Y",
      slots: [
        { time: "13:00 – 15:00", artist: "Fiene" },
        { time: "15:00 – 16:30", artist: "DIØN" },
        { time: "16:30 – 18:15", artist: "Indira Paganotto" },
        { time: "18:15 – 19:45", artist: "Nico Moreno" },
        { time: "19:45 – 21:30", artist: "Fatima Hajji" },
        { time: "21:30 – 23:15", artist: "Azyr" },
        { time: "23:15 – 01:00", artist: "DYEN" },
      ],
    },
    {
      id: "H", label: "Area H",
      slots: [
        { time: "15:00 – 17:00", artist: "ALI3N" },
        { time: "17:00 – 18:30", artist: "Isabel Soto" },
        { time: "18:30 – 19:30", artist: "Vladimir Dubyshkin (live)" },
        { time: "19:30 – 21:00", artist: "Beste Hira" },
        { time: "21:00 – 22:30", artist: "Rene Wise" },
        { time: "22:30 – 00:00", artist: "Akua & Henning Baer" },
      ],
    },
    {
      id: "S", label: "Area S", note: "Ubuntu",
      slots: [
        { time: "15:00 – 17:00", artist: "GHXST Bunny & Nick SA" },
        { time: "17:00 – 18:00", artist: "Shimza" },
        { time: "18:00 – 20:00", artist: "Shwelly M" },
        { time: "20:00 – 21:30", artist: "Philou Louzolo" },
        { time: "21:30 – 23:00", artist: "Athie Umgido" },
      ],
    },
  ],

  Sunday: [
    {
      id: "V", label: "Area V",
      slots: [
        { time: "13:00 – 15:00", artist: "Julya Karma" },
        { time: "15:00 – 16:30", artist: "Innellea" },
        { time: "16:30 – 18:00", artist: "Boris Brejcha" },
        { time: "18:00 – 19:30", artist: "Adriatique" },
        { time: "19:30 – 21:00", artist: "Richie Hawtin" },
        { time: "21:00 – 23:00", artist: "Charlotte de Witte" },
      ],
    },
    {
      id: "A", label: "Area A",
      slots: [
        { time: "13:00 – 14:30", artist: "Lisa Korver" },
        { time: "14:30 – 16:00", artist: "Lucky Done Gone" },
        { time: "16:00 – 18:00", artist: "LAMMER" },
        { time: "18:00 – 19:30", artist: "Bad Boombox" },
        { time: "19:30 – 21:15", artist: "ØTTA" },
        { time: "21:15 – 23:00", artist: "MCR-T & Partiboi69" },
      ],
    },
    {
      id: "B", label: "Area B",
      slots: [
        { time: "13:00 – 15:00", artist: "Easttown" },
        { time: "15:00 – 16:30", artist: "Joëlla Jackson" },
        { time: "16:30 – 18:00", artist: "Toman" },
        { time: "18:00 – 19:30", artist: "Mau P" },
        { time: "19:30 – 21:00", artist: "Franky Rizardo" },
        { time: "21:00 – 23:00", artist: "Marco Carola" },
      ],
    },
    {
      id: "C", label: "Area C",
      slots: [
        { time: "13:00 – 14:30", artist: "Kaufmann" },
        { time: "14:30 – 16:00", artist: "Mha Iri" },
        { time: "16:00 – 17:45", artist: "Chris Avantgarde" },
        { time: "17:45 – 19:15", artist: "Bart Skils" },
        { time: "19:15 – 21:00", artist: "Pan-Pot" },
        { time: "21:00 – 23:00", artist: "Eli Brown & HI-LO" },
      ],
    },
    {
      id: "X", label: "Area X",
      slots: [
        { time: "13:00 – 14:45", artist: "Julia Maria" },
        { time: "14:45 – 16:30", artist: "Ignez" },
        { time: "16:30 – 18:00", artist: "Nina Kraviz" },
        { time: "18:00 – 19:30", artist: "Freddy K" },
        { time: "19:30 – 21:00", artist: "Ben Klock" },
        { time: "21:00 – 23:00", artist: "Chlär & Yanamaste" },
      ],
    },
    {
      id: "Y", label: "Area Y",
      slots: [
        { time: "13:00 – 14:30", artist: "Samoh (live)" },
        { time: "14:30 – 16:00", artist: "Nikolina" },
        { time: "16:00 – 17:30", artist: "BIIA" },
        { time: "17:30 – 19:00", artist: "Novah" },
        { time: "19:00 – 21:00", artist: "999999999" },
        { time: "21:00 – 23:00", artist: "Cynthia Spiering & Reinier Zonneveld" },
      ],
    },
    {
      id: "H", label: "Area H",
      slots: [
        { time: "15:00 – 16:30", artist: "Valody" },
        { time: "16:30 – 18:00", artist: "Rosati" },
        { time: "18:00 – 20:00", artist: "SHDW" },
        { time: "20:00 – 22:00", artist: "Stranger & Talismann" },
      ],
    },
    {
      id: "N", label: "Area N", note: "Camping After",
      slots: [
        { time: "23:00 – 01:00", artist: "Ares Carter" },
        { time: "01:00 – 03:00", artist: "Joyhauser" },
      ],
    },
  ],
};

const DAYS: DayKey[] = ["Friday", "Saturday", "Sunday"];

// Static metadata per day (date + headline hours for main stages)
const DAY_META: Record<DayKey, { date: string; timeRange: string }> = {
  Friday:   { date: "Friday · July 10, 2026",   timeRange: "15:00 – 01:00" },
  Saturday: { date: "Saturday · July 11, 2026", timeRange: "13:00 – 01:00" },
  Sunday:   { date: "Sunday · July 12, 2026",   timeRange: "13:00 – 23:00" },
};

// ── YouTube background types ──────────────────────────────────────────────────
// Minimal declarations — avoids a full @types/youtube dependency.

interface YTPlayer { destroy(): void; }
interface YTPlayerOptions {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, number | string>;
  events?: {
    onStateChange?: (event: { data: number }) => void;
    onReady?: (event: { target: YTPlayer }) => void;
    onError?: () => void;
  };
}
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement | string, opts: YTPlayerOptions) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// ── YouTube IFrame API hook ───────────────────────────────────────────────────
// Official video: 999999999 @ Awakenings Festival 2025 (Awakenings YouTube channel)
// Fallback: canvas animation below

const YT_VIDEO_ID = "4ayP8pfGMoc"; // 999999999 | Awakenings Festival 2025

function useYouTubeBackground(
  divRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  onPlayingRef: React.RefObject<() => void>,
) {
  useEffect(() => {
    if (!enabled) return;

    let player: YTPlayer | null = null;

    function createPlayer() {
      const div = divRef.current;
      if (!window.YT || !div) return;

      player = new window.YT.Player(div, {
        videoId: YT_VIDEO_ID,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1, mute: 1, loop: 1,
          playlist: YT_VIDEO_ID,
          controls: 0, disablekb: 1,
          rel: 0, playsinline: 1,
          modestbranding: 1, iv_load_policy: 3,
          start: 45,
        },
        events: {
          onStateChange: (e) => {
            if (e.data === 1) onPlayingRef.current?.(); // YT.PlayerState.PLAYING
          },
          onError: () => { /* canvas fallback handles this naturally */ },
        },
      });
    }

    if (window.YT) {
      createPlayer();
    } else {
      if (!document.getElementById("yt-api-script")) {
        const s = document.createElement("script");
        s.id = "yt-api-script";
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
    }

    return () => {
      player?.destroy();
    };
  }, [enabled]); // divRef and onPlayingRef are stable refs
}

// ── Canvas stage animation ────────────────────────────────────────────────────
// Enhanced beam setup: wider spread, blue accent beams, richer haze

interface Beam {
  angle: number; speed: number; amp: number; phase: number;
  r: number; g: number; b: number;
}

const CANVAS_BEAMS: Beam[] = [
  { angle: -52, speed: 0.12, amp:  9, phase: 0.0, r: 6,   g: 182, b: 212 },
  { angle: -34, speed: 0.19, amp: 14, phase: 1.1, r: 34,  g: 211, b: 238 },
  { angle: -16, speed: 0.27, amp:  8, phase: 2.3, r: 200, g: 215, b: 255 },
  { angle:  -4, speed: 0.35, amp:  5, phase: 3.4, r: 255, g: 245, b: 220 },
  { angle:   4, speed: 0.33, amp:  5, phase: 4.5, r: 255, g: 245, b: 220 },
  { angle:  16, speed: 0.27, amp:  8, phase: 5.6, r: 200, g: 215, b: 255 },
  { angle:  34, speed: 0.19, amp: 14, phase: 6.7, r: 34,  g: 211, b: 238 },
  { angle:  52, speed: 0.12, amp:  9, phase: 7.8, r: 6,   g: 182, b: 212 },
];

function useStageCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let t0: number | null = null;

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function frame(ts: number) {
      if (t0 === null) t0 = ts;
      const t = (ts - t0) / 1000;
      const W = canvas!.offsetWidth;
      const H = canvas!.offsetHeight;
      if (W === 0 || H === 0) { rafId = requestAnimationFrame(frame); return; }

      ctx!.fillStyle = "#030305";
      ctx!.fillRect(0, 0, W, H);

      const sx = W * 0.5;
      const sy = H * 0.72;

      // Stage glow — warm amber halo
      const glow = ctx!.createRadialGradient(sx, sy, 0, sx, sy, W * 0.45);
      glow.addColorStop(0,   "rgba(6,182,212,0.14)");
      glow.addColorStop(0.4, "rgba(6,182,212,0.05)");
      glow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, W, H);

      // Wide ambient fill — slight purple depth
      const amb = ctx!.createRadialGradient(sx, H * 0.3, 0, sx, H * 0.3, W * 0.6);
      amb.addColorStop(0,   "rgba(60,40,100,0.08)");
      amb.addColorStop(1,   "rgba(0,0,0,0)");
      ctx!.fillStyle = amb;
      ctx!.fillRect(0, 0, W, H);

      // Light beams
      CANVAS_BEAMS.forEach(bm => {
        const deg = bm.angle + Math.sin(t * bm.speed * Math.PI * 2 + bm.phase) * bm.amp;
        const rad = (deg * Math.PI) / 180;
        const len = H * 0.90;
        const dx =  Math.sin(rad);
        const dy = -Math.cos(rad);
        const tipX = sx + dx * len;
        const tipY = sy + dy * len;
        const px = -dy, py = dx;
        const bW = 4;
        const tW = len * 0.10;
        const op = 0.28 + 0.20 * Math.sin(t * bm.speed * Math.PI * 2 * 1.7 + bm.phase * 1.2);

        const grad = ctx!.createLinearGradient(sx, sy, tipX, tipY);
        grad.addColorStop(0,    `rgba(${bm.r},${bm.g},${bm.b},${op})`);
        grad.addColorStop(0.50, `rgba(${bm.r},${bm.g},${bm.b},${op * 0.4})`);
        grad.addColorStop(1,    `rgba(${bm.r},${bm.g},${bm.b},0)`);

        ctx!.beginPath();
        ctx!.moveTo(sx + px * bW, sy + py * bW);
        ctx!.lineTo(sx - px * bW, sy - py * bW);
        ctx!.lineTo(tipX - px * tW, tipY - py * tW);
        ctx!.lineTo(tipX + px * tW, tipY + py * tW);
        ctx!.closePath();
        ctx!.fillStyle = grad;
        ctx!.fill();
      });

      // Haze band at stage horizon
      const hAlpha = 0.06 + 0.03 * Math.sin(t * 0.37);
      const haze = ctx!.createLinearGradient(0, sy - H * 0.20, 0, sy + H * 0.06);
      haze.addColorStop(0,   "rgba(6,182,212,0)");
      haze.addColorStop(0.5, `rgba(6,182,212,${hAlpha})`);
      haze.addColorStop(1,   "rgba(3,3,5,0)");
      ctx!.fillStyle = haze;
      ctx!.fillRect(0, sy - H * 0.20, W, H * 0.26);

      // Floor fade
      const floor = ctx!.createLinearGradient(0, sy - 15, 0, H);
      floor.addColorStop(0,    "rgba(3,3,5,0)");
      floor.addColorStop(0.20, "rgba(3,3,5,0.6)");
      floor.addColorStop(1,    "rgba(3,3,5,1)");
      ctx!.fillStyle = floor;
      ctx!.fillRect(0, sy - 15, W, H - sy + 15);

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);
}

// ── Day selector card ─────────────────────────────────────────────────────────

function DayCard({
  day, isActive, onClick,
}: {
  day: DayKey;
  isActive: boolean;
  onClick: () => void;
}) {
  const meta = DAY_META[day];
  const areaCount = LINEUP[day].length;

  return (
    <motion.button
      onClick={onClick}
      aria-pressed={isActive}
      whileHover={!isActive ? { scale: 1.018, y: -4 } : { scale: 1.006 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={[
        "flex-1 relative text-left px-6 sm:px-8 py-6 sm:py-7 rounded-2xl border-2",
        "overflow-hidden group",
        isActive
          ? "border-[#06B6D4] bg-[#06B6D4]/[0.08]"
          : "border-white/[0.09] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04] transition-colors duration-300",
      ].join(" ")}
    >
      {/* Active: shimmer sweep (fires once on mount = once on selection) */}
      {isActive && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "200%", opacity: [0, 0.28, 0] }}
          transition={{ duration: 1.1, delay: 0.05, ease: "easeInOut" }}
          className="absolute inset-0 w-full pointer-events-none"
          style={{ background: "linear-gradient(108deg, transparent 30%, rgba(6,182,212,0.18) 50%, transparent 70%)" }}
        />
      )}
      {/* Active: top rule */}
      {isActive && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#06B6D4]/60 to-transparent"
          style={{ transformOrigin: "left" }}
        />
      )}

      {/* Status label */}
      <div className="flex items-center justify-between mb-3">
        <span className={[
          "text-[10px] font-semibold uppercase tracking-[0.22em]",
          isActive ? "text-[#06B6D4]" : "text-zinc-700",
        ].join(" ")}>
          {isActive ? "Selected" : "Select"}
        </span>
        {isActive && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
          </span>
        )}
      </div>

      {/* Day name — the main visual anchor */}
      <div
        className={[
          "font-[var(--font-playfair)] font-black leading-none mb-2",
          isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300 transition-colors",
        ].join(" ")}
        style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", letterSpacing: "-0.025em" }}
      >
        {day}
      </div>

      {/* Date */}
      <div className={[
        "text-sm font-medium mb-4",
        isActive ? "text-zinc-300" : "text-zinc-700",
      ].join(" ")}>
        {meta.date}
      </div>

      {/* Metadata chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={[
          "text-[11px] font-medium px-2.5 py-1 rounded-full border",
          isActive
            ? "bg-[#06B6D4]/[0.12] border-[#06B6D4]/[0.25] text-[#06B6D4]/90"
            : "bg-white/[0.04] border-white/[0.07] text-zinc-600",
        ].join(" ")}>
          {areaCount} stages
        </span>
        <span className={[
          "text-[11px] font-mono font-medium px-2.5 py-1 rounded-full border",
          isActive
            ? "bg-white/[0.05] border-white/[0.1] text-zinc-300"
            : "bg-white/[0.02] border-white/[0.06] text-zinc-700",
        ].join(" ")}>
          {meta.timeRange}
        </span>
      </div>
    </motion.button>
  );
}

// ── Stage section (replaces AreaCard) ────────────────────────────────────────
// Premium festival schedule lane — no boxed cards, no giant background letters.
// Each stage is a horizontal section with a thin accent rail, a compact header,
// and agenda-style set rows with typographic headliner emphasis.

function isAfterMidnight(time: string) {
  return ["00:", "01:", "02:", "03:", "04:", "05:"].some(h => time.startsWith(h));
}

function StageSection({ area, index = 0 }: { area: Area; index?: number }) {
  const last     = area.slots.length - 1;
  const nearLast = last > 1 ? last - 1 : -1;
  const startT   = area.slots[0]?.time.split(" – ")[0] ?? "";
  const endT     = area.slots[last]?.time.split(" – ")[1] ?? "";
  const isNight  = !!area.note; // "Camping After" etc.

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: 0.06 + index * 0.045, ease: [0.16, 1, 0.3, 1] }}
    >

      {/* ── Stage header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pb-3 mb-1 border-b border-white/[0.07]">

        {/* Accent rail */}
        <div className={[
          "w-0.5 h-5 rounded-full shrink-0",
          isNight ? "bg-[#06B6D4]/50" : "bg-white/20",
        ].join(" ")} aria-hidden="true" />

        {/* Stage name */}
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-zinc-300 leading-none">
          {area.label}
        </span>

        {/* "Camping After" or similar badge */}
        {area.note && (
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#06B6D4]/65 bg-[#06B6D4]/[0.08] border border-[#06B6D4]/[0.18] rounded-full px-2 py-0.5 leading-none">
            {area.note}
          </span>
        )}

        {/* Set count + time range — pushed right */}
        <span className="ml-auto text-[10px] font-mono tabular-nums text-zinc-500 shrink-0">
          {area.slots.length} sets&nbsp;·&nbsp;{startT}–{endT}
        </span>
      </div>

      {/* ── Set rows ──────────────────────────────────────────────── */}
      <div>
        {area.slots.map((slot, i) => {
          const isClosing  = i === last;
          const isPeak     = i === nearLast;
          const isLate     = isAfterMidnight(slot.time.split(" – ")[0]);
          const [sT, eT]   = slot.time.split(" – ");

          return (
            <div
              key={i}
              className={[
                "group/row flex items-center gap-3 px-2 rounded-md",
                "transition-colors duration-100 cursor-default",
                isClosing ? "py-2.5 hover:bg-[#06B6D4]/[0.06]"
                          : "py-1.5 hover:bg-white/[0.025]",
              ].join(" ")}
            >
              {/* Start time */}
              <span className={[
                "shrink-0 w-10 text-[11px] tabular-nums font-mono leading-none",
                isLate ? "text-[#06B6D4]/75" : "text-zinc-400",
              ].join(" ")}>
                {sT}
              </span>

              {/* Artist name — size + weight reflect billing tier */}
              <span className={[
                "flex-1 min-w-0 truncate leading-tight",
                isClosing
                  ? "text-[14px] font-bold text-white tracking-tight"
                  : isPeak
                    ? "text-[13px] font-semibold text-zinc-100"
                    : "text-[12.5px] font-normal text-zinc-500",
              ].join(" ")}>
                {slot.artist}
              </span>

              {/* Closing act: cyan headliner dot */}
              {isClosing && (
                <span
                  className="shrink-0 w-1 h-1 rounded-full bg-[#06B6D4]/60"
                  aria-hidden="true"
                />
              )}

              {/* End time */}
              <span className="shrink-0 text-[10px] tabular-nums font-mono text-zinc-500 leading-none">
                {eT}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Shared animation variants ─────────────────────────────────────────────────

const PAGE_VARIANTS = {
  enter: (d: number) => ({
    x: d * 72,
    opacity: 0,
    filter: "blur(10px)",
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: (d: number) => ({
    x: -d * 56,
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.97,
    transition: { duration: 0.26, ease: [0.4, 0, 1, 0.6] as const },
  }),
};

const META_VARIANTS = {
  enter: (d: number) => ({ opacity: 0, x: d * 32 }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: (d: number) => ({
    opacity: 0,
    x: -d * 22,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 0.6] as const },
  }),
};

// ── Main section ──────────────────────────────────────────────────────────────

export function LineupSection() {
  const [activeDay,  setActiveDay]  = useState<DayKey>("Friday");
  const [activeArea, setActiveArea] = useState<string>("V");
  const [ytPlaying,  setYtPlaying]  = useState(false);
  const [dir,        setDir]        = useState<1 | -1>(1);

  const shouldReduce  = useReducedMotion();
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const ytDivRef      = useRef<HTMLDivElement>(null);
  const onPlayingRef  = useRef<() => void>(() => setYtPlaying(true));

  // Canvas runs whenever the video isn't confirmed playing
  useStageCanvas(canvasRef, !shouldReduce);

  // YouTube IFrame API — video fades in once it reports PLAYING state
  useYouTubeBackground(ytDivRef, !shouldReduce, onPlayingRef);

  const areas = LINEUP[activeDay];

  const handleDayChange = useCallback((day: DayKey) => {
    const order: DayKey[] = ["Friday", "Saturday", "Sunday"];
    setDir(order.indexOf(day) > order.indexOf(activeDay) ? 1 : -1);
    setActiveDay(day);
    setActiveArea(LINEUP[day][0].id);
  }, [activeDay]);

  const mobileArea = areas.find(a => a.id === activeArea) ?? areas[0];

  return (
    <section className="relative bg-[#030305] overflow-hidden">

{/* ── Hero: video + canvas background ─────────────────────── */}
      <div className="relative h-[70vh] min-h-[480px] max-h-[680px]">

        {/* Layer -1: Forest stage photo */}
        <img
          src="/bg-lineup.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: -1, objectPosition: "center 30%", filter: "brightness(0.75) saturate(0.90)" }}
        />

        {/* Layer 0: Canvas projector beam animation — primary background */}
        {!shouldReduce && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0"
            aria-hidden="true"
          />
        )}

        {/* Static cinematic gradient for prefers-reduced-motion */}
        {shouldReduce && (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: [
                "radial-gradient(ellipse at 50% 90%, rgba(6,182,212,0.14) 0%, transparent 50%)",
                "radial-gradient(ellipse at 25% 35%, rgba(90,60,160,0.06) 0%, transparent 45%)",
                "radial-gradient(ellipse at 75% 35%, rgba(60,100,200,0.06) 0%, transparent 45%)",
                "#030305",
              ].join(", "),
            }}
            aria-hidden="true"
          />
        )}

        {/* Layer 1: YouTube video — fades in once confirmed playing
            Sized to cover container at correct 16:9 ratio (background-size: cover equivalent) */}
        {!shouldReduce && (
          <div
            className={[
              "absolute inset-0 z-10 overflow-hidden pointer-events-none",
              "transition-opacity duration-[2000ms]",
              ytPlaying ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden="true"
          >
            <div
              ref={ytDivRef}
              style={{
                position:  "absolute",
                top:       "50%",
                left:      "50%",
                transform: "translate(-50%, -50%)",
                /* Cover technique: width = max(100%, 178vh) keeps 16:9 */
                width:     "max(100%, 178vh)",
                height:    "max(100%, 56.25vw)",
              }}
            />
          </div>
        )}

        {/* Layer 2: Cinematic overlays tailored for the forest-stage photo */}
        {/* Top → mid dark for text legibility, opens up toward stage, seals bottom */}
        <div className="absolute inset-0 z-20" style={{
          background: "linear-gradient(to bottom, rgba(3,3,5,0.72) 0%, rgba(3,3,5,0.20) 38%, rgba(3,3,5,0.15) 55%, rgba(3,3,5,0.75) 100%)",
        }} />
        {/* Edge vignette — keeps focus on the tower */}
        <div className="absolute inset-0 z-20" style={{
          background: "radial-gradient(ellipse 70% 80% at 50% 45%, transparent 40%, rgba(3,3,5,0.55) 100%)",
        }} />

        {/* Layer 3: Hero copy */}
        <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.32em] text-zinc-500 mb-6 font-medium"
          >
            Awakenings Festival 2026
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-[var(--font-playfair)] font-black text-white leading-none mb-6"
            style={{ fontSize: "clamp(3.5rem, 11vw, 8.5rem)", letterSpacing: "-0.035em" }}
          >
            Full Lineup
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="text-zinc-500 text-sm tracking-[0.16em] uppercase"
          >
            July 10–12 · Hilvarenbeek, Netherlands
          </motion.p>
        </div>
      </div>

      {/* ── Schedule ─────────────────────────────────────────────── */}
      <div className="relative z-10 pt-4 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* ── Day selector ────────────────────────────────────────
              Two large cards — impossible to miss, immediately obvious */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 text-center mb-6 font-medium">
              Select a day
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4" role="group" aria-label="Day selection">
              {DAYS.map(day => (
                <DayCard
                  key={day}
                  day={day}
                  isActive={activeDay === day}
                  onClick={() => handleDayChange(day)}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Active day context bar ──────────────────────────────── */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={activeDay + "-meta"}
              custom={dir}
              variants={META_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex items-baseline justify-between gap-4 mb-10 pb-6 border-b border-white/[0.06]"
            >
              <div>
                <h3
                  className="font-[var(--font-playfair)] font-black text-white leading-none mb-1"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", letterSpacing: "-0.02em" }}
                >
                  {activeDay}
                </h3>
                <p className="text-sm text-zinc-500">{DAY_META[activeDay].date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-zinc-600 uppercase tracking-[0.14em] mb-0.5">
                  {LINEUP[activeDay].length} stages
                </p>
                <p className="text-sm font-mono text-zinc-400">{DAY_META[activeDay].timeRange}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── DESKTOP: 2-column stage agenda ─────────────────────── */}
          {/* StageSection replaces AreaCard — no boxed cards, schedule lanes */}
          <div className="hidden md:block overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={activeDay}
                custom={dir}
                variants={PAGE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="grid grid-cols-2 gap-x-10 gap-y-0">
                  {LINEUP[activeDay].map((area, i) => (
                    <StageSection key={area.id + activeDay} area={area} index={i} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── MOBILE: area tabs + single schedule ─────────────────── */}
          <div className="block md:hidden">

            {/* Horizontal area tabs */}
            <div
              className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar"
              role="tablist"
              aria-label="Stage selection"
            >
              {LINEUP[activeDay].map(area => (
                <button
                  key={area.id}
                  onClick={() => setActiveArea(area.id)}
                  role="tab"
                  aria-selected={activeArea === area.id}
                  className={[
                    "flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold",
                    "border transition-all duration-150 whitespace-nowrap",
                    activeArea === area.id
                      ? "bg-[#06B6D4]/[0.12] border-[#06B6D4]/40 text-[#06B6D4]"
                      : "bg-white/[0.03] border-white/[0.07] text-zinc-500 hover:text-zinc-200 hover:border-white/[0.14]",
                  ].join(" ")}
                >
                  {area.note ? `${area.label} · ${area.note}` : area.label}
                </button>
              ))}
            </div>

            {/* Selected area content */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={activeDay + activeArea}
                custom={dir}
                variants={PAGE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Area header */}
                <div className="flex items-center gap-3 mb-5">
                  <h4 className="text-lg font-bold text-white tracking-tight">{mobileArea.label}</h4>
                  {mobileArea.note && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#06B6D4]/70 bg-[#06B6D4]/[0.1] border border-[#06B6D4]/[0.2] rounded-full px-2.5 py-1">
                      {mobileArea.note}
                    </span>
                  )}
                  <span className="ml-auto text-[11px] font-mono text-zinc-600">
                    {mobileArea.slots[0]?.time.split(" – ")[0]}
                    {" – "}
                    {mobileArea.slots[mobileArea.slots.length - 1]?.time.split(" – ")[1]}
                  </span>
                </div>

                {/* Slot list — styled to match the desktop schedule aesthetic */}
                <div className="border-t border-white/[0.06]">
                  {mobileArea.slots.map((slot, i) => {
                    const total    = mobileArea.slots.length;
                    const isLast   = i === total - 1;
                    const isNearLast = i === total - 2 && total > 2;
                    const [sT, eT] = slot.time.split(" – ");
                    const isLate   = isAfterMidnight(sT);

                    return (
                      <div
                        key={i}
                        className={[
                          "flex items-center gap-3 px-1 rounded-md transition-colors duration-100",
                          isLast ? "py-3 hover:bg-[#06B6D4]/[0.06]" : "py-2 hover:bg-white/[0.025]",
                        ].join(" ")}
                      >
                        <span className={[
                          "shrink-0 w-11 text-[11px] tabular-nums font-mono",
                          isLate ? "text-[#06B6D4]/75" : "text-zinc-400",
                        ].join(" ")}>
                          {sT}
                        </span>
                        <span className={[
                          "flex-1 min-w-0 truncate leading-tight",
                          isLast     ? "text-[14px] font-bold text-white tracking-tight" : "",
                          isNearLast ? "text-[13px] font-semibold text-zinc-100"         : "",
                          !isLast && !isNearLast ? "text-[12.5px] font-normal text-zinc-500" : "",
                        ].join(" ")}>
                          {slot.artist}
                        </span>
                        {isLast && <span className="shrink-0 w-1 h-1 rounded-full bg-[#06B6D4]/60" aria-hidden="true" />}
                        <span className="shrink-0 text-[10px] tabular-nums font-mono text-zinc-500">
                          {eT}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

