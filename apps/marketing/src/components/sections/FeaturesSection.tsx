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
  // Use amount (threshold-based) instead of negative percentage margin.
  // Mobile Safari has a bug where negative % rootMargin values in
  // IntersectionObserver are computed against a stale bounding rect,
  // causing the observer to never fire on real iOS devices.
  const isInView = useInView(ref, { amount: 0.4 });

  useEffect(() => {
    if (isInView) {
      setActiveFeature(index);
    }
  }, [isInView, index, setActiveFeature]);

  return (
    <div id={`feature-panel-${index}`} className="feature-panel" ref={ref}>
      <motion.div
        className="feature-panel-content"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-eyebrow feature-label">{f.label}</p>
        <h3
          className="feature-title"
          style={{ whiteSpace: "pre-line" }}
        >
          {f.title}
        </h3>
        <p className="feature-desc">{f.description}</p>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--fg-subtle)",
            borderLeft: "1px solid var(--border-strong)",
            paddingLeft: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {f.detail}
        </p>

        {/* Feature screen mockup */}
        <div className="feature-screen">
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--fg-subtle)",
              fontSize: "var(--text-sm)",
              fontFamily: "var(--font-mono)",
              padding: "2rem",
            }}
          >
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {/* Simulated UI elements */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                {[0,1,2].map(j => (
                  <div key={j} style={{
                    height: "28px",
                    flex: j === 0 ? 2 : 1,
                    background: "var(--border-subtle)",
                    borderRadius: "4px",
                    border: "1px solid var(--border)"
                  }} />
                ))}
              </div>
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} style={{
                  height: "40px",
                  background: j % 2 === 0 ? "var(--bg-tertiary)" : "var(--bg)",
                  borderRadius: "4px",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0 1rem",
                }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: j < 4 ? "var(--fg-subtle)" : "var(--border-strong)" }} />
                  <div style={{ flex: 1, height: "12px", background: "var(--border-subtle)", borderRadius: "2px" }} />
                  <div style={{ width: "60px", height: "12px", background: "var(--border-subtle)", borderRadius: "2px" }} />
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
    <section className="section" id="features">
      <div className="container">
        <p className="text-eyebrow" style={{ marginBottom: "2rem" }}>Features</p>
        <h2 className="text-display-sm" style={{ marginBottom: "5rem", maxWidth: "600px" }}>
          Every tool your team needs. Nothing you don&apos;t.
        </h2>

        <div className="features-sticky-wrap features-grid">
          {/* Sticky nav — align-self: start is critical for sticky to work inside a grid */}
          <div className="features-nav" style={{ position: "sticky", top: "7rem", alignSelf: "start" }}>
            {features.map((f, i) => (
              <div
                key={f.number}
                className={`feature-nav-item ${activeFeature === i ? "active" : ""}`}
                onClick={() => {
                  document.getElementById(`feature-panel-${i}`)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="number">{f.number}</span>
                <span className="title">{f.label}</span>
                <span className="indicator" />
              </div>
            ))}
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
