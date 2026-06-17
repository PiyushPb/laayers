"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

const features = [
  {
    id: "deploy",
    title: "Deploy",
    subtitle: "Ship in seconds",
    description:
      "Push to git and your application is live. Zero configuration, zero downtime deployments with instant rollbacks.",
    code: `$ git push origin main

Deploying to production...
Building... done (2.1s)
Optimizing... done (0.8s)
Propagating to 300+ edges...

✓ Deployed to arc.app/api
  Latency: 12ms (p99)
  Status: healthy`,
  },
  {
    id: "scale",
    title: "Scale",
    subtitle: "From zero to planet",
    description:
      "Adaptive scaling that responds to traffic patterns in real-time. Handle 10 requests or 10 million without changing a line of code.",
    code: `// Automatic scaling configuration
{
  "scaling": {
    "mode": "adaptive",
    "min_instances": 0,
    "max_instances": "unlimited",
    "target_concurrency": 50,
    "scale_up_rate": "instant",
    "scale_down_delay": "5m",
    "regions": "auto"
  }
}`,
  },
  {
    id: "observe",
    title: "Observe",
    subtitle: "See everything",
    description:
      "Structured logs, distributed traces, and custom metrics with zero-config instrumentation. Know before your users do.",
    code: `// Zero-config observability
import { trace } from "@arc/observe"

const result = await trace("process-payment", {
  attributes: { amount, currency },
  async fn() {
    const charge = await stripe.charge(amount)
    return { id: charge.id, status: "ok" }
  }
})

// Automatically captured:
// → Duration, status, parent trace
// → Error rate, p50/p95/p99 latency
// → Custom attributes`,
  },
];

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const active = features.find((f) => f.id === activeFeature) ?? features[0];

  return (
    <section className="py-24 lg:py-40" aria-label="Feature showcase">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              Capabilities
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Three primitives.
              <br />
              Infinite possibilities.
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <nav className="flex gap-2 lg:col-span-2 lg:flex-col lg:gap-1" aria-label="Features">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`group relative w-full rounded-xl px-5 py-4 text-left transition-all duration-300 lg:px-6 lg:py-5 ${
                  activeFeature === feature.id
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                }`}
                aria-pressed={activeFeature === feature.id}
              >
                <p className="text-xs font-medium tracking-wider uppercase opacity-60">
                  {feature.subtitle}
                </p>
                <p className="mt-1 text-lg font-semibold tracking-tight lg:text-xl">
                  {feature.title}
                </p>
                <p
                  className={`mt-2 hidden text-sm leading-relaxed lg:block ${
                    activeFeature === feature.id ? "text-neutral-400" : "text-neutral-500"
                  }`}
                >
                  {feature.description}
                </p>
              </button>
            ))}
          </nav>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950"
              >
                <header className="flex items-center gap-2 border-b border-neutral-800 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                  </div>
                  <p className="ml-3 text-xs text-neutral-500">{active.id}.sh</p>
                </header>

                <div className="p-5 lg:p-6">
                  <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-neutral-300 sm:text-sm">
                    <code>{active.code}</code>
                  </pre>
                </div>
              </motion.figure>
            </AnimatePresence>

            <p className="mt-4 text-sm leading-relaxed text-neutral-500 lg:hidden">
              {active.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}