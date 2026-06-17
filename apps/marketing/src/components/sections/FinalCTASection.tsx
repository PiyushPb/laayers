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
    <section className="relative py-[12rem] bg-bg overflow-hidden flex items-center justify-center min-h-[80vh]" id="cta">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--bg-secondary)_0%,var(--bg)_70%)] opacity-50" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] [background-image:linear-gradient(to_right,var(--fg)_1px,transparent_1px),linear-gradient(to_bottom,var(--fg)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="container relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-[clamp(4rem,15vw,12rem)] font-bold tracking-[-0.04em] leading-[0.9] text-fg mb-8 uppercase text-center overflow-hidden">
            {"Ready to\nship?".split("\n").map((line, lineIdx) => (
              <span key={lineIdx} className="block overflow-hidden">
                {line.split(" ").map((word, wordIdx) => (
                  <motion.span
                    key={wordIdx}
                    className="bg-clip-text text-transparent bg-gradient-to-b from-fg to-fg-subtle inline-block mr-[0.25em]"
                    variants={wordVariants}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            ))}
          </h2>

          <motion.p
            variants={fadeUpVariants}
            className="text-xl text-fg-muted max-w-[480px] mx-auto mb-12 leading-[1.6]"
          >
            Join 12,000+ engineering teams that trust Laayers to keep their
            production environments sane.
          </motion.p>

          <motion.div variants={fadeUpVariants} className="flex justify-center gap-4 flex-wrap">
            <Link href="#" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-base transition-all duration-300 bg-fg text-bg hover:scale-[1.02] active:scale-[0.98]">
              Start for free
              <ArrowRight size={18} />
            </Link>
            <Link href="#" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-base transition-all duration-300 bg-bg border border-border text-fg hover:bg-bg-secondary hover:border-border-strong active:scale-[0.98]">
              Talk to sales
            </Link>
          </motion.div>

          <motion.p variants={fadeUpVariants} className="mt-8 text-xs text-fg-subtle">
            No credit card required. Free tier available. Enterprise demo on request.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
