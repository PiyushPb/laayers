"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const buttonVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

const wordVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

const fadeUpVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

export default function FinalCTASection() {
  return (
    <section className="final-cta" id="cta">
      <div className="final-cta-bg" />
      <div className="grid-overlay" />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="final-cta-headline" style={{ overflow: "hidden" }}>
            {"Ready to\nship?".split("\n").map((line, lineIdx) => (
              <span key={lineIdx} style={{ display: "block", overflow: "hidden" }}>
                {line.split(" ").map((word, wordIdx) => (
                  <motion.span
                    key={wordIdx}
                    className="cta-word"
                    variants={wordVariants}
                    style={{ display: "inline-block", marginRight: "0.25em" }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            ))}
          </h2>

          <motion.p
            className="cta-subtitle"
            variants={fadeUpVariants}
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--fg-muted)",
              maxWidth: "480px",
              margin: "0 auto 3rem",
              lineHeight: 1.6,
            }}
          >
            Join 12,000+ engineering teams that trust Laayers to keep their
            production environments sane.
          </motion.p>

          <motion.div className="cta-actions" variants={fadeUpVariants} style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="#" className="btn btn-primary" style={{ padding: "1rem 2rem", fontSize: "var(--text-base)" }}>
              Start for free
              <ArrowRight size={18} />
            </Link>
            <Link href="#" className="btn btn-secondary" style={{ padding: "1rem 2rem", fontSize: "var(--text-base)" }}>
              Talk to sales
            </Link>
          </motion.div>

          <motion.p variants={fadeUpVariants} style={{ marginTop: "2rem", fontSize: "var(--text-xs)", color: "var(--fg-subtle)" }}>
            No credit card required. Free tier available. Enterprise demo on request.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
