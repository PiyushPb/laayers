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
    <section className="py-[var(--spacing-section-py)]" id="benefits">
      <div className="container">
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-8">Why Laayers</p>
        <h2 className="text-6xl font-bold leading-[1.05] tracking-[-0.025em] text-fg mb-16 max-w-[640px]">
          Numbers that tell the real story.
        </h2>

        <motion.div 
          className="grid grid-cols-12 gap-8 max-lg:grid-cols-1"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Large span item */}
          <motion.div className="p-12 border border-border bg-bg-secondary rounded-2xl min-h-[280px] max-lg:p-8 col-span-8 max-lg:col-span-1 flex items-end justify-between flex-wrap gap-4" variants={itemVariants}>
            <motion.p
              variants={numberVariants}
              className="text-[clamp(5rem,12vw,10rem)] font-extrabold tracking-[-0.05em] leading-[0.9] text-fg"
            >
              10×
            </motion.p>
            <p className="text-lg text-fg-muted max-w-[280px] leading-[1.6]">
              Faster incident resolution with unified observability and automatic correlation.
            </p>
          </motion.div>

          {/* Small span */}
          <motion.div className="p-12 border border-border bg-bg-secondary rounded-2xl min-h-[280px] max-lg:p-8 col-span-4 max-lg:col-span-1" variants={itemVariants}>
            <div className="text-6xl font-bold tracking-[-0.03em] mb-4 text-fg">99.97%</div>
            <p className="text-xl text-fg-muted max-w-[200px] leading-[1.4]">Platform uptime across all deployments.</p>
          </motion.div>

          <motion.div className="p-12 border border-border bg-bg-secondary rounded-2xl min-h-[280px] max-lg:p-8 col-span-4 max-lg:col-span-1" variants={itemVariants}>
            <div className="text-6xl font-bold tracking-[-0.03em] mb-4 text-fg">&lt; 2h</div>
            <p className="text-xl text-fg-muted max-w-[200px] leading-[1.4]">Onboarding time for new engineers.</p>
          </motion.div>

          {/* Full width */}
          <motion.div className="p-12 border border-border bg-bg-secondary rounded-2xl min-h-[280px] max-lg:p-8 col-span-8 max-lg:col-span-1 flex flex-col justify-end" variants={itemVariants}>
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-4">Compliance</p>
            <div className="flex gap-8 flex-wrap">
              {["SOC 2 Type II", "GDPR", "HIPAA Ready", "ISO 27001"].map((badge) => (
                <span key={badge} className="text-sm font-semibold text-fg border border-border-strong px-4 py-2 rounded-sm">
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
