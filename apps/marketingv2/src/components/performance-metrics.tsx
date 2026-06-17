"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

const metrics = [
  { value: "99.99", suffix: "%", label: "Uptime SLA" },
  { value: "12", suffix: "ms", label: "Global p50 latency" },
  { value: "300", suffix: "+", label: "Edge locations" },
  { value: "50", suffix: "M", label: "Requests per second" },
];

function AnimatedNumber({
  value,
  suffix,
}: {
  value: string;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.span>
      <span className="text-neutral-400">{suffix}</span>
    </span>
  );
}

export function PerformanceMetrics() {
  return (
    <section className="bg-neutral-950 py-24 lg:py-40" aria-label="Performance">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <p className="mb-4 text-center text-sm font-medium tracking-widest text-neutral-500 uppercase">
            Performance
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mx-auto mb-20 max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Numbers that speak
            <br />
            for themselves
          </h2>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 0.1} direction="none">
              <article className="bg-neutral-900 p-8 text-center lg:p-10">
                <p className="mb-2 text-4xl font-bold tracking-tight text-white lg:text-5xl">
                  <AnimatedNumber value={metric.value} suffix={metric.suffix} />
                </p>
                <p className="text-sm text-neutral-500">{metric.label}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <figure className="mt-16 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Global latency distribution</p>
                <p className="text-xs text-neutral-500">Last 24 hours</p>
              </div>
              <div className="flex gap-4">
                {[
                  { label: "p50", color: "bg-emerald-500" },
                  { label: "p95", color: "bg-amber-500" },
                  { label: "p99", color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-neutral-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-48 items-end gap-0.5 sm:h-56">
              {Array.from({ length: 48 }).map((_, i) => {
                const p50 = 15 + Math.sin(i * 0.3) * 8 + Math.random() * 5;
                const p95 = p50 + 10 + Math.random() * 8;
                const p99 = p95 + 5 + Math.random() * 5;
                return (
                  <div key={i} className="relative flex flex-1 flex-col justify-end">
                    <motion.div
                      className="rounded-t-sm bg-red-500/20"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${p99}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.02 }}
                    />
                    <motion.div
                      className="absolute bottom-0 w-full rounded-t-sm bg-amber-500/30"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${p95}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.02 }}
                    />
                    <motion.div
                      className="absolute bottom-0 w-full rounded-t-sm bg-emerald-500/50"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${p50}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.02 }}
                    />
                  </div>
                );
              })}
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}