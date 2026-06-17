"use client";

import { Reveal } from "@/components/ui/reveal";
import { motion } from "framer-motion";

const stories = [
  {
    quote:
      "Arc replaced our entire deployment pipeline. What took us 45 minutes now takes 12 seconds. Our team ships 10x more frequently.",
    author: "Sarah Chen",
    role: "CTO",
    company: "Meridian",
    metric: "10x",
    metricLabel: "faster deployments",
  },
  {
    quote:
      "The developer experience is unmatched. TypeScript SDK, instant previews, perfect docs. It's the infrastructure platform we always wanted to build ourselves.",
    author: "Marcus Rodriguez",
    role: "VP Engineering",
    company: "Lattice Systems",
    metric: "40%",
    metricLabel: "less infra code",
  },
  {
    quote:
      "We migrated 200+ microservices to Arc in three months. Zero downtime. Our P99 latency dropped from 180ms to 23ms globally.",
    author: "Yuki Tanaka",
    role: "Staff Engineer",
    company: "NovaBridge",
    metric: "8x",
    metricLabel: "latency reduction",
  },
];

export function CustomerStories() {
  return (
    <section className="bg-neutral-950 py-24 lg:py-40" aria-label="Customer stories">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-500 uppercase">
              Customer stories
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Trusted by teams
              <br />
              that set the standard
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {stories.map((story, i) => (
            <Reveal key={story.author} delay={i * 0.15} direction="up">
              <motion.article
                className="group flex h-full flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-7 transition-colors hover:border-neutral-700 lg:p-8"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <blockquote className="mb-8 text-base leading-relaxed text-neutral-300">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>
                </div>

                <div>
                  <div className="mb-6 border-t border-neutral-800 pt-6">
                    <p className="text-3xl font-bold tracking-tight text-white">
                      {story.metric}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {story.metricLabel}
                    </p>
                  </div>

                  <footer className="flex items-center gap-3">
                    <figure className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-sm font-medium text-white">
                      {story.author[0]}
                    </figure>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {story.author}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {story.role}, {story.company}
                      </p>
                    </div>
                  </footer>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}