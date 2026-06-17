"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { GitBranch, Server, Settings, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect your repo",
    description: "Link any GitHub, GitLab, or Bitbucket repository in under 60 seconds. No YAML required to get started.",
    icon: <GitBranch size={20} color="var(--fg-muted)" />,
    className: "col-span-1 md:col-span-2",
    showcase: (
      <div className="mt-6 flex gap-3 opacity-80">
        <div className="h-10 w-10 rounded-full bg-bg border border-border flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </div>
        <div className="h-10 w-10 rounded-full bg-bg border border-border flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.155-.477-.804-.477-.959 0L16.326 9.452 12.001 9.45l-4.324.002-2.664-8.189c-.155-.477-.804-.477-.959 0L2.712 9.452.045 13.587c-.36.635-.1 1.455.566 1.764l11.39 8.351 11.39-8.351c.665-.309.925-1.129.564-1.764z"/></svg>
        </div>
      </div>
    )
  },
  {
    number: "02",
    title: "Define environments",
    description: "Set up staging, preview, and production with variables.",
    icon: <Server size={20} color="var(--fg-muted)" />,
    className: "",
    showcase: (
      <div className="mt-6 flex flex-col gap-2 opacity-80">
        <div className="h-2 w-3/4 bg-border rounded" />
        <div className="h-2 w-1/2 bg-border rounded" />
        <div className="h-2 w-full bg-bg rounded mt-2 border border-border" />
      </div>
    )
  },
  {
    number: "03",
    title: "Configure pipeline",
    description: "Zero-downtime deployments with automatic canary analysis.",
    icon: <Settings size={20} color="var(--fg-muted)" />,
    className: "",
    showcase: (
      <div className="mt-6 flex items-center gap-3 opacity-80">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-border border-t-fg-muted" />
        <div className="h-2 w-16 bg-border rounded" />
      </div>
    )
  },
  {
    number: "04",
    title: "Ship with confidence",
    description: "Every deploy is observable, rollbackable, and auditable. Production is no longer a place of fear. Ship globally in seconds.",
    icon: <Rocket size={20} color="var(--fg-muted)" />,
    className: "col-span-1 md:col-span-2",
    showcase: (
      <div className="mt-6 flex justify-between items-end opacity-80 h-16">
        {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
          <motion.div 
            key={i} 
            className="w-4 bg-border rounded-t origin-bottom"
            style={{ height: `${h}%` }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            viewport={{ once: true }}
          />
        ))}
      </div>
    )
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 15 }
  },
};

export default function WorkflowSection() {
  return (
    <section className="py-[var(--spacing-section-py)] bg-bg" id="workflow">
      <div className="container">
        <div className="mb-16">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-6">Workflow</p>
          <h2 className="text-6xl font-bold leading-[1.05] tracking-[-0.025em] text-fg max-w-[600px]">
            From zero to production in four steps.
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              className={`group relative flex flex-col p-8 rounded-2xl bg-bg-secondary border border-border overflow-hidden transition-colors duration-300 hover:border-border-strong ${step.className || ""}`}
            >
              {/* Subtle gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="p-3 bg-bg rounded-lg border border-border">
                  {step.icon}
                </div>
                <span className="text-xs font-mono text-fg-subtle">{step.number}</span>
              </div>
              
              <div className="relative z-10 flex-1">
                <h3 className="text-xl font-semibold text-fg mb-3">{step.title}</h3>
                <p className="text-sm text-fg-muted leading-[1.6]">
                  {step.description}
                </p>
              </div>

              <div className="relative z-10 mt-auto pt-6">
                {step.showcase}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
