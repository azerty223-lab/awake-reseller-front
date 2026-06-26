"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      // 0.85 s feels responsive without being jarring.
      // The original 1.2 s made the tickets page feel sluggish because
      // the easing tail dragged noticeably on short flick-scrolls.
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Drive Lenis from GSAP's own RAF so ScrollTrigger never drifts
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    // Re-calculate scroll limits whenever the document body changes height.
    // Without this, async content (images, lazy components) that loads after
    // Lenis initialises causes Lenis to cap scroll before the real bottom.
    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.body);

    return () => {
      lenis.destroy();
      ro.disconnect();
    };
  }, []);

  return <>{children}</>;
}
