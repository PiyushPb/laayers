"use client";

import { Cpu, Terminal, ShieldCheck, Database } from "lucide-react";

const useCases = [
  {
    icon: <Terminal className="w-5 h-5 text-white" />,
    title: "High-Frequency APIs",
    desc: "Cache high-frequency REST or GraphQL queries. Avoid querying primary database clusters for identical reads, reducing database costs by up to 90%.",
    metric: "Scale: 100M+ reqs/day",
  },
  {
    icon: <Cpu className="w-5 h-5 text-white" />,
    title: "Serverless Computing",
    desc: "Serve edge responses in under 2ms. Prevent serverless connection pool exhaustion by routing database reads through Laayers local memory mesh.",
    metric: "Timeout Threshold: 0ms",
  },
  {
    icon: <Database className="w-5 h-5 text-white" />,
    title: "AI Inference & LLMs",
    desc: "Cache repetitive embedding queries and structured LLM responses. Dramatically reduce expensive model provider costs and speed up client load cycles.",
    metric: "Token Saving: Up to 80%",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-white" />,
    title: "Operational Dashboards",
    desc: "Cache analytics data without serving stale read outputs. Let Laayers handle out-of-band updates using configurable stale-while-revalidate schedules.",
    metric: "SWR Window: Custom",
  },
];

export default function UseCases() {
  return (
    <section className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            Platform Solutions
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Engineered for modern workloads
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            From API optimization to serverless caching layers, discover how teams use Laayers to resolve latency and cluster limitations.
          </p>
        </div>

        {/* Use Cases grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((item, idx) => (
            <div
              key={idx}
              className="p-6 border border-white/5 bg-zinc-950/40 hover:bg-zinc-950/80 hover:border-white/20 transition-all duration-300 rounded-sm flex flex-col justify-between items-start min-h-[260px] group"
            >
              <div>
                <div className="w-8 h-8 bg-zinc-900 border border-white/10 rounded-sm flex items-center justify-center mb-6 group-hover:border-white/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest border border-white/5 bg-zinc-900/40 px-2 py-1 rounded-sm mt-6">
                {item.metric}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
