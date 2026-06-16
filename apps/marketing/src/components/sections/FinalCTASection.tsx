"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTASection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current?.querySelectorAll(".cta-word") ?? [],
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        ".cta-subtitle, .cta-actions",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="final-cta" ref={sectionRef} id="cta">
      <div className="final-cta-bg" />
      <div className="grid-overlay" />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <h2 className="final-cta-headline" ref={headlineRef} style={{ overflow: "hidden" }}>
          {"Ready to\nship?".split("\n").map((line, lineIdx) => (
            <span key={lineIdx} style={{ display: "block", overflow: "hidden" }}>
              {line.split(" ").map((word, wordIdx) => (
                <span
                  key={wordIdx}
                  className="cta-word"
                  style={{ display: "inline-block", marginRight: "0.25em" }}
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <p
          className="cta-subtitle"
          style={{
            fontSize: "var(--text-xl)",
            color: "var(--fg-muted)",
            maxWidth: "480px",
            margin: "0 auto 3rem",
            lineHeight: 1.6,
          }}
        >
          Join 12,000+ engineering teams that trust Laayers to keep their
          production environments sane.
        </p>

        <div className="cta-actions" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="#" className="btn btn-primary" style={{ padding: "1rem 2rem", fontSize: "var(--text-base)" }}>
            Start for free
            <ArrowRight size={18} />
          </Link>
          <Link href="#" className="btn btn-secondary" style={{ padding: "1rem 2rem", fontSize: "var(--text-base)" }}>
            Talk to sales
          </Link>
        </div>

        <p style={{ marginTop: "2rem", fontSize: "var(--text-xs)", color: "var(--fg-subtle)" }}>
          No credit card required. Free tier available. Enterprise demo on request.
        </p>
      </div>
    </section>
  );
}
