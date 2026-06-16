"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const controls = useAnimation();

  useEffect(() => {
    // Delay slightly longer than 100ms to ensure React hydration and paint
    // have settled on slow Android/iOS devices before triggering animation.
    const animationTimer = setTimeout(() => {
      controls.start("visible");
    }, 200);

    return () => {
      clearTimeout(animationTimer);
    };
  }, [controls]);

  const containerVariants: any = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const textVariants: any = {
    // Use pixel-equivalent rather than "120%" string — percentage string values
    // are resolved inconsistently across mobile Safari versions and can leave
    // elements permanently offscreen.
    hidden: { y: "100%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  const fadeUpVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  };

  return (
    <section className="hero noise">
      <div className="hero-bg" />
      <div className="grid-overlay" />

      <div className="container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <h1 className="hero-headline" style={{ overflow: "hidden" }}>
            <span style={{ display: "block", overflow: "hidden" }}>
              <motion.span variants={textVariants} style={{ display: "block" }}>Infrastructure</motion.span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <motion.span variants={textVariants} style={{ display: "block", color: "var(--fg-muted)" }}>for teams</motion.span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <motion.span variants={textVariants} style={{ display: "block" }}>that ship.</motion.span>
            </span>
          </h1>

          <motion.p className="hero-subline" variants={fadeUpVariants}>
            Laayers gives engineering teams a unified control plane for deployments,
            observability, and access management — without the operational overhead.
          </motion.p>

          <motion.div className="hero-cta-row" variants={fadeUpVariants}>
            <Link href="#" className="btn btn-primary">
              Start for free
              <ArrowRight size={16} />
            </Link>
            <Link href="/#showcase" className="btn btn-secondary">
              View product
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <div className="hero-scroll-line" />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--fg-subtle)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Scroll
        </span>
      </div>
    </section>
  );
}
