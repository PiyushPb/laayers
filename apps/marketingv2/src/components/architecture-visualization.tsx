"use client";

import { Reveal } from "@/components/ui/reveal";
import { motion } from "framer-motion";

const layers = [
  {
    label: "Your Application",
    sublabel: "Next.js, Remix, Express, FastAPI",
    color: "border-neutral-950 bg-neutral-950 text-white",
  },
  {
    label: "Arc Runtime",
    sublabel: "Compute, routing, middleware",
    color: "border-neutral-700 bg-neutral-800 text-white",
  },
  {
    label: "Edge Network",
    sublabel: "300+ PoPs, TLS, caching, WAF",
    color: "border-neutral-400 bg-neutral-200 text-neutral-800",
  },
  {
    label: "Data Layer",
    sublabel: "Postgres, Redis, object storage",
    color: "border-neutral-300 bg-neutral-100 text-neutral-700",
  },
  {
    label: "Observability",
    sublabel: "Logs, metrics, traces, alerts",
    color: "border-neutral-200 bg-neutral-50 text-neutral-600",
  },
];

export function ArchitectureVisualization() {
  return (
    <section className="py-24 lg:py-40" aria-label="Architecture">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              Architecture
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Layers of abstraction.
              <br />
              Layers of reliability.
            </h2>
          </Reveal>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {layers.map((layer, i) => (
            <Reveal key={layer.label} delay={i * 0.1} direction="none">
              <motion.article
                className={`flex items-center justify-between rounded-xl border px-6 py-5 sm:px-8 sm:py-6 ${layer.color}`}
                whileHover={{ scale: 1.01, x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <h3 className="text-sm font-semibold tracking-tight sm:text-base">
                    {layer.label}
                  </h3>
                  <p className="mt-0.5 text-xs opacity-60 sm:text-sm">
                    {layer.sublabel}
                  </p>
                </div>
                <span className="text-xs font-medium opacity-40">
                  Layer {i + 1}
                </span>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}