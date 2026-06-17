"use client";

import { useState } from "react";
import { Database, Link, Server, Cloud, Cpu, ArrowRight } from "lucide-react";

const integrations = [
  { id: "supabase", name: "Supabase", type: "PostgreSQL Database", delay: "0.2ms", icon: <Database className="w-5 h-5" /> },
  { id: "prisma", name: "Prisma ORM", type: "Query Compiler", delay: "0.1ms", icon: <Cpu className="w-5 h-5" /> },
  { id: "postgres", name: "Postgres", type: "Relational Database", delay: "0.4ms", icon: <Database className="w-5 h-5" /> },
  { id: "cloudflare", name: "Cloudflare", type: "Edge Platform", delay: "0.8ms", icon: <Cloud className="w-5 h-5" /> },
  { id: "aurora", name: "AWS Aurora", type: "Serverless Database", delay: "0.6ms", icon: <Server className="w-5 h-5" /> },
  { id: "planetscale", name: "PlanetScale", type: "MySQL Database", delay: "0.5ms", icon: <Database className="w-5 h-5" /> },
];

export default function Integrations() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const activeNode = integrations.find((i) => i.id === hoveredNode);

  return (
    <section id="integrations" className="py-24 border-b border-white/5 relative bg-zinc-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Header descriptions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
                Global Integrations
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
                Connected ecosystems
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                Laayers integrates natively with your existing databases and ORMs. No architectural changes needed.
              </p>
            </div>

            {/* Displaying details of hovered integration */}
            <div className="h-28 border border-white/10 p-4 rounded-sm bg-zinc-950 flex flex-col justify-center gap-2">
              {activeNode ? (
                <>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white uppercase font-bold">{activeNode.name}</span>
                    <span className="text-zinc-500">{activeNode.type}</span>
                  </div>
                  <div className="text-zinc-400 text-xs leading-relaxed">
                    Integration latency overhead: <span className="text-white font-mono">{activeNode.delay}</span>. Sync operations run asynchronous, bypassing client read paths.
                  </div>
                </>
              ) : (
                <div className="text-zinc-500 text-xs font-mono text-center">
                  Hover over any integration node to inspect connection status.
                </div>
              )}
            </div>
          </div>

          {/* Grid Layout of Integrations */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {integrations.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredNode(item.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`p-6 border rounded-sm bg-zinc-950/80 cursor-pointer flex flex-col justify-between items-start aspect-square transition-all duration-300 ${
                  hoveredNode === item.id ? "border-white" : "border-white/5"
                }`}
              >
                <div className="flex justify-between w-full">
                  <div className="text-zinc-400">{item.icon}</div>
                  <Link className={`w-3.5 h-3.5 transition-opacity ${hoveredNode === item.id ? "opacity-100 text-white" : "opacity-20"}`} />
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                    {item.name}
                  </h4>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase">
                    {item.type.split(" ")[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
