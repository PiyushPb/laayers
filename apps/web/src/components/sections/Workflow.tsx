"use client";

import { useState } from "react";
import { Sliders, RefreshCw, Zap, Shield, HelpCircle } from "lucide-react";

export default function Workflow() {
  const [rateLimit, setRateLimit] = useState(100);
  const [ttl, setTtl] = useState(60);
  const [activeTab, setActiveTab] = useState<"rate" | "filter" | "cache" | "origin">("rate");

  return (
    <section className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            Pipeline Architect
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Choreograph your pipeline
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
            Configure rules, rate limit parameters, edge code filters, and storage fallback endpoints directly from the interactive pipeline builder.
          </p>
        </div>

        {/* Pipeline Builder Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Visual node line flow */}
          <div className="lg:col-span-8 border border-white/10 bg-zinc-950 p-6 md:p-8 rounded-sm flex flex-col justify-center gap-6 min-h-[300px]">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-4">
              Pipeline visualization map
            </span>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 relative w-full pt-4">
              {/* Connector line (Hidden on mobile) */}
              <div className="hidden md:block absolute top-[50%] left-6 right-6 h-[1px] border-t border-dashed border-white/10 -z-10" />

              {/* Node 1: Rate Limiter */}
              <button
                onClick={() => setActiveTab("rate")}
                className={`w-full md:w-auto p-4 border rounded-sm flex flex-col items-center gap-2 transition-all duration-300 focus:outline-none bg-black ${
                  activeTab === "rate" ? "border-white" : "border-white/5 hover:border-white/20"
                }`}
              >
                <Shield className="w-5 h-5 text-zinc-400" />
                <span className="font-mono text-[10px] text-white uppercase font-bold">Rate Limit</span>
                <span className="font-mono text-[8px] text-zinc-500">{rateLimit} req/min</span>
              </button>

              {/* Node 2: Filter */}
              <button
                onClick={() => setActiveTab("filter")}
                className={`w-full md:w-auto p-4 border rounded-sm flex flex-col items-center gap-2 transition-all duration-300 focus:outline-none bg-black ${
                  activeTab === "filter" ? "border-white" : "border-white/5 hover:border-white/20"
                }`}
              >
                <Sliders className="w-5 h-5 text-zinc-400" />
                <span className="font-mono text-[10px] text-white uppercase font-bold">Edge Filter</span>
                <span className="font-mono text-[8px] text-zinc-500">active</span>
              </button>

              {/* Node 3: Cache */}
              <button
                onClick={() => setActiveTab("cache")}
                className={`w-full md:w-auto p-4 border rounded-sm flex flex-col items-center gap-2 transition-all duration-300 focus:outline-none bg-black ${
                  activeTab === "cache" ? "border-white" : "border-white/5 hover:border-white/20"
                }`}
              >
                <RefreshCw className="w-5 h-5 text-zinc-400" />
                <span className="font-mono text-[10px] text-white uppercase font-bold">Cache TTL</span>
                <span className="font-mono text-[8px] text-zinc-500">{ttl}s Lifetime</span>
              </button>

              {/* Node 4: Origin */}
              <button
                onClick={() => setActiveTab("origin")}
                className={`w-full md:w-auto p-4 border rounded-sm flex flex-col items-center gap-2 transition-all duration-300 focus:outline-none bg-black ${
                  activeTab === "origin" ? "border-white" : "border-white/5 hover:border-white/20"
                }`}
              >
                <Zap className="w-5 h-5 text-zinc-400" />
                <span className="font-mono text-[10px] text-white uppercase font-bold">Origin DB</span>
                <span className="font-mono text-[8px] text-zinc-500">sync active</span>
              </button>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 border-t border-white/5 pt-4 mt-4">
              <span>Pipeline status: COMPILED</span>
              <span>Deploy target: Global Edge</span>
            </div>
          </div>

          {/* Settings / Inspector column */}
          <div className="lg:col-span-4 bg-zinc-950/40 border border-white/10 p-6 md:p-8 rounded-sm flex flex-col justify-between">
            {activeTab === "rate" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-sm font-semibold uppercase text-white tracking-wide mb-2">
                    Rate Limit Settings
                  </h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Protect origin endpoints. Set a threshold limit for requests matching client authentication keys or geolocations.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-500">Threshold limit</span>
                    <span className="text-white">{rateLimit} req/min</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>
            )}

            {activeTab === "filter" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-sm font-semibold uppercase text-white tracking-wide mb-2">
                    Edge Filter Configuration
                  </h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Filter request fields or strip headers before query evaluation. Runs directly inside our lightweight V8 worker.
                  </p>
                </div>
                <div className="bg-black/60 p-4 border border-white/5 rounded-sm font-mono text-[10px] text-zinc-400">
                  <span className="text-zinc-600">// Strip authorization credentials</span>
                  <br />
                  <span>filterBody(["password", "token"])</span>
                </div>
              </div>
            )}

            {activeTab === "cache" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-sm font-semibold uppercase text-white tracking-wide mb-2">
                    Cache Rule TTL Configuration
                  </h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Define caching duration for this path. Longer TTLs decrease origin database pressure but increase data staleness risk.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-500">Cache Lifespan (TTL)</span>
                    <span className="text-white">{ttl} seconds</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="600"
                    step="5"
                    value={ttl}
                    onChange={(e) => setTtl(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>
            )}

            {activeTab === "origin" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-sm font-semibold uppercase text-white tracking-wide mb-2">
                    Origin Target Settings
                  </h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Declare origin databases or REST servers containing reference datasets. Runs write-through synchronization protocols.
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-500">Database Engine</span>
                    <span className="text-white">PostgreSQL</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">Active Syncing</span>
                    <span className="text-white">Write-Through</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-600 border-t border-white/5 pt-4 mt-6">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Select any block to adjust rule configurations.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
