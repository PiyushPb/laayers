"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    number: "01",
    title: "Tooling sprawl kills velocity.",
    body: "Most teams juggle 12+ disconnected tools for deployments, secrets, monitoring, and access. Every handoff is a context switch. Every incident is a war room.",
    detail: "The average engineering org loses 30% of productive time to tool integration and configuration maintenance.",
  },
  {
    number: "02",
    title: "Scaling breaks what worked at 10.",
    body: "What works at 10 engineers becomes a liability at 100. Permissions drift. Environments diverge. Runbooks become stale. On-call becomes a nightmare.",
    detail: "Infrastructure complexity grows non-linearly with team size — and most platforms are not built for this reality.",
  },
  {
    number: "03",
    title: "Compliance slows everything down.",
    body: "Security reviews, SOC 2 requirements, and audit trails were bolted on as afterthoughts. Compliance becomes a blocker instead of a foundation.",
    detail: "Laayers is architected for compliance from day one — not as a feature gate, but as the default.",
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<Element>(".problem-item").forEach((item) => {
        const number = item.querySelector(".number");
        const title = item.querySelector(".problem-title");
        const body = item.querySelector(".problem-body");
        const detail = item.querySelector(".problem-detail");

        gsap.fromTo(
          [number, title, body, detail],
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: item,
              start: "top 70%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section problem-section" ref={sectionRef} id="problem">
      <div className="container">
        <div className="reveal" style={{ marginBottom: "2rem" }}>
          <p className="text-eyebrow">The Problem</p>
        </div>
        <h2 className="text-display-sm" style={{ marginBottom: "5rem", maxWidth: "700px" }}>
          Modern infrastructure is broken.
        </h2>

        {problems.map((p, i) => (
          <div
            key={p.number}
            className={`problem-item ${i % 2 === 1 ? "reverse" : ""}`}
          >
            <div>
              <p className="number">{p.number}</p>
            </div>
            <div>
              <h3
                className="problem-title"
                style={{
                  fontSize: "var(--text-4xl)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  marginBottom: "1.25rem",
                }}
              >
                {p.title}
              </h3>
              <p
                className="problem-body"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--fg-muted)",
                  lineHeight: 1.7,
                  marginBottom: "1rem",
                  maxWidth: "540px",
                }}
              >
                {p.body}
              </p>
              <p
                className="problem-detail"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--fg-subtle)",
                  lineHeight: 1.7,
                  maxWidth: "480px",
                  borderLeft: "1px solid var(--border-strong)",
                  paddingLeft: "1rem",
                }}
              >
                {p.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
