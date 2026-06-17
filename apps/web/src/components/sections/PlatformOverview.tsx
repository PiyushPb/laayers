"use client";

import { motion } from "framer-motion";
import { Zap, Globe, Layers, Cpu } from "lucide-react";

const bentoItems = [
  {
    icon: <Zap className="w-5 h-5 text-white" />,
    title: "Sub-2ms Edge Telemetry",
    desc: "Cache read paths globally. Zero database trips on cache hits. Automatic query synchronization ensures your users get real-time state with single-digit millisecond latency.",
    colSpan: "lg:col-span-8",
    graphic: (
      <div className="mt-8 flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center text-xs font-mono text-zinc-500 mb-1">
          <span>Response latency by region</span>
          <span className="text-white">Avg. 1.84ms</span>
        </div>
        <div className="grid grid-cols-5 gap-2 items-end h-28 bg-zinc-950 border border-white/5 rounded-sm p-4">
          {[
            { region: "IAD", latency: "1.2ms", val: 15 },
            { region: "LHR", latency: "1.9ms", val: 24 },
            { region: "CDG", latency: "2.1ms", val: 28 },
            { region: "HND", latency: "2.4ms", val: 32 },
            { region: "SIN", latency: "2.9ms", val: 40 },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="font-mono text-[9px] text-zinc-500">{item.latency}</span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${item.val}%` }}
                viewport={{ once: true, amount: 0.01 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="w-full min-w-8 bg-white/80 hover:bg-white transition-colors rounded-sm"
              />
              <span className="font-mono text-[9px] text-zinc-400">{item.region}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: <Globe className="w-5 h-5 text-white" />,
    title: "Global Mesh Network",
    desc: "Edge proxies deployed in 300+ POPs handle active sessions close to your users.",
    colSpan: "lg:col-span-4",
    graphic: (
      <div className="mt-6 relative h-28 bg-zinc-950 border border-white/5 rounded-sm overflow-hidden flex items-center justify-center">
        <svg width="200" height="80" viewBox="0 0 200 80" className="opacity-40">
          <circle cx="30" cy="50" r="2" fill="#fff" />
          <circle cx="80" cy="20" r="2" fill="#fff" />
          <circle cx="120" cy="60" r="2" fill="#fff" />
          <circle cx="170" cy="30" r="2" fill="#fff" />
          <path d="M30,50 L80,20 L120,60 L170,30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />
          <path d="M30,50 L120,60 L170,30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        </svg>
        <span className="absolute bottom-2 right-3 font-mono text-[9px] text-zinc-500 uppercase">
          328 Edge Nodes Active
        </span>
      </div>
    ),
  },
  {
    icon: <Layers className="w-5 h-5 text-white" />,
    title: "Request Coalescing",
    desc: "Thundering herd protection built-in. Parallel requests for the same stale cache key are collapsed into a single outbound query to your database.",
    colSpan: "lg:col-span-4",
    graphic: (
      <div className="mt-6 flex flex-col gap-2 p-3 bg-zinc-950 border border-white/5 rounded-sm">
        <div className="flex justify-between font-mono text-[9px] text-zinc-500">
          <span>Inbound Clients</span>
          <span>Outbound DB Query</span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono py-1">
          <div className="flex flex-col gap-1 text-[9px] text-zinc-400">
            <span>Client A (read)</span>
            <span>Client B (read)</span>
            <span>Client C (read)</span>
          </div>
          <div className="text-zinc-600">➔</div>
          <div className="border border-white/10 px-2.5 py-1 bg-zinc-900 rounded-sm text-[9px] text-white">
            1 Query Outbound
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Cpu className="w-5 h-5 text-white" />,
    title: "Unified Orchestration Layer",
    desc: "Execute edge routines right alongside cached keys. Filter database fields, transform outputs, or enforce dynamic API rate limits directly in-memory at our routing layer.",
    colSpan: "lg:col-span-8",
    graphic: (
      <div className="mt-6 w-full font-mono text-[10px] text-zinc-400 bg-zinc-950 border border-white/5 rounded-sm p-4 text-left">
        <span className="text-zinc-600">// Edge middleware execution</span>
        <div className="mt-1">
          <span className="text-zinc-200">export default async function</span>{" "}
          <span className="text-white">onCacheMiss</span>(req) &#123;
        </div>
        <div className="pl-4">
          <span className="text-zinc-200">const</span> headers = req.headers;
          <br />
          <span className="text-zinc-200">return</span> applyFilter(headers, ["id", "hash"]);
        </div>
        <div>&#125;</div>
      </div>
    ),
  },
];

export default function PlatformOverview() {
  return (
    <section id="platform" className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            Unified Platform
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Engineered for high load
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Standard caching engines require manual replication, complex routing tables, and constant schema updates. Laayers automates caching at the networking layer.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {bentoItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: idx * 0.05 }}
              className={`${item.colSpan} border border-white/5 bg-zinc-950/40 hover:bg-zinc-950/60 p-6 md:p-8 flex flex-col justify-between rounded-sm transition-colors duration-300 group`}
            >
              <div>
                <div className="w-10 h-10 rounded-sm bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 group-hover:border-white/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-xl">
                  {item.desc}
                </p>
              </div>
              {item.graphic}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
