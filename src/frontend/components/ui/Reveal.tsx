"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  /** "up" = clip from bottom. "left" = wipe from right. "right" = wipe from left. */
  direction?: "up" | "left" | "right";
  className?: string;
}

/**
 * Reveal — block-level clip-path entrance.
 *
 * Unlike LineReveal (which y-translates inline text), this clips the entire
 * block element by animating an inset() clip-path. The result is a precise
 * "blade" reveal: the content appears to be uncovered from one edge.
 *
 * Use for: section cards, image blocks, stat rows — anything block-level.
 * Use LineReveal for individual heading lines.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 1.05,
  direction = "up",
  className = "",
}: RevealProps) {
  const ref  = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const hidden: Record<string, string> = {
    up:    "inset(0 0 100% 0)",
    left:  "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: hidden[direction], opacity: 0.6 }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : {}}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
