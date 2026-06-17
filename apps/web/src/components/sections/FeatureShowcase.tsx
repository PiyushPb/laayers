"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Circle, HardDrive, RefreshCw, Layers2 } from "lucide-react";

const features = [
  {
    id: "dynamic",
    icon: <Layers2 className="w-4 h-4" />,
    name: "Dynamic Cache Keys",
    title: "Cache query payloads dynamically",
    desc: "Formulate custom caching rules based on request body hashes, auth tokens, or geolocation variables. Keep private user data private while caching public resources globally.",
    stats: [
      { label: "Query Speedup", val: "98.4%" },
      { label: "Origin Load", val: "-92.1%" },
      { label: "Sync Overhead", val: "<0.4ms" },
    ],
    graphData: [20, 15, 8, 4, 2],
  },
  {
    id: "compute",
    icon: <Circle className="w-4 h-4" />,
    name: "Edge Computations",
    title: "Transform payloads at the edge",
    desc: "Run light edge routines on cache misses or hits. Redact sensitive user attributes, combine downstream payloads, or inject response metadata directly inside the caching node.",
    stats: [
      { label: "Execution Time", val: "1.4ms" },
      { label: "Memory Allocated", val: "8MB" },
      { label: "Runtimes", val: "Node/V8" },
    ],
    graphData: [40, 38, 42, 39, 41],
  },
  {
    id: "prefetch",
    icon: <HardDrive className="w-4 h-4" />,
    name: "Intelligent Prefetch",
    title: "Preheat paths before hits happen",
    desc: "Analyze incoming sequence patterns to predict future page transitions. Automatically prefetch data for next-step routes to keep user latency at absolute zero.",
    stats: [
      { label: "Prediction Accuracy", val: "94.2%" },
      { label: "Cache Hit Ratio", val: "99.8%" },
      { label: "Warm POPs", val: "300+" },
    ],
    graphData: [10, 8, 5, 2, 1],
  },
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState("dynamic");
  const activeFeature = features.find((f) => f.id === activeTab) || features[0];

  return (
    <section id="feature-showcase" className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            Interactive Console
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Fine-tuned control
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
            Toggle caching strategies below to preview telemetry and performance impacts on our edge routing platform.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto scrollbar-none gap-2">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className={`relative flex items-center gap-2 px-6 py-4 font-mono text-[11px] uppercase tracking-wider transition-colors duration-200 shrink-0 focus:outline-none ${
                activeTab === feature.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {feature.icon}
              {feature.name}
              {activeTab === feature.id && (
                <motion.div
                  layoutId="activeFeatureIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Workspace Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-white/10 p-6 md:p-8 bg-zinc-950/40 rounded-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                <h3 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight text-white">
                  {activeFeature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {activeFeature.desc}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6 mt-4">
                  {activeFeature.stats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">
                        {stat.label}
                      </span>
                      <span className="text-lg font-bold text-white mt-1">
                        {stat.val}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Telemetry Visual Column */}
          <div className="lg:col-span-7 border border-white/10 bg-zinc-950 p-6 md:p-8 rounded-sm flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-zinc-500 animate-spin" />
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                  Live Edge Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                Active Zone: US-EAST
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6 min-h-[220px]">
              {/* Telemetry Graph Visualizer */}
              <div className="flex flex-col gap-1 w-full">
                <span className="font-mono text-[9px] text-zinc-500 uppercase mb-2">
                  Object lookup latency sequence (ms)
                </span>
                <div className="grid grid-cols-5 gap-3 items-end h-28 border border-white/5 p-4 bg-zinc-900/40 rounded-sm">
                  {activeFeature.graphData.map((data, i) => (
                    <div key={i} className="h-full flex flex-col justify-end items-center gap-2">
                      <span className="font-mono text-[9px] text-zinc-500">{data}ms</span>
                      <motion.div
                        className="w-full bg-white"
                        animate={{ height: `${(data / 50) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Status footer */}
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 border-t border-white/5 pt-4">
                <span>Memory State: OPTIMIZED</span>
                <span>Replica Status: 100% HEALTHY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
