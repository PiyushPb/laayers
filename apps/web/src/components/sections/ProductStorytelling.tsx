"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    phase: "Edge Routing",
    title: "Regional Ingress Hops",
    desc: "A user triggers an API request. Our DNS routes them to the nearest point-of-presence (POP) in under 10ms. SSL handshakes terminate at the edge.",
    details: "Ingress Pop: NRT (Tokyo) • Latency: 1.2ms",
  },
  {
    num: "02",
    phase: "Mesh Verification",
    title: "Global Directory Check",
    desc: "The POP validates authorization credentials and queries our global mesh index. If the cache is warm, the user receives their response immediately.",
    details: "Cache Status: MISS (Local) • Directory Status: HIT (Region)",
  },
  {
    num: "03",
    phase: "Coalescing",
    title: "Thundering Herd Merge",
    desc: "If regional indices report a cache miss, simultaneous incoming queries are paused. A single consolidated fetch executes towards the origin data database.",
    details: "Inbound Requests: 412 • Outbound Fetches: 1",
  },
  {
    num: "04",
    phase: "Cache Writes",
    title: "Write-Through Sync",
    desc: "Returned database fields are transformed by edge middleware, parsed into serialized bytes, and committed edge-wide for subsequent reads.",
    details: "Object Size: 1.2KB • Edge Sync Time: 0.8ms",
  },
];

export default function ProductStorytelling() {
  return (
    <section className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky Left Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
              Inside the Pipeline
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
              How data flows
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Discover the exact sequence of validation, deduping, and global caching that happens every time an endpoint is hit.
            </p>
            <div className="hidden lg:block w-full h-[1px] bg-white/10 mt-12" />
          </div>

          {/* Scrolling Right Column */}
          <div className="lg:col-span-8 flex flex-col gap-12 lg:gap-24">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-l border-white/10 pl-6 md:pl-8 relative"
              >
                {/* Visual marker dot */}
                <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 bg-white rounded-full border-4 border-black" />

                <div className="md:col-span-3">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 block mb-1">
                    Step {step.num}
                  </span>
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    {step.phase}
                  </span>
                </div>

                <div className="md:col-span-9 flex flex-col gap-3">
                  <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                    {step.desc}
                  </p>
                  <div className="font-mono text-[9px] text-zinc-500 uppercase mt-2 border border-white/5 bg-zinc-950 p-2.5 rounded-sm w-fit">
                    {step.details}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
