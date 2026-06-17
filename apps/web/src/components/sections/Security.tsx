"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

export default function Security() {
  const [revealKey, setRevealKey] = useState(false);

  return (
    <section className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text contents */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
                Enterprise Security
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
                Bank-Grade Isolation
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                Every request is validated at edge gateways. Encryption-at-rest handles cached bytes, while isolated execution prevents cross-tenant memory queries.
              </p>
            </div>

            {/* Compliance certifications */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 mt-4">
              {["SOC2 Type II", "ISO 27001", "GDPR Ready", "HIPAA Compliant"].map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Security Panel */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="border border-white/10 bg-zinc-950 p-6 md:p-8 rounded-sm flex flex-col gap-6 shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-zinc-400" />
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                    Access control & encryption keys
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-zinc-500" />
                  <span className="font-mono text-[8px] text-zinc-500 uppercase">AES-256 Enabled</span>
                </div>
              </div>

              {/* Encryption Key reveal */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] text-zinc-500 uppercase">Active API Auth Key</span>
                <div className="flex items-center justify-between border border-white/5 bg-zinc-900/60 p-4 rounded-sm">
                  <span className="font-mono text-xs text-white tracking-wider">
                    {revealKey ? "ly_live_9x82fa10c9a4b3d7e8f0012c8b" : "ly_live_••••••••••••••••••••••••2c8b"}
                  </span>
                  <button
                    onClick={() => setRevealKey(!revealKey)}
                    className="p-1.5 text-zinc-500 hover:text-white transition-colors focus:outline-none"
                    aria-label={revealKey ? "Hide API key" : "Show API key"}
                  >
                    {revealKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Live Audit Log checklist */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] text-zinc-500 uppercase">Live Access Audits</span>
                <div className="flex flex-col gap-2 font-mono text-[10px] text-zinc-400 bg-black/40 border border-white/5 p-4 rounded-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">2026-06-17 12:06:45</span>
                    <span className="text-white">API Key Rotated</span>
                    <span className="text-zinc-500">IAD</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">2026-06-17 11:42:12</span>
                    <span className="text-white">Zone Purge: NRT Edge</span>
                    <span className="text-zinc-500">Tokyo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">2026-06-17 10:15:01</span>
                    <span className="text-white">TLS Handshake Terminated</span>
                    <span className="text-zinc-500">CDG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
