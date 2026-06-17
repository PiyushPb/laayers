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

  return <span ref={ref} className="text-5xl font-bold tracking-[-0.04em] leading-none text-fg">{val}</span>;
}

export default function SecuritySection() {
  return (
    <>
      <section className="py-[var(--spacing-section-py)]" id="security">
        <div className="container">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-8">Security & Trust</p>
          <h2 className="text-6xl font-bold leading-[1.05] tracking-[-0.025em] text-fg mb-6 max-w-[600px]">
            Enterprise-grade, by default.
          </h2>
          <p className="text-2xl text-fg-muted mb-16 max-w-[560px] leading-[1.4]">
            Security is not a feature tier. Every plan includes the controls
            your compliance team requires.
          </p>

          <motion.div 
            className="grid grid-cols-3 gap-x-10 gap-y-16 max-lg:grid-cols-2 max-md:grid-cols-1"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {securityItems.map(({ Icon, title, description }) => (
              <motion.div key={title} className="flex flex-col" variants={itemVariants}>
                <div className="w-12 h-12 flex items-center justify-center rounded-[0.875rem] border border-border bg-bg-secondary text-fg mb-6">
                  <Icon size={18} />
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-fg mb-3">{title}</h3>
                <p className="text-base text-fg-muted leading-[1.6]">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border">
        <div className="container">
          <div className="grid grid-cols-4 border-l border-border max-lg:grid-cols-2 max-md:grid-cols-1 max-lg:border-l-0 max-lg:border-t">
            {stats.map((stat) => {
              const numTarget = parseFloat(stat.number.replace(/[^0-9.]/g, "") || "0");
              const isFloat = stat.number.includes(".");
              return (
                <div key={stat.label} className="border-r border-border px-8 py-4 flex flex-col justify-center min-h-[140px] max-lg:border-b max-md:border-r-0 max-lg:[&:nth-child(even)]:border-r-0">
                  <div className="flex items-baseline">
                    {stat.number.startsWith("<") && <span className="text-5xl font-bold tracking-[-0.04em] leading-none text-fg mr-2">{"< "}</span>}
                    <AnimatedCounter target={numTarget} isFloat={isFloat} />
                    <span className="text-3xl font-extrabold tracking-[-0.04em] text-fg-muted ml-1">
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-fg-muted uppercase tracking-[0.05em] mt-2">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
