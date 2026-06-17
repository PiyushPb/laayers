"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-32 pb-20 border-b border-white/5">
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-8 gap-4 px-6 pointer-events-none opacity-25">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-full border-r border-white/5 last:border-0" />
        ))}
      </div>

      {/* Hero Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(255,255,255,0.03),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Typography Side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 border border-white/10 rounded-full px-3.5 py-1 mb-8"
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              Introducing Laayers Edge Cache v2.0
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-black text-5xl md:text-7xl xl:text-8xl tracking-tight leading-[0.9] text-white select-none mb-6 uppercase"
          >
            Multi-Layer <br />
            <span className="text-zinc-500">Edge Caching</span> <br />
            At Scale.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 font-sans text-base md:text-lg max-w-xl leading-relaxed mb-10"
          >
            Supercharge database speeds and minimize network hops. Laayers sits
            between your database and users, intelligent-routing requests and
            handling global caching under 2ms.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#docs"
              className="group flex items-center justify-center gap-2 bg-white text-black text-xs font-semibold uppercase tracking-wider px-6 py-4 rounded-sm hover:bg-zinc-200 transition-colors w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
            <a
              href="#terminal"
              className="group flex items-center justify-center gap-2 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider px-6 py-4 rounded-sm hover:bg-white/5 transition-colors w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <Terminal className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              View SDKs
            </a>
          </motion.div>
        </motion.div>

        {/* Right Architectural Visualizer Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="lg:col-span-5 w-full flex justify-center"
        >
          <div className="w-full max-w-md border border-white/10 rounded-sm bg-zinc-950/80 backdrop-blur-md overflow-hidden shadow-2xl">
            {/* Header window control */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-900/50">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
              <div className="font-mono text-[10px] text-zinc-500">
                edge-visualizer.laayers.dev
              </div>
              <div className="w-6" /> {/* spacer */}
            </div>

            {/* Visualizer Body */}
            <div className="p-6 flex flex-col gap-6 relative min-h-[300px] justify-center items-center">
              {/* Background dots grid */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Animated Network Topology */}
              <svg
                width="280"
                height="180"
                viewBox="0 0 280 180"
                fill="none"
                className="relative z-10 w-full max-w-[280px]"
                aria-hidden="true"
              >
                {/* Node Connection Lines */}
                <path
                  d="M40,90 Q140,40 240,90"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M40,90 H240"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M40,90 Q140,140 240,90"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Flying Request Indicators - Coordinate Based to avoid invalid CSS style props */}
                <motion.circle
                  r="3.5"
                  fill="#ffffff"
                  cx={0}
                  cy={0}
                  animate={{
                    x: [40, 140, 240],
                    y: [90, 52, 90],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.circle
                  r="3.5"
                  fill="#ffffff"
                  cx={0}
                  cy={0}
                  animate={{
                    x: [40, 240],
                    y: [90, 90],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.6,
                  }}
                />
                <motion.circle
                  r="3.5"
                  fill="#ffffff"
                  cx={0}
                  cy={0}
                  animate={{
                    x: [40, 140, 240],
                    y: [90, 128, 90],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.3,
                  }}
                />

                {/* Nodes */}
                {/* Source Client */}
                <circle cx="40" cy="90" r="12" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="40" cy="90" r="5" fill="#ffffff" />

                {/* Edge CDN Nodes */}
                <circle cx="140" cy="40" r="8" fill="#09090b" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <circle cx="140" cy="90" r="8" fill="#09090b" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <circle cx="140" cy="140" r="8" fill="#09090b" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

                {/* Database Source */}
                <circle cx="240" cy="90" r="12" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                <rect x="235" y="85" width="10" height="10" fill="#ffffff" />
              </svg>

              {/* Console logs */}
              <div className="w-full flex flex-col font-mono text-[10px] text-zinc-500 bg-zinc-950 border border-white/5 rounded-sm p-3 gap-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">GET /api/v1/users/active</span>
                  <span className="text-zinc-200">2ms (CACHE HIT)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">POST /api/v1/transactions</span>
                  <span className="text-zinc-500">42ms (CACHE PASS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">GET /api/v1/products</span>
                  <span className="text-zinc-200">1ms (CACHE HIT)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
