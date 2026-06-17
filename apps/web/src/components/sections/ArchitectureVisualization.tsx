"use client";

import { useState } from "react";
import { Server, Database, User } from "lucide-react";

export default function ArchitectureVisualization() {
  const [mode, setMode] = useState<"direct" | "laayers">("laayers");

  return (
    <section className="py-24 border-b border-white/5 relative bg-zinc-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
              Flow Topology
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
              Visualizing the paths
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Compare direct database queries against the optimized Laayers edge proxy layout. Direct models queue parallel queries, whereas Laayers intercepts and answers.
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="lg:col-span-6 flex gap-2 justify-start lg:justify-end">
            <button
              onClick={() => setMode("direct")}
              className={`font-mono text-[10px] uppercase tracking-wider px-5 py-3 border transition-colors focus:outline-none ${
                mode === "direct"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-white/10 hover:text-white"
              }`}
            >
              Direct Queries (No cache)
            </button>
            <button
              onClick={() => setMode("laayers")}
              className={`font-mono text-[10px] uppercase tracking-wider px-5 py-3 border transition-colors focus:outline-none ${
                mode === "laayers"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-white/10 hover:text-white"
              }`}
            >
              Laayers Proxy (Cache Mesh)
            </button>
          </div>
        </div>

        {/* Visual Schematic Panel */}
        <div className="border border-white/10 bg-zinc-950 p-6 md:p-12 rounded-sm flex flex-col items-center justify-center relative min-h-[360px]">
          {/* Geolocation visual backgrounds */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {mode === "direct" ? (
            /* Direct-to-Database flow map */
            <div className="relative z-10 w-full max-w-xl flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
              <div className="flex flex-col gap-3 items-center">
                <User className="w-8 h-8 text-zinc-500" />
                <span className="font-mono text-[10px] text-zinc-500 uppercase">100 concurrent clients</span>
              </div>

              {/* Red warning bridge indicating queue bottlenecking */}
              <div className="flex-1 flex flex-col items-center gap-2 w-full text-center px-4">
                <span className="font-mono text-[9px] text-red-500 uppercase tracking-widest">
                  100 concurrent DB connections
                </span>
                <div className="w-full h-[1px] bg-red-950/60 border-t border-dashed border-red-500/40 relative" />
                <span className="font-mono text-[8px] text-zinc-500">Latency: 142ms</span>
              </div>

              <div className="flex flex-col gap-3 items-center">
                <Database className="w-8 h-8 text-red-500 animate-pulse" />
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Origin Database</span>
              </div>
            </div>
          ) : (
            /* Laayers network proxy mapping */
            <div className="relative z-10 w-full max-w-2xl flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
              {/* Clients */}
              <div className="flex flex-col gap-3 items-center">
                <User className="w-8 h-8 text-zinc-400" />
                <span className="font-mono text-[10px] text-zinc-500 uppercase">100 Clients</span>
              </div>

              {/* Path 1: Clients to Proxy */}
              <div className="flex-1 flex flex-col items-center gap-2 w-full text-center px-4">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                  Anycast Ingress
                </span>
                <div className="w-full h-[1px] border-t border-dashed border-white/20" />
                <span className="font-mono text-[8px] text-zinc-500">Latency: 1.2ms</span>
              </div>

              {/* Edge Proxy Node */}
              <div className="flex flex-col gap-3 items-center border border-white/10 bg-zinc-900 px-4 py-3 rounded-sm">
                <Server className="w-6 h-6 text-white" />
                <span className="font-mono text-[9px] text-zinc-300 uppercase">Laayers Edge Cache</span>
              </div>

              {/* Path 2: Proxy to Database */}
              <div className="flex-1 flex flex-col items-center gap-2 w-full text-center px-4">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                  Coalesced Miss Connection
                </span>
                <div className="w-full h-[1px] border-t border-dashed border-white/10" />
                <span className="font-mono text-[8px] text-zinc-600">1 Outbound connection</span>
              </div>

              {/* Primary DB */}
              <div className="flex flex-col gap-3 items-center">
                <Database className="w-8 h-8 text-zinc-400" />
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Origin Database</span>
              </div>
            </div>
          )}

          {/* Description overlay */}
          <div className="mt-12 font-mono text-[9px] text-zinc-500 uppercase tracking-wider text-center max-w-sm">
            {mode === "direct"
              ? "Without Laayers, simultaneous requests query the primary db, locking tables and scaling memory usage."
              : "With Laayers, Edge proxies serve queries from nearby caches. Only a single consolidated query hits the origin db on cache misses."}
          </div>
        </div>
      </div>
    </section>
  );
}
