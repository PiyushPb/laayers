"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, Check, Copy } from "lucide-react";

const steps = [
  {
    id: "install",
    num: "01",
    title: "Pull the package",
    desc: "Install the lightweight client library. Works inside Node, Cloudflare Workers, Bun, Next.js, and Vercel edge runtimes without dependency bloat.",
    code: `// Install via your package manager of choice
npm install @laayers/client

// or pnpm / yarn
pnpm add @laayers/client`,
    lang: "shell",
  },
  {
    id: "init",
    num: "02",
    title: "Bind your token",
    desc: "Instantiate the caching proxy client. Standard zero-overhead authentication makes connection secure, terminating TLS queries directly at POP gateways.",
    code: `import { createClient } from "@laayers/client";

// Initialize with environment keys
const layers = createClient({
  token: process.env.LAAYERS_API_KEY,
  databaseUrl: process.env.DATABASE_URL,
});`,
    lang: "typescript",
  },
  {
    id: "cache",
    num: "03",
    title: "Intercept query read paths",
    desc: "Replace standard database select executions. Laayers automatically intercepts read paths, checks edge POPs, and updates stale caches out-of-band.",
    code: `// Fetch products with 60s TTL and Stale-While-Revalidate
const products = await layers.cache("products:all", {
  ttl: 60,
  swr: 300,
  query: () => db.select().from(productsTable),
});`,
    lang: "typescript",
  },
];

export default function DeveloperExperience() {
  const [activeStep, setActiveStep] = useState("install");
  const [copied, setCopied] = useState(false);

  const activeData = steps.find((s) => s.id === activeStep) || steps[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developer-xp" className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Step descriptions */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
                Developer Experience
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
                Three lines of code
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                No complex cache cluster deployments. Connect your client directly to Laayers and cache database queries globally in minutes.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`text-left p-4 border rounded-sm flex items-start gap-4 transition-all duration-300 focus:outline-none ${
                    activeStep === step.id
                      ? "bg-zinc-950/80 border-white/10"
                      : "bg-transparent border-transparent hover:bg-zinc-950/20"
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-semibold ${
                      activeStep === step.id ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h4
                      className={`font-display text-sm font-bold uppercase tracking-wider mb-1 ${
                        activeStep === step.id ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
                      {step.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Terminal Mockup */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 rounded-sm bg-zinc-950 overflow-hidden shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                    laayers-sdk-playground
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-zinc-500 hover:text-white rounded transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-800"
                  aria-label="Copy code snippet"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Code block area */}
              <div className="p-6 font-mono text-xs md:text-sm text-zinc-400 min-h-[180px] bg-black/40 overflow-x-auto relative">
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={activeStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-pre"
                  >
                    <code>{activeData.code}</code>
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
