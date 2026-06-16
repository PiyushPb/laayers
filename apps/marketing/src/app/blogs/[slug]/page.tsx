"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const tocItems = [
  { id: "intro", label: "Introduction" },
  { id: "architecture", label: "The architecture problem" },
  { id: "solution", label: "Our solution" },
  { id: "implementation", label: "Implementation details" },
  { id: "results", label: "Results" },
  { id: "conclusion", label: "Conclusion" },
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const article = document.getElementById("article-body");
      if (!article || !progressRef.current) return;
      const rect = article.getBoundingClientRect();
      const total = article.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, (scrolled / total) * 100);
      progressRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="reading-progress" ref={progressRef} />

      {/* Article hero */}
      <section className="blog-post-hero">
        <div className="container">
          <Link
            href="/blogs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "var(--text-sm)",
              color: "var(--fg-subtle)",
              textDecoration: "none",
              marginBottom: "3rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-subtle)")}
          >
            <ArrowLeft size={14} />
            Back to Journal
          </Link>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "center" }}>
            <span className="blog-category-tag">Engineering</span>
            <span className="blog-read-time">8 min read</span>
            <span className="blog-read-time">Jun 12, 2026</span>
          </div>

          <h1
            style={{
              fontSize: "var(--text-7xl)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1,
              maxWidth: "820px",
              marginBottom: "2rem",
            }}
          >
            Zero-downtime deployments at scale: what we learned shipping 10,000 times a day
          </h1>

          <div className="blog-author">
            <div className="blog-author-avatar" />
            <div>
              <div className="blog-author-name">Marcus Webb</div>
              <div className="blog-author-date">VP Engineering, Laayers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <div className="container blog-post-layout" id="article-body">
        {/* Table of Contents */}
        <aside className="blog-toc">
          <h4>Contents</h4>
          <ol>
            {tocItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </aside>

        {/* Article content */}
        <article className="blog-content">
          <h2 id="intro">Introduction</h2>
          <p>
            When we crossed the threshold of 10,000 deployments per day across our customer base,
            we realized our mental model of what &quot;zero-downtime&quot; meant was fundamentally incomplete.
            The naive definition — no HTTP 5xx errors during a deploy — was easy to achieve.
            The real definition — no observable degradation in latency, error rate, or throughput
            for any user, during any phase of a deployment — was a different problem entirely.
          </p>
          <p>
            This post documents the failure modes we discovered after crossing that threshold,
            the architectural changes we made, and the monitoring infrastructure we built
            to give us confidence that what we ship is what we intended.
          </p>

          <div className="blog-pull-quote">
            The naive definition of zero-downtime is easy. The real definition requires you to think
            about every failure mode your infrastructure team has never had to encounter before.
          </div>

          <h2 id="architecture">The architecture problem</h2>
          <p>
            At 10,000 deploys per day, you encounter failure modes that are statistically
            invisible at lower volumes. A 0.01% failure rate is noise at 100 deploys per day.
            At 10,000, it is 1 guaranteed bad deployment per day. At 100,000, it is 10.
          </p>
          <p>
            The specific failure modes we catalogued in our incident post-mortems across
            2025 fell into three categories:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              "Connection draining failures during rolling restarts",
              "Cache invalidation races between old and new replica sets",
              "Database migration lock contention during high-traffic windows",
            ].map((item) => (
              <li key={item} style={{ fontSize: "var(--text-lg)", color: "var(--fg-muted)", lineHeight: 1.7 }}>
                {item}
              </li>
            ))}
          </ul>

          <h2 id="solution">Our solution</h2>
          <p>
            We built a deployment sequencer that treats each of these failure modes as a first-class
            concern. Instead of a simple rolling restart, every deployment goes through a five-phase
            protocol that we call DRAIN-STAGE-CANARY-VALIDATE-PROMOTE.
          </p>

          <pre><code>{`// Deployment configuration
export const deploymentConfig = {
  strategy: "canary",
  phases: [
    { name: "drain",    duration: "30s",  traffic: 0    },
    { name: "stage",    duration: "60s",  traffic: 0    },
    { name: "canary",   duration: "5m",   traffic: 10   },
    { name: "validate", duration: "2m",   traffic: 10   },
    { name: "promote",  duration: "auto", traffic: 100  },
  ],
  rollback: {
    trigger: "error_rate > 0.1% || p99_latency > 500ms",
    automatic: true,
  }
};`}</code></pre>

          <h2 id="implementation">Implementation details</h2>
          <p>
            The DRAIN phase is the most critical and the most commonly skipped in naive implementations.
            Before we bring up a single new replica, we send a SIGTERM to the load balancer to stop
            routing new connections to any instance that will be replaced. We then wait for the
            connection count to reach zero before proceeding.
          </p>
          <p>
            The canary phase uses our internal statistical significance engine, which continuously
            monitors 23 metrics across the canary cohort versus the stable cohort. We use a
            sequential probability ratio test (SPRT) that allows us to declare the deployment safe
            or unsafe without waiting for a fixed sample size.
          </p>

          <h2 id="results">Results</h2>
          <p>
            After deploying this architecture across our entire platform and exposing it to customers
            in our Enterprise tier in Q1 2026, we saw the following results:
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            overflow: "hidden",
            marginBlock: "2rem",
          }}>
            {[
              { metric: "User-visible errors during deploys", before: "0.023%", after: "0.0003%" },
              { metric: "Average deploy duration", before: "4.2 min", after: "2.8 min" },
              { metric: "Automatic rollbacks", before: "12/day", after: "2/day" },
            ].map((row) => (
              <div key={row.metric} style={{ background: "var(--bg)", padding: "1.5rem" }}>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                  {row.metric}
                </p>
                <p style={{ fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: "0.25rem" }}>{row.after}</p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--fg-subtle)" }}>was {row.before}</p>
              </div>
            ))}
          </div>

          <h2 id="conclusion">Conclusion</h2>
          <p>
            Zero-downtime deployments at scale are not an infrastructure problem — they are a
            systems thinking problem. The tooling is secondary. The first requirement is an accurate
            mental model of every failure mode your system can exhibit during a deploy.
          </p>
          <p>
            We are continuing to improve the statistical engine behind our canary analysis
            and plan to open-source the SPRT implementation in Q3 2026.
          </p>
        </article>
      </div>

      {/* Article navigation */}
      <section style={{ paddingBlock: "4rem", borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: "2rem" }}>
          <Link
            href="/blogs/series-b-announcement"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              textDecoration: "none",
              maxWidth: "360px",
            }}
          >
            <span style={{ fontSize: "var(--text-xs)", color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ArrowLeft size={12} /> Previous
            </span>
            <span style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--fg)" }}>
              We raised $42M to build infrastructure for the next generation of software teams
            </span>
          </Link>
          <Link
            href="/blogs/secrets-management-best-practices"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              textDecoration: "none",
              textAlign: "right",
              maxWidth: "360px",
            }}
          >
            <span style={{ fontSize: "var(--text-xs)", color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "flex-end" }}>
              Next <ArrowRight size={12} />
            </span>
            <span style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--fg)" }}>
              How we eliminated credential sprawl across 200 microservices
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
