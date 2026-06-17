"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-20 lg:pt-36 lg:pb-28"
      aria-label="Hero"
    >
      <motion.div
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center"
        style={
          prefersReducedMotion ? {} : { scale: heroScale, opacity: heroOpacity }
        }
      >
        <Reveal delay={0.1} direction="none">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs font-medium text-neutral-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            v4.0 — Now generally available
          </span>
        </Reveal>

        <Reveal delay={0.2}>
          <h1 className="mb-7 text-4xl leading-[1.08] font-bold tracking-tight text-neutral-950 sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]">
            Infrastructure for
            <br />
            <span className="bg-gradient-to-r from-neutral-950 via-neutral-600 to-neutral-400 bg-clip-text text-transparent">
              the modern stack
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.35}>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-neutral-500 sm:text-lg md:text-xl md:leading-relaxed">
            The unified platform for building, deploying, and scaling
            production-grade applications. From prototype to planet-scale.
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <MagneticButton
              className="rounded-full bg-neutral-950 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 sm:px-10"
              ariaLabel="Start building"
            >
              Start building
            </MagneticButton>
            <MagneticButton
              className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-8 py-3.5 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:text-neutral-950 sm:px-10"
              ariaLabel="View documentation"
            >
              Documentation
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
              >
                &rarr;
              </motion.span>
            </MagneticButton>
          </div>
        </Reveal>
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto mt-16 w-full max-w-5xl px-2 sm:mt-20 lg:mt-24"
        style={prefersReducedMotion ? {} : { y: mockupY }}
      >
        <Reveal delay={0.6} direction="up" duration={1}>
          <figure className="relative overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-50 shadow-2xl shadow-neutral-950/10 sm:rounded-2xl">
            <header className="flex items-center gap-2 border-b border-neutral-200/60 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
              </div>
              <div className="ml-4 flex-1">
                <div className="mx-auto max-w-xs rounded-md bg-neutral-100 px-3 py-1 text-center text-xs text-neutral-400">
                  app.arc.dev/dashboard
                </div>
              </div>
            </header>

            <div className="aspect-[16/9] bg-neutral-950 p-4 sm:p-6 lg:p-8">
              <div className="grid h-full grid-cols-12 gap-3 lg:gap-4">
                <aside className="col-span-3 hidden rounded-lg border border-neutral-800 bg-neutral-900 p-4 lg:block">
                  <div className="mb-6 h-4 w-20 rounded bg-neutral-800" />
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-3 rounded ${
                          i === 1
                            ? "w-full bg-neutral-700"
                            : `w-${16 + i * 4} bg-neutral-800`
                        }`}
                        style={{ width: `${60 + i * 5}%` }}
                      />
                    ))}
                  </div>
                </aside>

                <div className="col-span-12 flex flex-col gap-3 lg:col-span-9 lg:gap-4">
                  <div className="flex gap-3 lg:gap-4">
                    {["Requests", "Latency", "Uptime"].map((label, i) => (
                      <article
                        key={label}
                        className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 p-3 sm:p-4"
                      >
                        <p className="mb-1 text-[10px] text-neutral-500 sm:text-xs">
                          {label}
                        </p>
                        <p className="text-sm font-medium text-white sm:text-lg">
                          {["14.2M", "12ms", "99.99%"][i]}
                        </p>
                      </article>
                    ))}
                  </div>

                  <div className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-3 w-24 rounded bg-neutral-800" />
                      <div className="flex gap-2">
                        <div className="h-6 w-12 rounded bg-neutral-800" />
                        <div className="h-6 w-12 rounded bg-neutral-800" />
                      </div>
                    </div>
                    <div className="flex h-32 items-end gap-1 sm:h-48 sm:gap-1.5">
                      {Array.from({ length: 24 }).map((_, i) => {
                        const height = 30 + Math.sin(i * 0.5) * 25 + Math.random() * 20;
                        return (
                          <motion.div
                            key={i}
                            className="flex-1 rounded-t bg-gradient-to-t from-neutral-700 to-neutral-600"
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: 0.8 + i * 0.03,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </figure>
        </Reveal>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.02)_0%,transparent_60%)]" />
    </section>
  );
}