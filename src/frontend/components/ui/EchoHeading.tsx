"use client";

import { useRef, useEffect } from "react";
import type { ElementType, ReactNode, CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface EchoHeadingProps {
  as?: "h1" | "h2" | "h3" | "h4";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * EchoHeading — renders the heading with two ghost copies absolutely
 * positioned on top of it. As the section enters the viewport (scrubbed
 * to scroll position), the ghosts drift upward at different speeds and
 * fade to zero — producing the layered "echo collapsing into place" effect
 * seen in the reference reel.
 *
 * Requires GSAP + ScrollTrigger (registered inside useEffect).
 */
export function EchoHeading({ as = "h2", children, className, style }: EchoHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const Tag = as as ElementType;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const echoes = Array.from(
      container.querySelectorAll<HTMLElement>("[data-echo]")
    );
    if (!echoes.length) return;

    const ctx = gsap.context(() => {
      // Each echo starts at y=0 (on top of main text), then drifts upward
      // at a different speed — faster echo feels further away
      echoes.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 0, opacity: 0.06 + i * 0.05 },
          {
            y: -(45 + i * 30),
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top 78%",
              end: "center 30%",
              scrub: 0.9 + i * 0.55, // intentionally different scrub speeds
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Two ghost echo layers — absolute, pointer-events off */}
      {[0, 1].map((i) => (
        <Tag
          key={i}
          data-echo="true"
          className={className ?? ""}
          style={{
            ...style,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            pointerEvents: "none",
            userSelect: "none",
            opacity: 0.06 + i * 0.05, // set by GSAP fromTo as well; keeps correct initial render
          }}
          aria-hidden="true"
        >
          {children}
        </Tag>
      ))}

      {/* Primary heading — in normal flow, sets container height */}
      <Tag className={className} style={style}>
        {children}
      </Tag>
    </div>
  );
}
