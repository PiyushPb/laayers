"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { number: "10×", label: "Faster incident resolution with unified observability and automatic correlation." },
  { number: "99.97%", label: "Average platform uptime across all customer deployments." },
  { number: "< 2h", label: "Average onboarding time for new engineers, from zero to first deploy." },
  { number: "SOC 2", label: "Type II certified. GDPR compliant. HIPAA ready." },
];

export default function BenefitsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<Element>(".benefit-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".benefits-grid",
              start: "top 75%",
            },
          }
        );
      });

      // Animate the large number in the left col-8 item
      gsap.fromTo(
        ".benefit-big-number",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".benefits-grid",
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section" ref={sectionRef} id="benefits">
      <div className="container">
        <p className="text-eyebrow" style={{ marginBottom: "2rem" }}>Why Laayers</p>
        <h2 className="text-display-sm" style={{ marginBottom: "4rem", maxWidth: "640px" }}>
          Numbers that tell the real story.
        </h2>

        <div className="benefits-grid">
          {/* Large span item */}
          <div className="benefit-item col-8" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <p
              className="benefit-big-number"
              style={{
                fontSize: "clamp(5rem, 12vw, 10rem)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
                color: "var(--fg)",
              }}
            >
              10×
            </p>
            <p style={{ fontSize: "var(--text-lg)", color: "var(--fg-muted)", maxWidth: "280px", lineHeight: 1.6 }}>
              Faster incident resolution with unified observability and automatic correlation.
            </p>
          </div>

          {/* Small span */}
          <div className="benefit-item col-4">
            <div className="benefit-number">99.97%</div>
            <p className="benefit-label">Platform uptime across all deployments.</p>
          </div>

          <div className="benefit-item col-4">
            <div className="benefit-number">&lt; 2h</div>
            <p className="benefit-label">Onboarding time for new engineers.</p>
          </div>

          {/* Full width */}
          <div className="benefit-item col-8" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <p className="text-eyebrow" style={{ marginBottom: "1rem" }}>Compliance</p>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {["SOC 2 Type II", "GDPR", "HIPAA Ready", "ISO 27001"].map((badge) => (
                <span key={badge} style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--fg)",
                  border: "1px solid var(--border-strong)",
                  padding: "0.5rem 1rem",
                  borderRadius: "2px",
                }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
