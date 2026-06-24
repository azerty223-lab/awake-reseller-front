"use client";

import { useState, useRef, useEffect } from "react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";

// ── Types ────────────────────────────────────────────────────────────────────

interface Slot { time: string; artist: string; }
interface Area { id: string; label: string; note?: string; slots: Slot[]; }
type DayKey = "Friday" | "Saturday";

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
};

const DAYS: DayKey[] = ["Friday", "Saturday"];

// ── Stage canvas animation ────────────────────────────────────────────────────
// Canvas renders beam cones fanning from a stage point.
// Automatically paused when prefers-reduced-motion is set.

interface Beam {
  angle: number;   // base angle in degrees (0 = straight up)
  speed: number;   // sway cycles per second
  amp: number;     // sway amplitude in degrees
  phase: number;   // phase offset
  r: number; g: number; b: number;  // beam colour
}

const BEAMS: Beam[] = [
  { angle: -46, speed: 0.14, amp:  8, phase: 0.0, r: 201, g: 168, b:  76 },
  { angle: -27, speed: 0.21, amp: 13, phase: 1.3, r: 228, g: 186, b: 101 },
  { angle:  -9, speed: 0.28, amp:  7, phase: 2.6, r: 190, g: 210, b: 255 },
  { angle:   9, speed: 0.26, amp:  7, phase: 3.9, r: 190, g: 210, b: 255 },
  { angle:  27, speed: 0.21, amp: 13, phase: 5.2, r: 228, g: 186, b: 101 },
  { angle:  46, speed: 0.14, amp:  8, phase: 6.5, r: 201, g: 168, b:  76 },
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

      // ── Background ──────────────────────────────────────────────────
      ctx!.fillStyle = "#050507";
      ctx!.fillRect(0, 0, W, H);

      const sx = W * 0.5;   // stage x
      const sy = H * 0.73;  // stage y (low in frame)

      // ── Stage glow ──────────────────────────────────────────────────
      const glow = ctx!.createRadialGradient(sx, sy, 0, sx, sy, W * 0.40);
      glow.addColorStop(0,   "rgba(201,168,76,0.11)");
      glow.addColorStop(0.5, "rgba(201,168,76,0.04)");
      glow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, W, H);

      // ── Light beams ─────────────────────────────────────────────────
      BEAMS.forEach(bm => {
        const deg = bm.angle + Math.sin(t * bm.speed * Math.PI * 2 + bm.phase) * bm.amp;
        const rad = (deg * Math.PI) / 180;

        const len = H * 0.88;
        // Direction: upward == negative-y
        const dx =  Math.sin(rad);
        const dy = -Math.cos(rad);

        const tipX = sx + dx * len;
        const tipY = sy + dy * len;

        // Perpendicular to beam direction
        const px = -dy;
        const py =  dx;

        const bW = 5;            // half-width at base
        const tW = len * 0.115;  // half-width at tip (cone spread)

        // Opacity pulses independently of sway
        const op = 0.32 + 0.22 * Math.sin(t * bm.speed * Math.PI * 2 * 1.6 + bm.phase * 1.1);

        const grad = ctx!.createLinearGradient(sx, sy, tipX, tipY);
        grad.addColorStop(0,   `rgba(${bm.r},${bm.g},${bm.b},${op})`);
        grad.addColorStop(0.55,`rgba(${bm.r},${bm.g},${bm.b},${op * 0.45})`);
        grad.addColorStop(1,   `rgba(${bm.r},${bm.g},${bm.b},0)`);

        ctx!.beginPath();
        ctx!.moveTo(sx + px * bW, sy + py * bW);
        ctx!.lineTo(sx - px * bW, sy - py * bW);
        ctx!.lineTo(tipX - px * tW, tipY - py * tW);
        ctx!.lineTo(tipX + px * tW, tipY + py * tW);
        ctx!.closePath();
        ctx!.fillStyle = grad;
        ctx!.fill();
      });

      // ── Haze band ────────────────────────────────────────────────────
      const hAlpha = 0.055 + 0.025 * Math.sin(t * 0.38);
      const haze = ctx!.createLinearGradient(0, sy - H * 0.18, 0, sy + H * 0.05);
      haze.addColorStop(0,   `rgba(201,168,76,0)`);
      haze.addColorStop(0.5, `rgba(201,168,76,${hAlpha})`);
      haze.addColorStop(1,   `rgba(5,5,7,0)`);
      ctx!.fillStyle = haze;
      ctx!.fillRect(0, sy - H * 0.18, W, H * 0.23);

      // ── Crowd floor fade ─────────────────────────────────────────────
      const floor = ctx!.createLinearGradient(0, sy - 10, 0, H);
      floor.addColorStop(0,   "rgba(5,5,7,0)");
      floor.addColorStop(0.25,"rgba(5,5,7,0.65)");
      floor.addColorStop(1,   "rgba(5,5,7,1)");
      ctx!.fillStyle = floor;
      ctx!.fillRect(0, sy - 10, W, H - sy + 10);

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);  // canvasRef is a stable object, omitted intentionally
}

// ── Area card (desktop grid) ─────────────────────────────────────────────────

function AreaCard({ area }: { area: Area }) {
  const last = area.slots.length - 1;
  return (
    <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white">
          {area.label}
        </span>
        {area.note && (
          <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#C9A84C]/70 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded px-1.5 py-0.5 leading-none">
            {area.note}
          </span>
        )}
      </div>

      {/* Slots */}
      <div className="divide-y divide-white/[0.04]">
        {area.slots.map((slot, i) => (
          <div
            key={i}
            className="flex items-baseline gap-3 px-4 py-2.5 hover:bg-white/[0.03] transition-colors duration-150"
          >
            <span className="shrink-0 w-[6.5rem] text-[11px] text-zinc-600 tabular-nums font-mono leading-none">
              {slot.time}
            </span>
            <span className={[
              "text-[13px] leading-tight min-w-0",
              i === last
                ? "text-white font-semibold"   // closing act
                : "text-zinc-300 font-normal",
            ].join(" ")}>
              {slot.artist}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────

export function LineupSection() {
  const [activeDay,  setActiveDay]  = useState<DayKey>("Friday");
  const [activeArea, setActiveArea] = useState<string>("V");

  const shouldReduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animate canvas only when motion is preferred
  useStageCanvas(canvasRef, !shouldReduce);

  const areas = LINEUP[activeDay];

  const handleDayChange = (day: DayKey) => {
    setActiveDay(day);
    setActiveArea(LINEUP[day][0].id);
  };

  const mobileArea = areas.find(a => a.id === activeArea) ?? areas[0];

  return (
    <section className="relative bg-[#050507] overflow-hidden">

      {/* ── Stage hero background ────────────────────────────────── */}
      <div className="relative h-[56vh] min-h-[360px] max-h-[520px]">

        {/* Animated canvas — hidden when prefers-reduced-motion */}
        {!shouldReduce ? (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          />
        ) : (
          /* Static cinematic fallback */
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse at 50% 88%, rgba(201,168,76,0.13) 0%, transparent 48%)",
                "radial-gradient(ellipse at 20% 40%, rgba(180,210,255,0.04) 0%, transparent 42%)",
                "radial-gradient(ellipse at 80% 40%, rgba(180,210,255,0.04) 0%, transparent 42%)",
                "#050507",
              ].join(", "),
            }}
            aria-hidden="true"
          />
        )}

        {/* Text legibility: strong top fade, seamless bottom transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/60 via-transparent to-[#050507]" />

        {/* Hero copy */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-5 font-medium"
          >
            Awakenings Festival 2026
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-[var(--font-playfair)] font-black text-white leading-none mb-5"
            style={{ fontSize: "clamp(3rem, 9vw, 7rem)", letterSpacing: "-0.03em" }}
          >
            Full Lineup
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-zinc-500 text-sm tracking-[0.12em] uppercase"
          >
            July 10–12 · Hilvarenbeek
          </motion.p>
        </div>
      </div>

      {/* ── Lineup grid ──────────────────────────────────────────── */}
      <div className="pt-14 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Day tabs */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex border-b border-white/[0.08]">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => handleDayChange(day)}
                  className={[
                    "px-10 py-3 text-sm font-semibold tracking-wide border-b-2 -mb-px transition-colors duration-200",
                    activeDay === day
                      ? "border-[#C9A84C] text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-300",
                  ].join(" ")}
                  aria-selected={activeDay === day}
                  role="tab"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* ── DESKTOP: full grid ────────────────────────────────
              Hidden below md, uses AnimatePresence for day switch */}
          <div className="hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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

          {/* ── MOBILE: area tabs + single view ──────────────────
              Shown below md only */}
          <div className="block md:hidden">

            {/* Area selector — horizontal scroll */}
            <div
              className="flex gap-2 overflow-x-auto pb-3 mb-6 hide-scrollbar"
              role="tablist"
            >
              {LINEUP[activeDay].map(area => (
                <button
                  key={area.id}
                  onClick={() => setActiveArea(area.id)}
                  role="tab"
                  aria-selected={activeArea === area.id}
                  className={[
                    "flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold",
                    "border transition-colors duration-150 whitespace-nowrap",
                    activeArea === area.id
                      ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]"
                      : "bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-zinc-200",
                  ].join(" ")}
                >
                  {area.note ? `${area.label} — ${area.note}` : area.label}
                </button>
              ))}
            </div>

            {/* Selected area schedule */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay + activeArea}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {/* Area header */}
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-bold text-white">{mobileArea.label}</h3>
                  {mobileArea.note && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A84C]/70 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded px-2 py-0.5">
                      {mobileArea.note}
                    </span>
                  )}
                </div>

                {/* Slot list */}
                <div className="divide-y divide-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden">
                  {mobileArea.slots.map((slot, i) => {
                    const isLast = i === mobileArea.slots.length - 1;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-4 px-4 py-3.5 bg-white/[0.02]"
                      >
                        <span className="shrink-0 w-[7rem] text-[11px] text-zinc-600 tabular-nums font-mono">
                          {slot.time}
                        </span>
                        <span className={[
                          "text-sm min-w-0",
                          isLast
                            ? "text-white font-semibold"
                            : "text-zinc-300 font-normal",
                        ].join(" ")}>
                          {slot.artist}
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
