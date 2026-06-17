"use client";

import { Reveal } from "@/components/ui/reveal";
import { motion } from "framer-motion";

const useCases = [
  {
    title: "SaaS applications",
    description:
      "Multi-tenant architectures with global low-latency access, automatic scaling, and built-in observability.",
    tags: ["Multi-tenant", "Global", "Auto-scale"],
  },
  {
    title: "AI / ML pipelines",
    description:
      "GPU-accelerated compute, vector storage, and real-time inference endpoints with sub-100ms latency.",
    tags: ["GPU compute", "Vector DB", "Inference"],
  },
  {
    title: "Real-time platforms",
    description:
      "WebSocket support, event streaming, and pub/sub messaging for chat, collaboration, and live data.",
    tags: ["WebSockets", "Streaming", "Pub/Sub"],
  },
  {
    title: "E-commerce",
    description:
      "Edge-rendered storefronts, global inventory APIs, and payment processing with PCI compliance.",
    tags: ["Edge render", "PCI DSS", "Global CDN"],
  },
];

export function UseCases() {
  return (
    <section className="py-24 lg:py-40" aria-label="Use cases">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              Use cases
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              One platform.
              <br />
              Every workload.
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {useCases.map((useCase, i) => (
            <Reveal key={useCase.title} delay={i * 0.1} direction="up">
              <motion.article
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-950/5 lg:p-10"
                whileHover={{ y: -4 }}
              >
                <span className="mb-4 block font-mono text-xs text-neutral-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-3 text-xl font-semibold tracking-tight text-neutral-950 lg:text-2xl">
                  {useCase.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-neutral-500 lg:text-base">
                  {useCase.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {useCase.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-neutral-50 transition-transform duration-500 group-hover:scale-[3]" />
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}