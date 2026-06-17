"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? scrolled / max : 0;
      bar.style.transform = `scaleX(${pct})`;
    };

    // Initialize position
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      id="scroll-progress"
      className="fixed top-0 left-0 right-0 h-[1px] bg-white origin-left z-50 pointer-events-none transform scale-x-0 transition-transform duration-75"
      aria-hidden="true"
    />
  );
}
