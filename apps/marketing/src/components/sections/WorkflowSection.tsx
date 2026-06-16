"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { GitBranch, Server, Settings, Rocket } from "lucide-react";
import styles from "./WorkflowSection.module.css";

const steps = [
  {
    number: "01",
    title: "Connect your repo",
    description: "Link any GitHub, GitLab, or Bitbucket repository in under 60 seconds. No YAML required to get started.",
    icon: <GitBranch size={20} color="var(--fg-muted)" />,
    className: styles.colSpan2,
    showcase: (
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", opacity: 0.8 }}>
        <div style={{ height: "2.5rem", width: "2.5rem", borderRadius: "9999px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg style={{ width: "1.25rem", height: "1.25rem", color: "#fff" }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </div>
        <div style={{ height: "2.5rem", width: "2.5rem", borderRadius: "9999px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg style={{ width: "1.25rem", height: "1.25rem", color: "#fff" }} viewBox="0 0 24 24" fill="currentColor"><path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.155-.477-.804-.477-.959 0L16.326 9.452 12.001 9.45l-4.324.002-2.664-8.189c-.155-.477-.804-.477-.959 0L2.712 9.452.045 13.587c-.36.635-.1 1.455.566 1.764l11.39 8.351 11.39-8.351c.665-.309.925-1.129.564-1.764z"/></svg>
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
      <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", opacity: 0.8 }}>
        <div style={{ height: "0.5rem", width: "75%", backgroundColor: "var(--border)", borderRadius: "0.25rem" }} />
        <div style={{ height: "0.5rem", width: "50%", backgroundColor: "var(--border)", borderRadius: "0.25rem" }} />
        <div style={{ height: "0.5rem", width: "100%", backgroundColor: "var(--bg)", borderRadius: "0.25rem", marginTop: "0.5rem", border: "1px solid var(--border)" }} />
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
      <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", opacity: 0.8 }}>
        <div className={styles.spinAnimation} style={{ height: "2rem", width: "2rem", borderRadius: "9999px", border: "2px solid var(--border)", borderTopColor: "var(--fg-muted)" }} />
        <div style={{ height: "0.5rem", width: "4rem", backgroundColor: "var(--border)", borderRadius: "0.25rem" }} />
      </div>
    )
  },
  {
    number: "04",
    title: "Ship with confidence",
    description: "Every deploy is observable, rollbackable, and auditable. Production is no longer a place of fear. Ship globally in seconds.",
    icon: <Rocket size={20} color="var(--fg-muted)" />,
    className: styles.colSpan2,
    showcase: (
      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: 0.8, height: "4rem" }}>
        {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
          <motion.div 
            key={i} 
            style={{ width: "1rem", backgroundColor: "var(--border)", borderTopLeftRadius: "0.25rem", borderTopRightRadius: "0.25rem", height: `${h}%`, transformOrigin: "bottom" }}
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
    <section className="section" id="workflow" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container">
        <div style={{ marginBottom: "4rem" }}>
          <p className="text-eyebrow" style={{ marginBottom: "1.5rem" }}>Workflow</p>
          <h2 className="text-display-sm" style={{ maxWidth: "600px" }}>
            From zero to production in four steps.
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className={styles.bentoGrid}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              className={`${styles.bentoCard} ${step.className || ""}`}
            >
              {/* Subtle gradient background effect */}
              <div className={styles.gradientBg} />
              
              <div className={styles.header}>
                <div className={styles.iconWrapper}>
                  {step.icon}
                </div>
                <span className={styles.number}>{step.number}</span>
              </div>
              
              <div className={styles.content}>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.description}>
                  {step.description}
                </p>
              </div>

              <div className={styles.showcase}>
                {step.showcase}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
