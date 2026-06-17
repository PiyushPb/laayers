"use client";

import { motion } from "framer-motion";
import { Server, Database, Shuffle, ShieldAlert } from "lucide-react";

export default function EnterpriseInfrastructure() {
  return (
    <section id="infrastructure" className="py-24 border-b border-white/5 relative bg-zinc-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center max-w-xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            Infrastructure Stack
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Zero-Trust Mesh Architecture
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Our edge infrastructure is distributed across tier-1 carrier centers worldwide, delivering low-latency cached data with bank-grade failover rules.
          </p>
        </div>

        {/* System Diagram Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch relative">
          {/* Node 1: Client Gateway */}
          <div className="border border-white/10 p-6 bg-zinc-950/60 rounded-sm flex flex-col justify-between items-start">
            <div>
              <div className="w-8 h-8 rounded-sm border border-white/10 bg-zinc-900 flex items-center justify-center mb-6 text-zinc-400">
                <Shuffle className="w-4 h-4" />
              </div>
              <h3 className="font-display font-semibold text-sm uppercase text-white tracking-wide mb-2">
                1. DNS Routing
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Smart geolocation lookup matches incoming client requests to the optimal point-of-presence in under 5ms.
              </p>
            </div>
            <span className="font-mono text-[9px] text-zinc-600 mt-6 uppercase tracking-wider">
              Anycast IP • Geo-DNS
            </span>
          </div>

          {/* Node 2: Edge POP */}
          <div className="border border-white/10 p-6 bg-zinc-950/60 rounded-sm flex flex-col justify-between items-start">
            <div>
              <div className="w-8 h-8 rounded-sm border border-white/10 bg-zinc-900 flex items-center justify-center mb-6 text-zinc-400">
                <Server className="w-4 h-4" />
              </div>
              <h3 className="font-display font-semibold text-sm uppercase text-white tracking-wide mb-2">
                2. Edge Proxies
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Distributed edge workers terminate TLS handshakes and query the regional in-memory caching directory.
              </p>
            </div>
            <span className="font-mono text-[9px] text-zinc-600 mt-6 uppercase tracking-wider">
              V8 Engine • TLS 1.3
            </span>
          </div>

          {/* Node 3: Coalesce Gate */}
          <div className="border border-white/10 p-6 bg-zinc-950/60 rounded-sm flex flex-col justify-between items-start">
            <div>
              <div className="w-8 h-8 rounded-sm border border-white/10 bg-zinc-900 flex items-center justify-center mb-6 text-zinc-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="font-display font-semibold text-sm uppercase text-white tracking-wide mb-2">
                3. Coalescing Gateway
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Thundering herd protection merges duplicate read requests, pausing parallel inquiries to lock state queries.
              </p>
            </div>
            <span className="font-mono text-[9px] text-zinc-600 mt-6 uppercase tracking-wider">
              Atomic Mutex Lock
            </span>
          </div>

          {/* Node 4: DB Origin */}
          <div className="border border-white/10 p-6 bg-zinc-950/60 rounded-sm flex flex-col justify-between items-start">
            <div>
              <div className="w-8 h-8 rounded-sm border border-white/10 bg-zinc-900 flex items-center justify-center mb-6 text-zinc-400">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-display font-semibold text-sm uppercase text-white tracking-wide mb-2">
                4. Primary Database
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Single query reads origin database on cache miss. Write-through pipelines sync caching updates globally.
              </p>
            </div>
            <span className="font-mono text-[9px] text-zinc-600 mt-6 uppercase tracking-wider">
              Origin DB • Read Sync
            </span>
          </div>
        </div>

        {/* Connectivity line drawing (Hidden on mobile) */}
        <div className="hidden md:block absolute top-[calc(50%+40px)] left-6 right-6 h-[1px] border-t border-dashed border-white/10 pointer-events-none -z-10" />
      </div>
    </section>
  );
}
