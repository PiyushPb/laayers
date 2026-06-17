"use client";
 
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
 
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};
 
const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
 
const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function HeroSection() {
  return (
    <section className="hero noise">
      <div className="hero-bg" />
      <div className="grid-overlay" />

      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="hero-headline">
            <div className="overflow-hidden">
              <motion.div variants={textVariants}>
                Infrastructure
              </motion.div>
            </div>

            <div className="overflow-hidden">
              <motion.div
                variants={textVariants}
                style={{
                  color: "var(--fg-muted)",
                }}
              >
                for teams
              </motion.div>
            </div>

            <div className="overflow-hidden">
              <motion.div variants={textVariants}>
                that ship.
              </motion.div>
            </div>
          </h1>

          <motion.p
            className="hero-subline"
            variants={fadeVariants}
          >
            Laayers gives engineering teams a unified control
            plane for deployments, observability, and access
            management — without the operational overhead.
          </motion.p>

          <motion.div
            className="hero-cta-row"
            variants={fadeVariants}
          >
            <Link href="#" className="btn btn-primary">
              Start for free
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/#showcase"
              className="btn btn-secondary"
            >
              View product
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="hero-scroll-indicator"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.2,
          duration: 0.8,
        }}
      >
        <div className="hero-scroll-line" />

        <span
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--fg-subtle)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}