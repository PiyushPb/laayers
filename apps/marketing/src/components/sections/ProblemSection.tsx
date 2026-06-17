"use client";

import { motion, Variants } from "framer-motion";

const problems = [
  {
    number: "01",
    title: "Tooling sprawl kills velocity.",
    body: "Most teams juggle 12+ disconnected tools for deployments, secrets, monitoring, and access. Every handoff is a context switch. Every incident is a war room.",
    detail: "The average engineering org loses 30% of productive time to tool integration and configuration maintenance.",
  },
  {
    number: "02",
    title: "Scaling breaks what worked at 10.",
    body: "What works at 10 engineers becomes a liability at 100. Permissions drift. Environments diverge. Runbooks become stale. On-call becomes a nightmare.",
    detail: "Infrastructure complexity grows non-linearly with team size — and most platforms are not built for this reality.",
  },
  {
    number: "03",
    title: "Compliance slows everything down.",
    body: "Security reviews, SOC 2 requirements, and audit trails were bolted on as afterthoughts. Compliance becomes a blocker instead of a foundation.",
    detail: "Laayers is architected for compliance from day one — not as a feature gate, but as the default.",
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.9, ease: "easeOut" } 
  }
};

export default function ProblemSection() {
  return (
    <section className="py-[var(--spacing-section-py)]" id="problem">
      <div className="container">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3">The Problem</p>
        </div>
        <h2 className="text-6xl font-bold leading-[1.05] tracking-[-0.025em] text-fg mb-20 max-w-[700px]">
          Modern infrastructure is broken.
        </h2>

        {problems.map((p, i) => (
          <motion.div
            key={p.number}
            className={`grid grid-cols-2 max-lg:grid-cols-1 gap-16 max-lg:gap-8 items-center py-20 border-b border-border last:border-none ${i % 2 === 1 ? "[direction:rtl] max-lg:[direction:ltr] [&>*]:[direction:ltr]" : ""}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div variants={itemVariants}>
              <p className="text-9xl font-extrabold leading-none tracking-[-0.04em] text-border-strong">{p.number}</p>
            </motion.div>
            <div>
              <motion.h3
                variants={itemVariants}
                className="text-4xl font-bold tracking-[-0.025em] leading-[1.15] mb-5"
              >
                {p.title}
              </motion.h3>
              <motion.p
                variants={itemVariants}
                className="text-lg text-fg-muted leading-[1.7] mb-4 max-w-[540px]"
              >
                {p.body}
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-sm text-fg-subtle leading-[1.7] max-w-[480px] border-l border-border-strong pl-4"
              >
                {p.detail}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
