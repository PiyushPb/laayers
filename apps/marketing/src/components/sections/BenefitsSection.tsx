"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.7, ease: "easeOut" } 
  }
};

const numberVariants: any = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, scale: 1, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function BenefitsSection() {
  return (
    <section className="section" id="benefits">
      <div className="container">
        <p className="text-eyebrow" style={{ marginBottom: "2rem" }}>Why Laayers</p>
        <h2 className="text-display-sm" style={{ marginBottom: "4rem", maxWidth: "640px" }}>
          Numbers that tell the real story.
        </h2>

        <motion.div 
          className="benefits-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Large span item */}
          <motion.div className="benefit-item col-8" variants={itemVariants} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <motion.p
              className="benefit-big-number"
              variants={numberVariants}
              style={{
                fontSize: "clamp(5rem, 12vw, 10rem)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
                color: "var(--fg)",
              }}
            >
              10×
            </motion.p>
            <p style={{ fontSize: "var(--text-lg)", color: "var(--fg-muted)", maxWidth: "280px", lineHeight: 1.6 }}>
              Faster incident resolution with unified observability and automatic correlation.
            </p>
          </motion.div>

          {/* Small span */}
          <motion.div className="benefit-item col-4" variants={itemVariants}>
            <div className="benefit-number">99.97%</div>
            <p className="benefit-label">Platform uptime across all deployments.</p>
          </motion.div>

          <motion.div className="benefit-item col-4" variants={itemVariants}>
            <div className="benefit-number">&lt; 2h</div>
            <p className="benefit-label">Onboarding time for new engineers.</p>
          </motion.div>

          {/* Full width */}
          <motion.div className="benefit-item col-8" variants={itemVariants} style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
