"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".showcase-browser",
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".showcase-browser",
            start: "top 75%",
          },
        }
      );

      gsap.utils.toArray<Element>(".code-line").forEach((line, i) => {
        gsap.fromTo(
          line,
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            delay: i * 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".code-snippet",
              start: "top 70%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section showcase-section" ref={sectionRef} id="showcase">
      <div className="container">
        <p className="text-eyebrow" style={{ marginBottom: "2rem" }}>Product</p>

        <div className="showcase-grid showcase-grid--top">
          <div>
            <h2 className="text-display-sm" style={{ marginBottom: "1.5rem" }}>
              A dashboard for every layer.
            </h2>
            <p className="text-subheading" style={{ marginBottom: "2rem" }}>
              From your CI pipeline to production traffic — one interface that makes
              the entire lifecycle visible and controllable.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Real-time deployment tracking", "Service dependency graph", "Environment diff viewer", "Incident timeline"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "var(--text-sm)", color: "var(--fg-muted)" }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--fg-subtle)", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Browser mockup */}
          <div className="showcase-browser">
            <div className="browser-bar">
              <div className="browser-dots">
                <div className="browser-dot" />
                <div className="browser-dot" />
                <div className="browser-dot" />
              </div>
              <div className="browser-tab">app.laayers.com</div>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", minHeight: "320px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "0.75rem" }}>
                {["Deployments", "Uptime", "Incidents"].map((stat, i) => (
                  <div key={stat} style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "1rem",
                  }}>
                    <div style={{ fontSize: "10px", color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{stat}</div>
                    <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.03em" }}>
                      {i === 0 ? "247" : i === 1 ? "99.97%" : "0"}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "1rem",
                flex: 1,
              }}>
                <div style={{ fontSize: "10px", color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                  Deployment Timeline — Last 30d
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
                  {[60, 80, 45, 90, 70, 85, 95, 65, 75, 88, 92, 78, 82, 95, 100].map((h, i) => (
                    <div key={i} style={{
                      flex: 1,
                      height: `${h}%`,
                      background: "var(--border-strong)",
                      borderRadius: "2px",
                      opacity: i === 14 ? 1 : 0.4,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code section */}
        <div className="showcase-grid showcase-grid--bottom">
          <div className="code-snippet">
            {codeLines.map((line, i) => (
              <div key={i} className="code-line">
                {line.type === "comment" && (
                  <span className="comment">{line.text}</span>
                )}
                {line.type === "keyword" && (
                  <>
                    <span className="keyword">{line.text}</span>
                    <span>{line.after}</span>
                  </>
                )}
                {line.type === "normal" && <span>{line.text || "\u00A0"}</span>}
                {line.type === "string" && (
                  <span className="string">{line.text}</span>
                )}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-headline" style={{ marginBottom: "1.5rem" }}>
              Built for how engineers actually work.
            </h2>
            <p className="text-subheading" style={{ fontSize: "var(--text-base)", marginBottom: "2rem" }}>
              A full CLI that mirrors everything in the UI. Scriptable, pipeable, and
              composable. First-class TypeScript SDK included.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Zero config for common patterns", "Full programmatic control", "Webhooks for every event", "Terraform and Pulumi providers"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "var(--text-sm)", color: "var(--fg-muted)" }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--fg-subtle)", flexShrink: 0 }} />
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
