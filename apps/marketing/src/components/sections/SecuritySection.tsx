"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useSpring, Variants } from "framer-motion";
import { Shield, Lock, Server, Eye, Key, Globe } from "lucide-react";

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

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

function AnimatedCounter({ target, isFloat }: { target: number, isFloat: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [val, setVal] = useState("0");
  
  const springValue = useSpring(0, {
    bounce: 0,
    duration: 2000,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(target);
    }
  }, [isInView, target, springValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setVal(isFloat ? latest.toFixed(2) : Math.round(latest).toString());
    });
  }, [springValue, isFloat]);

  return <span ref={ref} className="stat-number">{val}</span>;
}

export default function SecuritySection() {
  return (
    <>
      <section className="section" id="security">
        <div className="container">
          <p className="text-eyebrow" style={{ marginBottom: "2rem" }}>Security & Trust</p>
          <h2 className="text-display-sm" style={{ marginBottom: "1.5rem", maxWidth: "600px" }}>
            Enterprise-grade, by default.
          </h2>
          <p className="text-subheading" style={{ marginBottom: "4rem", maxWidth: "560px" }}>
            Security is not a feature tier. Every plan includes the controls
            your compliance team requires.
          </p>

          <motion.div 
            className="security-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {securityItems.map(({ Icon, title, description }) => (
              <motion.div key={title} className="security-item" variants={itemVariants}>
                <div className="security-icon">
                  <Icon size={18} />
                </div>
                <h3 className="security-title">{title}</h3>
                <p className="security-desc">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ paddingBlock: "4rem", borderBlock: "1px solid var(--border)" }}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat) => {
              const numTarget = parseFloat(stat.number.replace(/[^0-9.]/g, "") || "0");
              const isFloat = stat.number.includes(".");
              return (
                <div key={stat.label} className="stat-item">
                  {stat.number.startsWith("<") && <span className="stat-number">{"< "}</span>}
                  <AnimatedCounter target={numTarget} isFloat={isFloat} />
                  <span style={{ fontSize: "var(--text-3xl)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--fg-muted)" }}>
                    {stat.suffix}
                  </span>
                  <p className="stat-label" style={{ marginTop: "0.5rem" }}>{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
