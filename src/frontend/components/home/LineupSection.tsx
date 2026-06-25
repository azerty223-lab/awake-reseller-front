"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Slot { time: string; artist: string; }
interface Area { id: string; label: string; note?: string; slots: Slot[]; }
type DayKey = "Friday" | "Saturday" | "Sunday";

// â”€â”€ Lineup data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const LINEUP: Record<DayKey, Area[]> = {
  Friday: [
    {
      id: "V", label: "Area V",
      slots: [
        { time: "15:00 â€“ 17:30", artist: "Saidah" },
        { time: "17:30 â€“ 19:00", artist: "Pegassi" },
        { time: "19:00 â€“ 20:30", artist: "Patrick Mason" },
        { time: "20:30 â€“ 22:00", artist: "I Hate Models" },
        { time: "22:00 â€“ 23:30", artist: "DJ Gigola & Funk Tribu" },
        { time: "23:30 â€“ 01:00", artist: "Amelie Lens" },
      ],
    },
    {
      id: "A", label: "Area A",
      slots: [
        { time: "15:00 â€“ 17:00", artist: "Olive Anguz" },
        { time: "17:00 â€“ 18:30", artist: "Franck & Upper90" },
        { time: "18:30 â€“ 20:00", artist: "Serafina" },
        { time: "20:00 â€“ 22:00", artist: "Future.666 & Ãœberkikz" },
        { time: "22:00 â€“ 23:30", artist: "Cloudy" },
        { time: "23:30 â€“ 01:00", artist: "AdriÃ¡n Mills" },
      ],
    },
    {
      id: "B", label: "Area B",
      slots: [
        { time: "15:00 â€“ 16:30", artist: "AAT" },
        { time: "16:30 â€“ 18:30", artist: "M-high & Sidney Charles" },
        { time: "18:30 â€“ 20:00", artist: "Cloonee" },
        { time: "20:00 â€“ 21:30", artist: "Wade" },
        { time: "21:30 â€“ 23:30", artist: "East End Dubs & Vintage Culture" },
        { time: "23:30 â€“ 01:00", artist: "Gordo" },
      ],
    },
    {
      id: "C", label: "Area C",
      slots: [
        { time: "15:00 â€“ 17:00", artist: "Helsloot" },
        { time: "17:00 â€“ 18:30", artist: "KASIA" },
        { time: "18:30 â€“ 20:00", artist: "Marco Faraone" },
        { time: "20:00 â€“ 21:30", artist: "Alan Fitzpatrick" },
        { time: "21:30 â€“ 23:00", artist: "Anfisa Letyago" },
        { time: "23:00 â€“ 01:00", artist: "Joris Voorn" },
      ],
    },
    {
      id: "X", label: "Area X",
      slots: [
        { time: "16:00 â€“ 18:00", artist: "Bullzeye" },
        { time: "18:00 â€“ 19:30", artist: "Elli Acula" },
        { time: "19:30 â€“ 21:00", artist: "MarrÃ¸n" },
        { time: "21:00 â€“ 23:00", artist: "DJ Rush" },
        { time: "23:00 â€“ 01:00", artist: "Speedy J" },
      ],
    },
    {
      id: "H", label: "Area H",
      slots: [
        { time: "16:30 â€“ 18:00", artist: "BIANKA" },
        { time: "18:00 â€“ 19:30", artist: "Zisko" },
        { time: "19:30 â€“ 21:00", artist: "Mac Declos" },
        { time: "21:00 â€“ 22:30", artist: "Philippa Pacho" },
        { time: "22:30 â€“ 00:00", artist: "Lobster" },
      ],
    },
    {
      id: "N", label: "Area N", note: "Camping After",
      slots: [
        { time: "00:30 â€“ 02:00", artist: "Locus Error" },
        { time: "02:00 â€“ 03:30", artist: "Estella Boersma" },
        { time: "03:30 â€“ 05:00", artist: "Lacchesi" },
      ],
    },
  ],
  Saturday: [
    {
      id: "V", label: "Area V",
      slots: [
        { time: "13:00 â€“ 15:00", artist: "Benja & Franc Fala" },
        { time: "15:00 â€“ 16:30", artist: "Adam Ten" },
        { time: "16:30 â€“ 18:00", artist: "Miss Monique" },
        { time: "18:00 â€“ 19:30", artist: "Enrico Sangiuliano" },
        { time: "19:30 â€“ 21:30", artist: "Joris Voorn & Kevin de Vries" },
        { time: "21:30 â€“ 23:00", artist: "Joseph Capriati" },
        { time: "23:00 â€“ 01:00", artist: "Adam Beyer" },
      ],
    },
    {
      id: "A", label: "Area A",
      slots: [
        { time: "13:00 â€“ 14:30", artist: "Kara Okay" },
        { time: "14:30 â€“ 16:00", artist: "Paige Tomlinson" },
        { time: "16:00 â€“ 17:45", artist: "Southstar" },
        { time: "17:45 â€“ 19:15", artist: "Mischluft" },
        { time: "19:15 â€“ 21:00", artist: "DJ Heartstring" },
        { time: "21:00 â€“ 23:00", artist: "Malugi" },
        { time: "23:00 â€“ 01:00", artist: "Anetha" },
      ],
    },
    {
      id: "B", label: "Area B",
      slots: [
        { time: "13:00 â€“ 15:00", artist: "Julian Fijma" },
        { time: "15:00 â€“ 17:00", artist: "Jamback & Marsolo" },
        { time: "17:00 â€“ 19:00", artist: "Enzo Siragusa" },
        { time: "19:00 â€“ 21:00", artist: "Max Dean & Prospa" },
        { time: "21:00 â€“ 23:00", artist: "Josh Baker" },
        { time: "23:00 â€“ 01:00", artist: "Kettama" },
      ],
    },
    {
      id: "C", label: "Area C",
      slots: [
        { time: "13:00 â€“ 15:30", artist: "Niiomi" },
        { time: "15:30 â€“ 18:30", artist: "NOVA:II" },
        { time: "18:30 â€“ 21:00", artist: "Mahmut Orhan & Shimza" },
        { time: "21:00 â€“ 23:00", artist: "Colyn" },
        { time: "23:00 â€“ 01:00", artist: "Stephan Bodzin (live)" },
      ],
    },
    {
      id: "X", label: "Area X",
      slots: [
        { time: "13:00 â€“ 14:45", artist: "SHE/HER" },
        { time: "14:45 â€“ 16:15", artist: "Grace Dahl" },
        { time: "16:15 â€“ 18:00", artist: "Adiel" },
        { time: "18:00 â€“ 19:45", artist: "RÃ¸dhÃ¥d" },
        { time: "19:45 â€“ 21:30", artist: "Len Faki" },
        { time: "21:30 â€“ 23:15", artist: "FJAAK" },
        { time: "23:15 â€“ 01:00", artist: "Dax J" },
      ],
    },
    {
      id: "Y", label: "Area Y",
      slots: [
        { time: "13:00 â€“ 15:00", artist: "Fiene" },
        { time: "15:00 â€“ 16:30", artist: "DIÃ˜N" },
        { time: "16:30 â€“ 18:15", artist: "Indira Paganotto" },
        { time: "18:15 â€“ 19:45", artist: "Nico Moreno" },
        { time: "19:45 â€“ 21:30", artist: "Fatima Hajji" },
        { time: "21:30 â€“ 23:15", artist: "Azyr" },
        { time: "23:15 â€“ 01:00", artist: "DYEN" },
      ],
    },
    {
      id: "H", label: "Area H",
      slots: [
        { time: "15:00 â€“ 17:00", artist: "ALI3N" },
        { time: "17:00 â€“ 18:30", artist: "Isabel Soto" },
        { time: "18:30 â€“ 19:30", artist: "Vladimir Dubyshkin (live)" },
        { time: "19:30 â€“ 21:00", artist: "Beste Hira" },
        { time: "21:00 â€“ 22:30", artist: "Rene Wise" },
        { time: "22:30 â€“ 00:00", artist: "Akua & Henning Baer" },
      ],
    },
    {
      id: "S", label: "Area S", note: "Ubuntu",
      slots: [
        { time: "15:00 â€“ 17:00", artist: "GHXST Bunny & Nick SA" },
        { time: "17:00 â€“ 18:00", artist: "Shimza" },
        { time: "18:00 â€“ 20:00", artist: "Shwelly M" },
        { time: "20:00 â€“ 21:30", artist: "Philou Louzolo" },
        { time: "21:30 â€“ 23:00", artist: "Athie Umgido" },
      ],
    },
  ],

  Sunday: [
    {
      id: "V", label: "Area V",
      slots: [
        { time: "13:00 â€“ 15:00", artist: "Julya Karma" },
        { time: "15:00 â€“ 16:30", artist: "Innellea" },
        { time: "16:30 â€“ 18:00", artist: "Boris Brejcha" },
        { time: "18:00 â€“ 19:30", artist: "Adriatique" },
        { time: "19:30 â€“ 21:00", artist: "Richie Hawtin" },
        { time: "21:00 â€“ 23:00", artist: "Charlotte de Witte" },
      ],
    },
    {
      id: "A", label: "Area A",
      slots: [
        { time: "13:00 â€“ 14:30", artist: "Lisa Korver" },
        { time: "14:30 â€“ 16:00", artist: "Lucky Done Gone" },
        { time: "16:00 â€“ 18:00", artist: "LAMMER" },
        { time: "18:00 â€“ 19:30", artist: "Bad Boombox" },
        { time: "19:30 â€“ 21:15", artist: "Ã˜TTA" },
        { time: "21:15 â€“ 23:00", artist: "MCR-T & Partiboi69" },
      ],
    },
    {
      id: "B", label: "Area B",
      slots: [
        { time: "13:00 â€“ 15:00", artist: "Easttown" },
        { time: "15:00 â€“ 16:30", artist: "JoÃ«lla Jackson" },
        { time: "16:30 â€“ 18:00", artist: "Toman" },
        { time: "18:00 â€“ 19:30", artist: "Mau P" },
        { time: "19:30 â€“ 21:00", artist: "Franky Rizardo" },
        { time: "21:00 â€“ 23:00", artist: "Marco Carola" },
      ],
    },
    {
      id: "C", label: "Area C",
      slots: [
        { time: "13:00 â€“ 14:30", artist: "Kaufmann" },
        { time: "14:30 â€“ 16:00", artist: "Mha Iri" },
        { time: "16:00 â€“ 17:45", artist: "Chris Avantgarde" },
        { time: "17:45 â€“ 19:15", artist: "Bart Skils" },
        { time: "19:15 â€“ 21:00", artist: "Pan-Pot" },
        { time: "21:00 â€“ 23:00", artist: "Eli Brown & HI-LO" },
      ],
    },
    {
      id: "X", label: "Area X",
      slots: [
        { time: "13:00 â€“ 14:45", artist: "Julia Maria" },
        { time: "14:45 â€“ 16:30", artist: "Ignez" },
        { time: "16:30 â€“ 18:00", artist: "Nina Kraviz" },
        { time: "18:00 â€“ 19:30", artist: "Freddy K" },
        { time: "19:30 â€“ 21:00", artist: "Ben Klock" },
        { time: "21:00 â€“ 23:00", artist: "ChlÃ¤r & Yanamaste" },
      ],
    },
    {
      id: "Y", label: "Area Y",
      slots: [
        { time: "13:00 â€“ 14:30", artist: "Samoh (live)" },
        { time: "14:30 â€“ 16:00", artist: "Nikolina" },
        { time: "16:00 â€“ 17:30", artist: "BIIA" },
        { time: "17:30 â€“ 19:00", artist: "Novah" },
        { time: "19:00 â€“ 21:00", artist: "999999999" },
        { time: "21:00 â€“ 23:00", artist: "Cynthia Spiering & Reinier Zonneveld" },
      ],
    },
    {
      id: "H", label: "Area H",
      slots: [
        { time: "15:00 â€“ 16:30", artist: "Valody" },
        { time: "16:30 â€“ 18:00", artist: "Rosati" },
        { time: "18:00 â€“ 20:00", artist: "SHDW" },
        { time: "20:00 â€“ 22:00", artist: "Stranger & Talismann" },
      ],
    },
    {
      id: "N", label: "Area N", note: "Camping After",
      slots: [
        { time: "23:00 â€“ 01:00", artist: "Ares Carter" },
        { time: "01:00 â€“ 03:00", artist: "Joyhauser" },
      ],
    },
  ],
};

const DAYS: DayKey[] = ["Friday", "Saturday", "Sunday"];

// Static metadata per day (date + headline hours for main stages)
const DAY_META: Record<DayKey, { date: string; timeRange: string }> = {
  Friday:   { date: "Friday Â· July 10, 2026",   timeRange: "15:00 â€“ 01:00" },
  Saturday: { date: "Saturday Â· July 11, 2026", timeRange: "13:00 â€“ 01:00" },
  Sunday:   { date: "Sunday Â· July 12, 2026",   timeRange: "13:00 â€“ 23:00" },
};

// â”€â”€ YouTube background types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Minimal declarations â€” avoids a full @types/youtube dependency.

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

// â”€â”€ YouTube IFrame API hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Canvas stage animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Enhanced beam setup: wider spread, blue accent beams, richer haze

interface Beam {
  angle: number; speed: number; amp: number; phase: number;
  r: number; g: number; b: number;
}

const CANVAS_BEAMS: Beam[] = [
  { angle: -52, speed: 0.12, amp:  9, phase: 0.0, r: 201, g: 168, b:  76 },
  { angle: -34, speed: 0.19, amp: 14, phase: 1.1, r: 228, g: 186, b: 101 },
  { angle: -16, speed: 0.27, amp:  8, phase: 2.3, r: 200, g: 215, b: 255 },
  { angle:  -4, speed: 0.35, amp:  5, phase: 3.4, r: 255, g: 245, b: 220 },
  { angle:   4, speed: 0.33, amp:  5, phase: 4.5, r: 255, g: 245, b: 220 },
  { angle:  16, speed: 0.27, amp:  8, phase: 5.6, r: 200, g: 215, b: 255 },
  { angle:  34, speed: 0.19, amp: 14, phase: 6.7, r: 228, g: 186, b: 101 },
  { angle:  52, speed: 0.12, amp:  9, phase: 7.8, r: 201, g: 168, b:  76 },
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

      // Stage glow â€” warm amber halo
      const glow = ctx!.createRadialGradient(sx, sy, 0, sx, sy, W * 0.45);
      glow.addColorStop(0,   "rgba(201,168,76,0.14)");
      glow.addColorStop(0.4, "rgba(201,168,76,0.05)");
      glow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, W, H);

      // Wide ambient fill â€” slight purple depth
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
      haze.addColorStop(0,   "rgba(201,168,76,0)");
      haze.addColorStop(0.5, `rgba(201,168,76,${hAlpha})`);
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

// â”€â”€ Day selector card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={[
        "flex-1 relative text-left px-6 sm:px-8 py-6 sm:py-7 rounded-2xl border-2",
        "transition-all duration-300 overflow-hidden group",
        isActive
          ? "border-[#C9A84C] bg-[#C9A84C]/[0.08]"
          : "border-white/[0.09] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {/* Active: subtle gold top rule */}
      {isActive && (
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />
      )}

      {/* Status label */}
      <div className="flex items-center justify-between mb-3">
        <span className={[
          "text-[10px] font-semibold uppercase tracking-[0.22em]",
          isActive ? "text-[#C9A84C]" : "text-zinc-700",
        ].join(" ")}>
          {isActive ? "Selected" : "Select"}
        </span>
        {isActive && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          </span>
        )}
      </div>

      {/* Day name â€” the main visual anchor */}
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
            ? "bg-[#C9A84C]/[0.12] border-[#C9A84C]/[0.25] text-[#C9A84C]/90"
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
    </button>
  );
}

// â”€â”€ Area card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AreaCard({ area }: { area: Area }) {
  const last = area.slots.length - 1;
  // Penultimate slot is also emphasized (second-to-last = peak hour act)
  const nearLast = last > 1 ? last - 1 : -1;

  return (
    <div className="flex flex-col bg-[#0D0D10] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.13] transition-colors duration-200">
      {/* Card header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-1">
              {area.label}
            </p>
            {area.note ? (
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A84C]/70">
                {area.note}
              </p>
            ) : (
              <p className="text-[10px] text-zinc-700 tabular-nums">
                {area.slots.length} sets Â·{" "}
                {area.slots[0]?.time.split(" â€“ ")[0]}
                {" â€“ "}
                {area.slots[last]?.time.split(" â€“ ")[1]}
              </p>
            )}
          </div>
          {/* Area letter â€” large, decorative, low opacity */}
          <span
            className="font-[var(--font-playfair)] font-black text-white/[0.06] leading-none select-none"
            style={{ fontSize: "3rem" }}
            aria-hidden="true"
          >
            {area.id}
          </span>
        </div>
      </div>

      {/* Slot list */}
      <div className="flex-1 divide-y divide-white/[0.04]">
        {area.slots.map((slot, i) => {
          const isClosing    = i === last;
          const isPeakHour   = i === nearLast;
          const isAfterMidnight = slot.time.startsWith("00:") ||
            slot.time.startsWith("01:") ||
            slot.time.startsWith("02:") ||
            slot.time.startsWith("03:") ||
            slot.time.startsWith("04:") ||
            slot.time.startsWith("05:");

          return (
            <div
              key={i}
              className={[
                "flex items-center gap-3 px-5 py-3 transition-colors duration-150",
                isClosing  ? "bg-[#C9A84C]/[0.05] hover:bg-[#C9A84C]/[0.08]" : "hover:bg-white/[0.03]",
              ].join(" ")}
            >
              {/* Time â€” start time only, keeps columns compact */}
              <span className={[
                "shrink-0 w-11 text-[11px] tabular-nums font-mono leading-none",
                isAfterMidnight ? "text-[#C9A84C]/50" : "text-zinc-600",
              ].join(" ")}>
                {slot.time.split(" â€“ ")[0]}
              </span>

              {/* Artist */}
              <span className={[
                "flex-1 text-[13px] leading-tight min-w-0 truncate",
                isClosing  ? "text-white font-semibold"   : "",
                isPeakHour && !isClosing ? "text-zinc-100 font-medium" : "",
                !isClosing && !isPeakHour ? "text-zinc-400 font-normal" : "",
              ].join(" ")}>
                {slot.artist}
              </span>

              {/* End time â€” muted, right edge */}
              <span className="shrink-0 text-[10px] tabular-nums font-mono text-zinc-700 leading-none">
                {slot.time.split(" â€“ ")[1]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// â”€â”€ Main section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function LineupSection() {
  const [activeDay,  setActiveDay]  = useState<DayKey>("Friday");
  const [activeArea, setActiveArea] = useState<string>("V");
  const [ytPlaying,  setYtPlaying]  = useState(false);

  const shouldReduce  = useReducedMotion();
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const ytDivRef      = useRef<HTMLDivElement>(null);
  const onPlayingRef  = useRef<() => void>(() => setYtPlaying(true));

  // Canvas runs whenever the video isn't confirmed playing
  useStageCanvas(canvasRef, !shouldReduce);

  // YouTube IFrame API â€” video fades in once it reports PLAYING state
  useYouTubeBackground(ytDivRef, !shouldReduce, onPlayingRef);

  const areas = LINEUP[activeDay];

  const handleDayChange = useCallback((day: DayKey) => {
    setActiveDay(day);
    setActiveArea(LINEUP[day][0].id);
  }, []);

  const mobileArea = areas.find(a => a.id === activeArea) ?? areas[0];

  return (
    <section className="relative bg-[#030305] overflow-hidden">

{/* â”€â”€ Hero: video + canvas background â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="relative h-[70vh] min-h-[480px] max-h-[680px]">

        {/* Layer 0: Canvas â€” always rendered, video-independent fallback */}
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
                "radial-gradient(ellipse at 50% 90%, rgba(201,168,76,0.14) 0%, transparent 50%)",
                "radial-gradient(ellipse at 25% 35%, rgba(90,60,160,0.06) 0%, transparent 45%)",
                "radial-gradient(ellipse at 75% 35%, rgba(60,100,200,0.06) 0%, transparent 45%)",
                "#030305",
              ].join(", "),
            }}
            aria-hidden="true"
          />
        )}

        {/* Layer 1: YouTube video â€” fades in once confirmed playing
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

        {/* Layer 2: Cinematic dark overlays â€” readability + atmosphere */}
        {/* Top darkening for text legibility */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#030305]/70 via-[#030305]/25 to-[#030305]" />
        {/* Side vignette */}
        <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_50%_50%,transparent_40%,rgba(3,3,5,0.5)_100%)]" />

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
            July 10â€“12 Â· Hilvarenbeek, Netherlands
          </motion.p>
        </div>
      </div>

      {/* â”€â”€ Schedule â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="relative z-10 pt-4 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* â”€â”€ Day selector â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
              Two large cards â€” impossible to miss, immediately obvious */}
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

          {/* â”€â”€ Active day context bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <AnimatePresence>
            <motion.div
              key={activeDay + "-meta"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
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

          {/* â”€â”€ DESKTOP: area grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="hidden md:block">
            <AnimatePresence>
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {LINEUP[activeDay].map(area => (
                    <AreaCard key={area.id + activeDay} area={area} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* â”€â”€ MOBILE: area tabs + single schedule â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
                      ? "bg-[#C9A84C]/[0.12] border-[#C9A84C]/40 text-[#C9A84C]"
                      : "bg-white/[0.03] border-white/[0.07] text-zinc-500 hover:text-zinc-200 hover:border-white/[0.14]",
                  ].join(" ")}
                >
                  {area.note ? `${area.label} Â· ${area.note}` : area.label}
                </button>
              ))}
            </div>

            {/* Selected area content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay + activeArea}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* Area header */}
                <div className="flex items-center gap-3 mb-5">
                  <h4 className="text-lg font-bold text-white tracking-tight">{mobileArea.label}</h4>
                  {mobileArea.note && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A84C]/70 bg-[#C9A84C]/[0.1] border border-[#C9A84C]/[0.2] rounded-full px-2.5 py-1">
                      {mobileArea.note}
                    </span>
                  )}
                  <span className="ml-auto text-[11px] font-mono text-zinc-600">
                    {mobileArea.slots[0]?.time.split(" â€“ ")[0]}
                    {" â€“ "}
                    {mobileArea.slots[mobileArea.slots.length - 1]?.time.split(" â€“ ")[1]}
                  </span>
                </div>

                {/* Slot list */}
                <div className="rounded-2xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.05]">
                  {mobileArea.slots.map((slot, i) => {
                    const isLast     = i === mobileArea.slots.length - 1;
                    const isNearLast = i === mobileArea.slots.length - 2 && mobileArea.slots.length > 2;
                    return (
                      <div
                        key={i}
                        className={[
                          "flex items-center gap-4 px-5 py-4",
                          isLast ? "bg-[#C9A84C]/[0.06]" : "bg-[#0D0D10]",
                        ].join(" ")}
                      >
                        <span className="shrink-0 w-12 text-xs text-zinc-600 tabular-nums font-mono">
                          {slot.time.split(" â€“ ")[0]}
                        </span>
                        <span className={[
                          "flex-1 text-sm min-w-0",
                          isLast     ? "text-white font-semibold" : "",
                          isNearLast ? "text-zinc-100 font-medium" : "",
                          !isLast && !isNearLast ? "text-zinc-400" : "",
                        ].join(" ")}>
                          {slot.artist}
                        </span>
                        <span className="shrink-0 text-[10px] text-zinc-700 tabular-nums font-mono">
                          {slot.time.split(" â€“ ")[1]}
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

