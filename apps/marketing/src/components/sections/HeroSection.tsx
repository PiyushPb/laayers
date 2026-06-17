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
    <section className="noise min-h-screen max-md:min-h-[100svh] flex items-center relative overflow-hidden pt-32 pb-24 max-md:pt-24 max-md:pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.04)_0%,transparent_60%)]" />
      <div className="grid-overlay" />

      <div className="container">
        <motion.div
          className="relative z-10 w-full text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-9xl max-md:text-[clamp(2.8rem,11vw,5rem)] max-sm:text-[clamp(2.2rem,10vw,3rem)] font-extrabold leading-[0.92] tracking-[-0.04em] mb-8">
            <div className="overflow-hidden">
              <motion.div variants={textVariants} className="block">
                Infrastructure
              </motion.div>
            </div>

            <div className="overflow-hidden">
              <motion.div
                variants={textVariants}
                className="block text-fg-muted"
              >
                for teams
              </motion.div>
            </div>

            <div className="overflow-hidden">
              <motion.div variants={textVariants} className="block">
                that ship.
              </motion.div>
            </div>
          </h1>

          <motion.p
            className="text-xl text-fg-muted max-w-[520px] leading-[1.6] mb-12"
            variants={fadeVariants}
          >
            Laayers gives engineering teams a unified control
            plane for deployments, observability, and access
            management — without the operational overhead.
          </motion.p>

          <motion.div
            className="flex items-center gap-4 flex-wrap"
            variants={fadeVariants}
          >
            <Link href="#" className="inline-flex items-center gap-2 px-6 py-3 font-sans text-sm font-medium tracking-[0.01em] border-none cursor-pointer no-underline transition-all duration-300 ease-out-expo relative overflow-hidden bg-fg text-bg rounded-md hover:bg-fg-muted hover:-translate-y-[1px]">
              Start for free
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/#showcase"
              className="inline-flex items-center gap-2 px-6 py-3 font-sans text-sm font-medium tracking-[0.01em] cursor-pointer no-underline transition-all duration-300 ease-out-expo relative overflow-hidden bg-transparent text-fg border border-border-strong rounded-md hover:bg-bg-secondary hover:border-border-strong hover:-translate-y-[1px]"
            >
              View product
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-fg-subtle text-xs tracking-[0.12em] uppercase max-md:hidden animate-[scrollBounce_2s_ease-in-out_infinite]"
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
        <div className="w-px h-[60px] bg-[linear-gradient(to_bottom,var(--color-fg-subtle),transparent)]" />

        <span>
          Scroll
        </span>
      </motion.div>
    </section>
  );
}