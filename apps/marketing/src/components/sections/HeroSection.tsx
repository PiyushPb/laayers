"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.8 });

      // Stagger headline words
      tl.fromTo(
        headlineRef.current?.querySelectorAll("span") ?? [],
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power4.out", stagger: 0.08 }
      )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5"
        );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero noise">
      <div className="hero-bg" />
      <div className="grid-overlay" />

      <div className="container">
        <div className="hero-content">
          <h1 className="hero-headline" ref={headlineRef} style={{ overflow: "hidden" }}>
            <span style={{ display: "block", overflow: "hidden" }}>
              <span style={{ display: "block" }}>Infrastructure</span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <span style={{ display: "block", color: "var(--fg-muted)" }}>for teams</span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <span style={{ display: "block" }}>that ship.</span>
            </span>
          </h1>

          <p className="hero-subline" ref={subRef} style={{ opacity: 0 }}>
            Laayers gives engineering teams a unified control plane for deployments,
            observability, and access management — without the operational overhead.
          </p>

          <div className="hero-cta-row" ref={ctaRef} style={{ opacity: 0 }}>
            <Link href="#" className="btn btn-primary">
              Start for free
              <ArrowRight size={16} />
            </Link>
            <Link href="/#showcase" className="btn btn-secondary">
              View product
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <div className="hero-scroll-line" />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--fg-subtle)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Scroll
        </span>
      </div>
    </section>
  );
}
