"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-48"
      aria-label="Get started"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"
        style={prefersReducedMotion ? {} : { y: bgY }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Ready to build
            <br />
            something great?
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-neutral-400 lg:text-lg">
            Join thousands of engineering teams shipping faster on Arc. Free
            tier includes everything you need to get started.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton
              className="rounded-full bg-white px-10 py-4 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200"
              ariaLabel="Start building for free"
            >
              Start building — free
            </MagneticButton>
            <MagneticButton
              className="rounded-full border border-neutral-700 px-10 py-4 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
              ariaLabel="Talk to sales"
            >
              Talk to sales
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-8 text-xs text-neutral-600">
            No credit card required. Deploy in under 2 minutes.
          </p>
        </Reveal>
      </div>
    </section>
  );
}