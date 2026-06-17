"use client";

import { Check, Minus } from "lucide-react";

const rows = [
  {
    feature: "Global Edge Replication",
    laayers: "300+ Edge POPs",
    redis: "Manual cluster configurations",
    kv: "Regional endpoints",
    isSupported: [true, false, false],
  },
  {
    feature: "Request Coalescing",
    laayers: "Native Gate Mutex",
    redis: "Require custom application logic",
    kv: "None (causes heavy database hits)",
    isSupported: [true, false, false],
  },
  {
    feature: "Edge Middleware",
    laayers: "Native in-memory V8",
    redis: "Lua Scripting (locks thread)",
    kv: "Workers binding required",
    isSupported: [true, false, true],
  },
  {
    feature: "SWR Sync Protocols",
    laayers: "Automatic write-through",
    redis: "Manual invalidation triggers",
    kv: "Eventual consistency only",
    isSupported: [true, false, false],
  },
  {
    feature: "Integration overhead",
    laayers: "3 lines of code",
    redis: "Heavy connection pooling config",
    kv: "Platform vendor lock-in",
    isSupported: [true, false, false],
  },
];

export default function Comparison() {
  return (
    <section id="comparison" className="py-24 border-b border-white/5 relative bg-zinc-950/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            Technical Comparison
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Compare specs
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
            See how Laayers compares directly against self-managed caches or general edge key-value data stores.
          </p>
        </div>

        {/* Comparison grid table */}
        <div className="border border-white/10 rounded-sm overflow-hidden bg-zinc-950">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900/40">
                <th className="p-4 md:p-6 text-zinc-400 font-mono text-[10px] uppercase tracking-widest w-[30%]">
                  Feature
                </th>
                <th className="p-4 md:p-6 text-white font-display font-bold uppercase tracking-wider bg-white/5 w-[25%]">
                  Laayers Edge
                </th>
                <th className="p-4 md:p-6 text-zinc-500 font-mono text-[10px] uppercase tracking-widest w-[22.5%]">
                  Self-Hosted Redis
                </th>
                <th className="p-4 md:p-6 text-zinc-500 font-mono text-[10px] uppercase tracking-widest w-[22.5%]">
                  Edge KV Stores
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-zinc-900/20 transition-colors">
                  {/* Feature Label */}
                  <td className="p-4 md:p-6 font-semibold text-white uppercase tracking-wide">
                    {row.feature}
                  </td>

                  {/* Laayers */}
                  <td className="p-4 md:p-6 bg-white/[0.02] border-x border-white/5 text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white shrink-0" />
                      <span>{row.laayers}</span>
                    </div>
                  </td>

                  {/* Redis */}
                  <td className="p-4 md:p-6 text-zinc-500">
                    <div className="flex items-center gap-2">
                      {row.isSupported[1] ? (
                        <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                      ) : (
                        <Minus className="w-4 h-4 text-zinc-700 shrink-0" />
                      )}
                      <span>{row.redis}</span>
                    </div>
                  </td>

                  {/* Edge KV */}
                  <td className="p-4 md:p-6 text-zinc-500">
                    <div className="flex items-center gap-2">
                      {row.isSupported[2] ? (
                        <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                      ) : (
                        <Minus className="w-4 h-4 text-zinc-700 shrink-0" />
                      )}
                      <span>{row.kv}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
