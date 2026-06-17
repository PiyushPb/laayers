"use client";

import React, { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <section className="py-32 relative overflow-hidden border-b border-white/5 bg-zinc-950/20">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_120%,rgba(255,255,255,0.02),transparent)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-6">
          Ready to Deploy
        </p>

        <h2 className="font-display text-4xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] text-white mb-8 select-none">
          Supercharge <br />
          <span className="text-zinc-500">Your Database Reads.</span>
        </h2>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-12">
          Join high-growth infrastructure teams who use Laayers to cache API routes and safeguard database clusters under load.
        </p>

        {/* Input Form */}
        <div className="max-w-md mx-auto h-20">
          {status === "success" ? (
            <div className="flex items-center justify-center gap-2 text-zinc-300 font-mono text-xs border border-white/10 bg-zinc-950 p-4 rounded-sm">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>Workspace created. Check your inbox to connect.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                disabled={status === "loading"}
                className="flex-1 bg-black border border-white/10 hover:border-white/20 focus:border-white text-white font-mono text-xs px-4 py-3.5 rounded-sm focus:outline-none disabled:opacity-50 transition-colors"
                aria-label="Email address for workspace sign up"
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="group flex items-center justify-center gap-2 bg-white text-black text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <>
                    Initialize Workspace
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
