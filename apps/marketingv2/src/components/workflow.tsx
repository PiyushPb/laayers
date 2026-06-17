"use client";

import { Reveal } from "@/components/ui/reveal";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Connect",
    description: "Link your Git repository. Arc detects your framework and configures everything automatically.",
  },
  {
    step: "02",
    title: "Build",
    description: "Every push triggers an optimized build. Preview deployments for every pull request.",
  },
  {
    step: "03",
    title: "Deploy",
    description: "Zero-downtime deployments to 300+ edge locations. Instant rollbacks if anything goes wrong.",
  },
  {
    step: "04",
    title: "Monitor",
    description: "Real-time observability out of the box. Logs, metrics, and traces without configuration.",
  },
];

export function Workflow() {
  return (
    <section
      className="border-t border-neutral-100 py-24 lg:py-40"
      aria-label="Workflow"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              Workflow
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              From commit to production
              <br />
              in under a minute
            </h2>
          </Reveal>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute top-0 bottom-0 left-6 hidden w-px bg-neutral-200 lg:left-1/2 lg:block" />

          <div className="space-y-8 lg:space-y-16">
            {steps.map((step, i) => (
              <Reveal
                key={step.step}
                delay={i * 0.15}
                direction={i % 2 === 0 ? "left" : "right"}
              >
                <div
                  className={`relative flex items-start gap-8 lg:gap-16 ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : ""}`}>
                    <motion.article
                      className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-950/5 lg:p-8"
                      whileHover={{ y: -2 }}
                    >
                      <span className="mb-3 inline-block font-mono text-xs font-medium text-neutral-400">
                        {step.step}
                      </span>
                      <h3 className="mb-2 text-xl font-semibold tracking-tight text-neutral-950">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-500">
                        {step.description}
                      </p>
                    </motion.article>
                  </div>

                  <div className="absolute left-0 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-neutral-950 lg:left-1/2 lg:block" />

                  <div className="hidden flex-1 lg:block" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}