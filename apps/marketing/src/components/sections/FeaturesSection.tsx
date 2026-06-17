"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, Variants } from "framer-motion";

const containerVariants: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    number: "01",
    label: "Deployments",
    title: "One pipeline.\nEvery environment.",
    description:
      "Atomic deployments with automatic rollbacks, canary releases, and zero-downtime blue-green switching. Your CI/CD pipeline should not be a source of anxiety.",
    detail: "Supports GitHub Actions, GitLab CI, CircleCI, Buildkite, and any custom runner.",
  },
  {
    number: "02",
    label: "Observability",
    title: "See everything.\nAct on what matters.",
    description:
      "Unified logs, metrics, and traces across all services and environments. Correlation is automatic. Root cause is obvious.",
    detail: "P99 latency to error rate to downstream dependency — all in one view.",
  },
  {
    number: "03",
    label: "Access Control",
    title: "Least privilege.\nZero friction.",
    description:
      "Role-based access with environment-level granularity. Time-bound permissions. Full audit trail. SOC 2 ready out of the box.",
    detail: "SAML SSO, SCIM provisioning, and hardware key support included.",
  },
  {
    number: "04",
    label: "Secrets Management",
    title: "Credentials.\nNot credentials anxiety.",
    description:
      "Encrypted at rest and in transit. Versioned. Rotated automatically. Never exposed in logs or environment dumps.",
    detail: "Native integration with AWS KMS, GCP KMS, HashiCorp Vault, and 1Password Teams.",
  },
];

function FeaturePanel({ f, index, setActiveFeature }: { f: any, index: number, setActiveFeature: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.4 });

  useEffect(() => {
    if (isInView) {
      setActiveFeature(index);
    }
  }, [isInView, index, setActiveFeature]);

  return (
    <div id={`feature-panel-${index}`} className="pb-40" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-6">{f.label}</p>
        <h3
          className="text-5xl font-bold tracking-[-0.03em] leading-[1.05] mb-6 whitespace-pre-line"
        >
          {f.title}
        </h3>
        <p className="text-lg text-fg-muted leading-[1.7] max-w-[480px] mb-8">{f.description}</p>
        <p className="text-sm text-fg-subtle border-l border-border-strong pl-4 mb-10">
          {f.detail}
        </p>

        {/* Feature screen mockup */}
        <div className="border border-border-strong rounded-xl overflow-hidden bg-bg-secondary aspect-[16/10] flex flex-col">
          <div className="flex-1 flex items-center justify-center text-fg-subtle text-sm font-mono p-8">
            <div className="w-full flex flex-col gap-2">
              {/* Simulated UI elements */}
              <div className="flex gap-2 mb-4">
                {[0,1,2].map(j => (
                  <div key={j} className={`h-7 bg-border-subtle rounded border border-border ${j === 0 ? "flex-[2]" : "flex-1"}`} />
                ))}
              </div>
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className={`h-10 rounded border border-border-subtle flex items-center gap-4 px-4 ${j % 2 === 0 ? "bg-bg-tertiary" : "bg-bg"}`}>
                  <div className={`w-2 h-2 rounded-full ${j < 4 ? "bg-fg-subtle" : "bg-border-strong"}`} />
                  <div className="flex-1 h-3 bg-border-subtle rounded-sm" />
                  <div className="w-[60px] h-3 bg-border-subtle rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-[var(--spacing-section-py)]" id="features">
      <div className="container">
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-8">Features</p>
        <h2 className="text-6xl font-bold leading-[1.05] tracking-[-0.025em] text-fg mb-20 max-w-[600px]">
          Every tool your team needs. Nothing you don&apos;t.
        </h2>

        <div className="relative grid grid-cols-[300px_1fr] max-lg:grid-cols-1 gap-16 items-start">
          {/* Sticky nav — align-self: start is critical for sticky to work inside a grid */}
          <div className="flex flex-col gap-2 pr-16 sticky top-28 self-start max-lg:static max-lg:pr-0 max-lg:flex-row max-lg:overflow-x-auto max-lg:mb-12 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden">
            {features.map((f, i) => {
              const isActive = activeFeature === i;
              return (
                <div
                  key={f.number}
                  className={`group flex items-center gap-4 py-4 border-t border-border cursor-pointer transition-all duration-300 max-lg:shrink-0`}
                  onClick={() => {
                    document.getElementById(`feature-panel-${i}`)?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span className="text-xs text-fg-subtle font-mono min-w-[2ch]">{f.number}</span>
                  <span className={`text-sm transition-colors duration-200 group-hover:text-fg ${isActive ? "text-fg" : "text-fg-muted"}`}>{f.label}</span>
                  <span className={`h-px bg-fg ml-auto transition-all duration-500 ease-out-expo ${isActive ? "w-8" : "w-0"}`} />
                </div>
              );
            })}
          </div>

          {/* Feature panels */}
          <div>
            {features.map((f, i) => (
              <FeaturePanel key={f.number} f={f} index={i} setActiveFeature={setActiveFeature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
