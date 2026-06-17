"use client";

import { motion, Variants } from "framer-motion";

const codeLines = [
  { type: "comment", text: "# Deploy to production" },
  { type: "keyword", text: "laayers", after: " deploy" },
  { type: "normal", text: "  --env production" },
  { type: "normal", text: "  --strategy canary" },
  { type: "normal", text: "  --rollout 10,50,100" },
  { type: "normal", text: "  --health-check /api/health" },
  { type: "normal", text: "" },
  { type: "comment", text: "# Output" },
  { type: "string", text: "✓ Build verified (2.1s)" },
  { type: "string", text: "✓ Pre-flight checks passed" },
  { type: "string", text: "✓ Canary at 10% — latency: 89ms" },
  { type: "string", text: "✓ Canary at 50% — error rate: 0.00%" },
  { type: "string", text: "✓ Full rollout complete" },
];

const browserVariants: any = {
  hidden: { opacity: 0, y: 60, scale: 0.97 },
  visible: { 
    opacity: 1, y: 0, scale: 1, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

const codeContainerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const codeLineVariants: any = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, x: 0, 
    transition: { duration: 0.4, ease: "easeOut" } 
  }
};

export default function ShowcaseSection() {
  return (
    <section className="py-[var(--spacing-section-py)] bg-bg-secondary border-y border-border" id="showcase">
      <div className="container">
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-8">Product</p>

        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-20 max-lg:gap-12 items-center mb-20 max-lg:mb-12">
          <div>
            <h2 className="text-6xl font-bold leading-[1.05] tracking-[-0.025em] text-fg mb-6">
              A dashboard for every layer.
            </h2>
            <p className="text-xl font-normal leading-[1.6] text-fg-muted mb-8">
              From your CI pipeline to production traffic — one interface that makes
              the entire lifecycle visible and controllable.
            </p>
            <div className="flex flex-col gap-3">
              {["Real-time deployment tracking", "Service dependency graph", "Environment diff viewer", "Incident timeline"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-fg-muted">
                  <div className="w-1 h-1 rounded-full bg-fg-subtle shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Browser mockup */}
          <motion.div 
            className="border border-border-strong rounded-xl overflow-hidden bg-bg relative max-lg:mx-0 max-lg:rounded-lg"
            variants={browserVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-secondary">
              <div className="flex gap-[6px]">
                <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
              </div>
              <div className="bg-bg-tertiary border border-border rounded px-3 py-1 text-[11px] text-fg-subtle font-mono ml-4">app.laayers.com</div>
            </div>
            <div className="p-6 flex flex-col gap-4 min-h-[320px]">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-3">
                {["Deployments", "Uptime", "Incidents"].map((stat, i) => (
                  <div key={stat} className="bg-bg-secondary border border-border rounded-md p-4">
                    <div className="text-[10px] text-fg-subtle uppercase tracking-[0.1em] mb-2">{stat}</div>
                    <div className="text-2xl font-bold tracking-[-0.03em]">
                      {i === 0 ? "247" : i === 1 ? "99.97%" : "0"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-bg-secondary border border-border rounded-md p-4 flex-1 flex flex-col">
                <div className="text-[10px] text-fg-subtle uppercase tracking-[0.1em] mb-4">
                  Deployment Timeline — Last 30d
                </div>
                <div className="flex items-end gap-1 h-[80px]">
                  {[60, 80, 45, 90, 70, 85, 95, 65, 75, 88, 92, 78, 82, 95, 100].map((h, i) => (
                    <div key={i} className={`flex-1 bg-border-strong rounded-sm ${i === 14 ? 'opacity-100' : 'opacity-40'}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Code section */}
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-20 max-lg:gap-12 items-center">
          <motion.div 
            className="bg-bg border border-border rounded-lg p-6 font-mono text-[13px] leading-[1.8] text-fg-muted overflow-x-auto max-lg:text-[12px]"
            variants={codeContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {codeLines.map((line, i) => (
              <motion.div key={i} variants={codeLineVariants}>
                {line.type === "comment" && (
                  <span className="text-zinc-700">{line.text}</span>
                )}
                {line.type === "keyword" && (
                  <>
                    <span className="text-fg font-medium">{line.text}</span>
                    <span>{line.after}</span>
                  </>
                )}
                {line.type === "normal" && <span>{line.text || "\u00A0"}</span>}
                {line.type === "string" && (
                  <span className="text-zinc-400">{line.text}</span>
                )}
              </motion.div>
            ))}
          </motion.div>

          <div>
            <h2 className="text-4xl font-semibold leading-[1.15] tracking-[-0.02em] text-fg mb-6">
              Built for how engineers actually work.
            </h2>
            <p className="text-base font-normal leading-[1.6] text-fg-muted mb-8">
              A full CLI that mirrors everything in the UI. Scriptable, pipeable, and
              composable. First-class TypeScript SDK included.
            </p>
            <div className="flex flex-col gap-3">
              {["Zero config for common patterns", "Full programmatic control", "Webhooks for every event", "Terraform and Pulumi providers"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-fg-muted">
                  <div className="w-1 h-1 rounded-full bg-fg-subtle shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
