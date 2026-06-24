"use client";

import { motion } from "framer-motion";

interface LineRevealProps {
  children: React.ReactNode;
  /** stagger offset in seconds */
  delay?: number;
  /** extra classes on the outer clip container */
  className?: string;
}

/**
 * LineReveal — wraps text in an overflow:hidden clip then slides the inner
 * content up from y=105% → 0%, producing the cinema "wipe" entrance effect
 * seen in premium editorial sites and the reel reference.
 *
 * Usage: wrap each heading line individually so they stagger:
 *   <h2>
 *     <LineReveal>First line</LineReveal>
 *     <LineReveal delay={0.09}>Second line</LineReveal>
 *   </h2>
 */
export function LineReveal({ children, delay = 0, className = "" }: LineRevealProps) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
          delay,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
