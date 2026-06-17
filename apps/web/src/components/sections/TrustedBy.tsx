"use client";

import { motion } from "framer-motion";

const companies = [
  "Stripe",
  "Vercel",
  "Linear",
  "Supabase",
  "Cloudflare",
  "Retool",
  "HashiCorp",
  "Resend",
  "Railway",
];

export default function TrustedBy() {
  // Double the array for seamless infinite scrolling
  const tickerItems = [...companies, ...companies];

  return (
    <section className="py-12 border-b border-white/5 bg-zinc-950/20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 text-center mb-8">
          Trusted by infrastructure teams worldwide
        </p>

        {/* Fading Edge overlays */}
        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="flex overflow-hidden w-full">
            <div className="flex gap-20 shrink-0 w-max animate-marquee">
              {tickerItems.map((company, index) => (
                <div
                  key={`${company}-${index}`}
                  className="flex items-center gap-2 select-none group"
                >
                  <div className="w-2 h-2 bg-zinc-700 rounded-full group-hover:bg-white transition-colors" />
                  <span className="font-display font-bold text-zinc-500 group-hover:text-zinc-300 text-lg uppercase tracking-wider transition-colors duration-200">
                    {company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
