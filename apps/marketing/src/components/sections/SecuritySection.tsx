"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Lock, Server, Eye, Key, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const securityItems = [
  {
    Icon: Shield,
    title: "SOC 2 Type II",
    description: "Independently audited annually. Full report available under NDA for enterprise prospects.",
  },
  {
    Icon: Lock,
    title: "Encryption at rest & in transit",
    description: "AES-256 encryption for all stored data. TLS 1.3 for all connections. No exceptions.",
  },
  {
    Icon: Key,
    title: "Zero-knowledge secrets",
    description: "Secrets are encrypted with your own key material. We never have access to your credentials.",
  },
  {
    Icon: Eye,
    title: "Full audit trail",
    description: "Every action logged with user, IP, timestamp, and resource context. Immutable. Exportable.",
  },
  {
    Icon: Server,
    title: "Private deployment",
    description: "Self-hosted or dedicated cloud. Your data never touches our shared infrastructure.",
  },
  {
    Icon: Globe,
    title: "Global redundancy",
    description: "Multi-region active-active architecture. 99.97% uptime SLA. Sub-50ms API latency.",
  },
];

const stats = [
  { number: "247", suffix: "B+", label: "Events processed per day" },
  { number: "99.97", suffix: "%", label: "Platform uptime" },
  { number: "< 50", suffix: "ms", label: "Global API latency" },
  { number: "12", suffix: "k+", label: "Engineering teams" },
];

export default function SecuritySection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<Element>(".security-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".security-grid",
              start: "top 75%",
            },
          }
        );
      });

      // Stats counter animation
      gsap.utils.toArray<Element>(".stat-number[data-count]").forEach((el) => {
        const target = parseFloat((el as HTMLElement).dataset.count ?? "0");
        const isFloat = target % 1 !== 0;
        gsap.fromTo(
          { val: 0 },
          { val: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
            },
            onUpdate: function() {
              (el as HTMLElement).textContent = isFloat
                ? this.targets()[0].val.toFixed(2)
                : Math.round(this.targets()[0].val).toString();
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="section" ref={sectionRef} id="security">
        <div className="container">
          <p className="text-eyebrow" style={{ marginBottom: "2rem" }}>Security & Trust</p>
          <h2 className="text-display-sm" style={{ marginBottom: "1.5rem", maxWidth: "600px" }}>
            Enterprise-grade, by default.
          </h2>
          <p className="text-subheading" style={{ marginBottom: "4rem", maxWidth: "560px" }}>
            Security is not a feature tier. Every plan includes the controls
            your compliance team requires.
          </p>

          <div className="security-grid">
            {securityItems.map(({ Icon, title, description }) => (
              <div key={title} className="security-item">
                <div className="security-icon">
                  <Icon size={18} />
                </div>
                <h3 className="security-title">{title}</h3>
                <p className="security-desc">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ paddingBlock: "4rem", borderBlock: "1px solid var(--border)" }}>
        <div className="container">
          <div className="stats-grid" ref={statsRef}>
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item">
                <span
                  className="stat-number"
                  data-count={stat.number.replace(/[^0-9.]/g, "")}
                >
                  {stat.number}
                </span>
                <span style={{ fontSize: "var(--text-3xl)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--fg-muted)" }}>
                  {stat.suffix}
                </span>
                <p className="stat-label" style={{ marginTop: "0.5rem" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
