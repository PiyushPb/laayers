"use client";

import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";

const capabilities = [
  {
    title: "Compute",
    description: "Serverless functions, containers, and edge compute with zero cold starts.",
    metric: "< 3ms",
    metricLabel: "cold start",
  },
  {
    title: "Storage",
    description: "Object storage, key-value, and relational databases with global replication.",
    metric: "11 9s",
    metricLabel: "durability",
  },
  {
    title: "Network",
    description: "Global edge network spanning 300+ locations with automatic TLS and DDoS protection.",
    metric: "300+",
    metricLabel: "edge nodes",
  },
  {
    title: "Observe",
    description: "Real-time logs, metrics, traces, and alerts with zero-config instrumentation.",
    metric: "< 1s",
    metricLabel: "ingestion",
  },
];

export function PlatformOverview() {
  return (
    <section className="py-24 lg:py-40" aria-label="Platform overview" id="product">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              Platform
            </p>
          </Reveal>

          <TextReveal
            text="Everything your team needs. Nothing it doesn't."
            as="h2"
            className="mb-6 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl"
          />

          <Reveal delay={0.3}>
            <p className="text-base leading-relaxed text-neutral-500 lg:text-lg">
              A single platform that replaces your patchwork of cloud services,
              monitoring tools, and deployment pipelines.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:mt-24">
          {capabilities.map((capability, i) => (
            <Reveal key={capability.title} delay={i * 0.1} direction="none">
              <article className="group relative flex h-full flex-col justify-between bg-white p-8 transition-colors duration-500 hover:bg-neutral-50 lg:p-12">
                <div>
                  <h3 className="mb-3 text-xl font-semibold tracking-tight text-neutral-950">
                    {capability.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-500 lg:text-base">
                    {capability.description}
                  </p>
                </div>

                <div className="mt-10 border-t border-neutral-100 pt-6">
                  <p className="text-3xl font-bold tracking-tight text-neutral-950 lg:text-4xl">
                    {capability.metric}
                  </p>
                  <p className="mt-1 text-xs font-medium tracking-wider text-neutral-400 uppercase">
                    {capability.metricLabel}
                  </p>
                </div>

                <div className="absolute top-8 right-8 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-sm font-medium text-neutral-400 transition-all duration-300 group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white lg:top-12 lg:right-12">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}