"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Lenis intercepts native scroll events via CSS transform, which prevents
    // IntersectionObserver (used by Framer Motion whileInView/useInView) from
    // firing on real mobile devices. Native scroll is the correct behaviour on
    // touch-primary devices and works perfectly with Framer Motion out of the box.
    const isTouchPrimary =
      typeof window !== "undefined" &&
      (window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
       ("ontouchstart" in window) ||
       (navigator.maxTouchPoints > 0) ||
       window.innerWidth < 1024);

    if (isTouchPrimary) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0, // belt-and-suspenders: do not intercept touch on desktop either
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
