"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ProductStorytelling() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5], [2, 0]);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-neutral-950 py-24 lg:py-40"
      aria-label="Product story"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="mb-4 text-sm font-medium tracking-widest text-neutral-500 uppercase">
                Why Arc
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                Stop gluing
                <br />
                services together
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mb-8 max-w-md text-base leading-relaxed text-neutral-400 lg:text-lg">
                Your team spends 40% of its time on infrastructure. That ends
                today. Arc replaces your entire cloud stack with a single,
                coherent platform.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="space-y-6">
                {[
                  {
                    label: "Before Arc",
                    items: [
                      "7+ cloud services",
                      "3 monitoring tools",
                      "Custom deployment pipeline",
                      "Manual scaling",
                    ],
                  },
                  {
                    label: "After Arc",
                    items: [
                      "One platform",
                      "Built-in observability",
                      "Git-push deploys",
                      "Auto-scaling",
                    ],
                  },
                ].map((group) => (
                  <div key={group.label}>
                    <p className="mb-3 text-xs font-medium tracking-widest text-neutral-500 uppercase">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                            group.label === "Before Arc"
                              ? "border border-neutral-800 text-neutral-500"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <motion.figure
            className="relative"
            style={
              prefersReducedMotion
                ? {}
                : { scale: imageScale, rotate: imageRotate }
            }
          >
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
              <div className="border-b border-neutral-800 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                </div>
              </div>

              <div className="p-6 font-mono text-sm leading-relaxed">
                <pre className="text-neutral-300">
                  <code>
                    <span className="text-neutral-500">{"// arc.config.ts"}</span>
                    {"\n"}
                    <span className="text-neutral-400">{"import"}</span>
                    {" { defineConfig } "}
                    <span className="text-neutral-400">{"from"}</span>
                    {" "}
                    <span className="text-emerald-400/80">{'"@arc/sdk"'}</span>
                    {"\n\n"}
                    <span className="text-neutral-400">{"export default"}</span>
                    {" defineConfig({\n"}
                    {"  "}
                    <span className="text-neutral-500">compute</span>
                    {": {\n"}
                    {"    "}
                    <span className="text-neutral-500">runtime</span>
                    {": "}
                    <span className="text-emerald-400/80">{'"edge"'}</span>
                    {",\n"}
                    {"    "}
                    <span className="text-neutral-500">regions</span>
                    {": ["}
                    <span className="text-emerald-400/80">{'"auto"'}</span>
                    {"],\n"}
                    {"    "}
                    <span className="text-neutral-500">scaling</span>
                    {": "}
                    <span className="text-emerald-400/80">{'"adaptive"'}</span>
                    {",\n"}
                    {"  },\n"}
                    {"  "}
                    <span className="text-neutral-500">storage</span>
                    {": {\n"}
                    {"    "}
                    <span className="text-neutral-500">database</span>
                    {": "}
                    <span className="text-emerald-400/80">{'"postgres"'}</span>
                    {",\n"}
                    {"    "}
                    <span className="text-neutral-500">cache</span>
                    {": "}
                    <span className="text-emerald-400/80">{'"redis"'}</span>
                    {",\n"}
                    {"    "}
                    <span className="text-neutral-500">replicas</span>
                    {": "}
                    <span className="text-emerald-400/80">{'"global"'}</span>
                    {",\n"}
                    {"  },\n"}
                    {"})"}
                  </code>
                </pre>
              </div>
            </div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}