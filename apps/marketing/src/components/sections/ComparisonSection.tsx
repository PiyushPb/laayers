"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Minus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  { feature: "Zero-downtime deployments", us: true, comp1: true, comp2: false },
  { feature: "Automatic canary analysis", us: true, comp1: false, comp2: false },
  { feature: "Unified observability", us: true, comp1: false, comp2: true },
  { feature: "Environment access control", us: true, comp1: true, comp2: true },
  { feature: "Secrets management", us: true, comp1: true, comp2: false },
  { feature: "SCIM / SSO provisioning", us: true, comp1: false, comp2: false },
  { feature: "SOC 2 Type II certified", us: true, comp1: true, comp2: false },
  { feature: "Preview environments", us: true, comp1: true, comp2: true },
  { feature: "Full audit trail", us: true, comp1: false, comp2: false },
  { feature: "Self-hosted option", us: true, comp1: false, comp2: true },
];

const testimonials = [
  {
    quote:
      "Laayers replaced four tools we were paying for separately. The consolidation alone paid for itself in the first quarter.",
    name: "Marcus Webb",
    role: "VP Engineering",
    company: "Cascade AI",
  },
  {
    quote:
      "Our on-call rotation got three hours of sleep back per week after switching. The correlation engine is genuinely useful.",
    name: "Priya Nair",
    role: "Staff Engineer",
    company: "Meridian Health",
  },
  {
    quote:
      "I was skeptical about another DevOps platform, but the canary analysis has saved us from three bad deploys this month alone.",
    name: "Thomas Park",
    role: "CTO",
    company: "Buildwire",
  },
];

export default function ComparisonSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".comparison-table",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".comparison-table",
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    // Auto-advance testimonials
    const interval = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      activeRef.current = (activeRef.current + 1) % testimonials.length;
      gsap.to(track, {
        x: `-${activeRef.current * 100}%`,
        duration: 0.8,
        ease: "power3.inOut",
      });
      // Update dots
      document.querySelectorAll(".testimonial-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === activeRef.current);
      });
    }, 5000);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Comparison Table */}
      <section className="section" ref={sectionRef} id="comparison">
        <div className="container">
          <p className="text-eyebrow" style={{ marginBottom: "2rem" }}>Comparison</p>
          <h2 className="text-display-sm" style={{ marginBottom: "4rem", maxWidth: "600px" }}>
            How we stack up.
          </h2>

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th style={{ width: "45%" }}>Feature</th>
                  <th className="highlight">Laayers</th>
                  <th className="comparison-hide-mobile">Competitor A</th>
                  <th className="comparison-hide-mobile">Competitor B</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature}>
                    <td className="feature-name">{row.feature}</td>
                    <td className="highlight" style={{ textAlign: "center" }}>
                      {row.us ? <Check size={16} className="check-icon" style={{ margin: "0 auto" }} /> : <Minus size={16} className="cross-icon" style={{ margin: "0 auto" }} />}
                    </td>
                    <td style={{ textAlign: "center" }} className="comparison-hide-mobile">
                      {row.comp1 ? <Check size={16} className="check-icon" style={{ margin: "0 auto" }} /> : <Minus size={16} className="cross-icon" style={{ margin: "0 auto" }} />}
                    </td>
                    <td style={{ textAlign: "center" }} className="comparison-hide-mobile">
                      {row.comp2 ? <Check size={16} className="check-icon" style={{ margin: "0 auto" }} /> : <Minus size={16} className="cross-icon" style={{ margin: "0 auto" }} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonial-section" id="testimonials">
        <div className="container">
          <p className="text-eyebrow" style={{ marginBottom: "3rem" }}>Customer Stories</p>

          <div style={{ overflow: "hidden" }} ref={testimonialRef}>
            <div className="testimonial-track" ref={trackRef}>
              {testimonials.map((t) => (
                <div key={t.name} className="testimonial-card">
                  <div>
                    <p className="testimonial-quote">{t.quote}</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar" />
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-role">{t.role}</span>
                    <span className="testimonial-company">{t.company}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="testimonial-controls">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot ${i === 0 ? "active" : ""}`}
                onClick={() => {
                  if (!trackRef.current) return;
                  activeRef.current = i;
                  gsap.to(trackRef.current, {
                    x: `-${i * 100}%`,
                    duration: 0.8,
                    ease: "power3.inOut",
                  });
                  document.querySelectorAll(".testimonial-dot").forEach((dot, j) => {
                    dot.classList.toggle("active", j === i);
                  });
                }}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
