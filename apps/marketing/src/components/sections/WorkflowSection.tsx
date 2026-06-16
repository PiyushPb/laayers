"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Connect your repo",
    description: "Link any GitHub, GitLab, or Bitbucket repository in under 60 seconds. No YAML required to get started.",
  },
  {
    number: "02",
    title: "Define your environments",
    description: "Set up staging, preview, and production with environment-specific variables, access rules, and health checks.",
  },
  {
    number: "03",
    title: "Configure your pipeline",
    description: "Use our defaults or bring your own. Zero-downtime deployments with automatic canary analysis are on by default.",
  },
  {
    number: "04",
    title: "Invite your team",
    description: "Role-based access, SSO, and SCIM provisioning. Everyone gets exactly the permissions they need — nothing more.",
  },
  {
    number: "05",
    title: "Ship with confidence",
    description: "Every deploy is observable, rollbackable, and auditable. Production is no longer a place of fear.",
  },
];

export default function WorkflowSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Defer to avoid React StrictMode double-invoke removeChild race
    const tid = setTimeout(() => {
      const isMobile = window.innerWidth < 768;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      ctxRef.current = gsap.context(() => {
        if (isMobile) {
          // Vertical layout on mobile — simple fade in
          gsap.utils.toArray<Element>(".h-scroll-card").forEach((card, i) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: i * 0.05,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                },
              }
            );
          });
          return;
        }

        // Desktop: horizontal scroll with pin
        const totalWidth = track.scrollWidth - window.innerWidth + 200;

        const mainTween = gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        gsap.utils.toArray<Element>(".h-scroll-card").forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0.4, scale: 0.97 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              scrollTrigger: {
                trigger: card,
                containerAnimation: mainTween,
                start: "left 70%",
              },
            }
          );
        });
      }, section);
    }, 100);

    return () => {
      clearTimeout(tid);
      // Kill all ScrollTriggers created by this context before reverting
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, []);

  return (
    <section ref={sectionRef} className="h-scroll-section" id="workflow">
      <div style={{ padding: "var(--section-py) var(--gutter) 3rem" }}>
        <p className="text-eyebrow" style={{ marginBottom: "1.5rem" }}>Workflow</p>
        <h2 className="text-display-sm" style={{ maxWidth: "600px" }}>
          From zero to production in five steps.
        </h2>
      </div>

      <div
        ref={trackRef}
        className="h-scroll-track"
        style={{ paddingInline: "var(--gutter)", paddingBottom: "var(--section-py)" }}
      >
        {steps.map((step, i) => (
          <React.Fragment key={step.number}>
            <div className="h-scroll-card">
              <p className="step-number">{step.number}</p>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="connector-line" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
