"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const loadTiers = [
  {
    label: "1,000 req/s",
    value: 1000,
    latency: "1.2ms",
    hitRatio: "98.9%",
    dbCpuWith: "3%",
    dbCpuWithout: "14%",
    chartPoints: "M 0 60 Q 40 50 80 55 T 160 52 T 240 50 T 320 54",
  },
  {
    label: "10,000 req/s",
    value: 10000,
    latency: "1.4ms",
    hitRatio: "99.2%",
    dbCpuWith: "5%",
    dbCpuWithout: "78%",
    chartPoints: "M 0 58 Q 40 48 80 52 T 160 49 T 240 51 T 320 47",
  },
  {
    label: "50,000 req/s",
    value: 50000,
    latency: "1.8ms",
    hitRatio: "99.6%",
    dbCpuWith: "8%",
    dbCpuWithout: "100% (CRASH)",
    chartPoints: "M 0 54 Q 40 46 80 50 T 160 44 T 240 45 T 320 40",
  },
];

export default function PerformanceMetrics() {
  const [selectedLoad, setSelectedLoad] = useState(10000);
  const activeData = loadTiers.find((t) => t.value === selectedLoad) || loadTiers[0];

  return (
    <section className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
              Stress Simulation
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
              Predictable under load
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Origin databases are highly sensitive to concurrent query load. Test simulated endpoint throughput below to view Cache hit performance and origin safety thresholds.
            </p>
          </div>

          {/* Loader Switch buttons */}
          <div className="lg:col-span-6 flex gap-2 justify-start lg:justify-end">
            {loadTiers.map((tier) => (
              <button
                key={tier.value}
                onClick={() => setSelectedLoad(tier.value)}
                className={`font-mono text-[10px] uppercase tracking-wider px-5 py-3 border transition-colors focus:outline-none ${
                  selectedLoad === tier.value
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-zinc-400 border-white/10 hover:text-white"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Simulator Dashboard Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Chart Panel */}
          <div className="lg:col-span-7 bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                    Telemetry Latency Curve
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  Simulated load: {activeData.label}
                </span>
              </div>

              {/* Latency Wave Chart */}
              <div className="relative h-36 border border-white/5 rounded-sm p-4 bg-black/40 overflow-hidden flex items-end">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 320 80"
                  preserveAspectRatio="none"
                  className="w-full h-full opacity-80"
                >
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="320" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="320" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="320" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                  {/* SVG Line path */}
                  <path
                    d={activeData.chartPoints}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all duration-500 ease-in-out"
                  />
                </svg>
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-6">
              <span>0s elapsed</span>
              <span>120s elapsed</span>
            </div>
          </div>

          {/* Side metrics panel */}
          <div className="lg:col-span-5 bg-zinc-950/40 border border-white/10 p-6 md:p-8 rounded-sm flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-4">
                Origin Health Indicators
              </span>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                  Edge Read Latency
                </span>
                <span className="text-xl font-bold text-white font-mono">{activeData.latency}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                  Cache Hit Rate
                </span>
                <span className="text-xl font-bold text-white font-mono">{activeData.hitRatio}</span>
              </div>

              <div className="h-px bg-white/5 my-2" />

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Origin CPU (With Laayers)</span>
                  <span className="text-white">{activeData.dbCpuWith}</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-white h-full"
                    animate={{ width: activeData.dbCpuWith }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Origin CPU (Without Laayers)</span>
                  <span
                    className={
                      activeData.dbCpuWithout.includes("CRASH") ? "text-red-500" : "text-zinc-300"
                    }
                  >
                    {activeData.dbCpuWithout}
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      activeData.dbCpuWithout.includes("CRASH") ? "bg-red-950" : "bg-zinc-600"
                    }`}
                    animate={{
                      width: activeData.dbCpuWithout.includes("CRASH")
                        ? "100%"
                        : activeData.dbCpuWithout,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
