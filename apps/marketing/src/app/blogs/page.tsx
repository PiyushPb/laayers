"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = ["All", "Engineering", "Product", "Design", "Company", "Case Studies"];

const articles = [
  {
    slug: "zero-downtime-deployments-at-scale",
    category: "Engineering",
    title: "Zero-downtime deployments at scale: what we learned shipping 10,000 times a day",
    excerpt: "After crossing a billion deploys served, here is what the failure modes look like, what we changed, and why 99.97% uptime requires more than just good infrastructure.",
    author: "Marcus Webb",
    date: "Jun 12, 2026",
    readTime: "8 min read",
    featured: true,
  },
  {
    slug: "secrets-management-best-practices",
    category: "Engineering",
    title: "How we eliminated credential sprawl across 200 microservices",
    excerpt: "A deep dive into the architecture decision that led us to zero-knowledge secrets management and why it matters for enterprise compliance.",
    author: "Priya Nair",
    date: "Jun 9, 2026",
    readTime: "6 min read",
    featured: false,
  },
  {
    slug: "designing-the-laayers-design-system",
    category: "Design",
    title: "Building a monochrome design system for enterprise software",
    excerpt: "Why we stripped color from our UI and what it taught us about hierarchy, contrast, and the limitations of template design.",
    author: "Elena Morozova",
    date: "Jun 5, 2026",
    readTime: "5 min read",
    featured: false,
  },
  {
    slug: "cascade-ai-case-study",
    category: "Case Studies",
    title: "How Cascade AI reduced deployment time by 73% in eight weeks",
    excerpt: "A look inside the infrastructure transformation of a fast-growing AI company that was spending more time managing deployments than building product.",
    author: "Thomas Park",
    date: "May 28, 2026",
    readTime: "10 min read",
    featured: false,
  },
  {
    slug: "observability-not-monitoring",
    category: "Engineering",
    title: "Observability is not monitoring. Here is the difference.",
    excerpt: "Metrics tell you something is wrong. Observability tells you why. The conceptual shift that changes how your team handles incidents.",
    author: "Sam Liu",
    date: "May 22, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "series-b-announcement",
    category: "Company",
    title: "We raised $42M to build infrastructure for the next generation of software teams",
    excerpt: "A letter from our founders on why we built Laayers, what this funding means, and where we are headed.",
    author: "Laayers Team",
    date: "May 15, 2026",
    readTime: "4 min read",
    featured: false,
  },
  {
    slug: "canary-deployments-explained",
    category: "Engineering",
    title: "Canary deployments: a practical guide for production environments",
    excerpt: "Beyond the theory — how we implemented automatic statistical significance testing to make canary analysis trustworthy at scale.",
    author: "Priya Nair",
    date: "May 8, 2026",
    readTime: "9 min read",
    featured: false,
  },
  {
    slug: "rbac-design",
    category: "Product",
    title: "The design decisions behind our permission model",
    excerpt: "Building access control that is powerful enough for enterprise and simple enough for small teams is a hard problem. Here is how we solved it.",
    author: "Elena Morozova",
    date: "May 1, 2026",
    readTime: "6 min read",
    featured: false,
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  const featuredArticle = articles.find((a) => a.featured)!;
  const regularArticles = filtered.filter((a) => !a.featured);

  return (
    <div>
      {/* Blog Hero */}
      <section className="pt-40 pb-20 max-md:pt-32">
        <div className="container flex justify-between items-end mb-16">
          <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.04em] font-bold text-fg">Journal</h1>
        </div>

        {/* Featured Article */}
        <div className="container">
          <div className="grid grid-cols-[3fr_2fr] gap-12 items-center bg-bg-secondary p-4 rounded-[2rem] border border-border transition-colors duration-300 hover:bg-border/50 hover:border-border-strong max-lg:grid-cols-1 max-lg:p-6 max-lg:gap-8">
            <Link href={`/blogs/${featuredArticle.slug}`} className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-bg border border-border" style={{ textDecoration: "none" }}>
              <div style={{
                position: "absolute",
                inset: 0,
                background: "var(--bg-tertiary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {/* Abstract composition placeholder */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "3rem", width: "100%" }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{
                      height: "2px",
                      width: `${30 + i * 12}%`,
                      background: "var(--border-strong)",
                      borderRadius: "1px",
                    }} />
                  ))}
                </div>
              </div>
              <div style={{
                position: "absolute",
                top: "1.5rem",
                left: "1.5rem",
                background: "rgba(10,10,10,0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid var(--border-strong)",
                borderRadius: "2px",
                padding: "0.25rem 0.6rem",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--fg)",
              }}>
                Featured
              </div>
            </Link>

            <div className="pr-8 max-lg:pr-0">
              <div className="flex items-center gap-4 mb-6 font-mono text-sm">
                <span className="px-2 py-1 rounded border border-border-strong text-fg font-medium tracking-[0.05em] uppercase">{featuredArticle.category}</span>
                <span className="text-fg-subtle">{featuredArticle.readTime}</span>
              </div>
              <h2 className="text-4xl font-semibold tracking-[-0.02em] leading-[1.1] mb-6 text-fg">
                <Link href={`/blogs/${featuredArticle.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {featuredArticle.title}
                </Link>
              </h2>
              <p className="text-lg text-fg-muted mb-8 leading-[1.6]">{featuredArticle.excerpt}</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-border" />
                <div>
                  <div className="font-semibold text-fg">{featuredArticle.author}</div>
                  <div className="text-sm text-fg-muted">{featuredArticle.date}</div>
                </div>
              </div>
              <Link
                href={`/blogs/${featuredArticle.slug}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-base transition-all duration-300 bg-bg border border-border text-fg hover:bg-bg-secondary hover:border-border-strong active:scale-[0.98]"
                style={{ marginTop: "2rem", width: "fit-content" }}
              >
                Read article
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ paddingBlock: "3rem", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full border border-border bg-bg text-fg-muted font-medium text-sm transition-all duration-200 whitespace-nowrap hover:bg-bg-secondary hover:text-fg hover:border-border-strong ${activeCategory === cat ? "bg-fg text-bg border-fg" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-[var(--spacing-section-py)]">
        <div className="container">
          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
            {regularArticles.map((article) => (
              <Link key={article.slug} href={`/blogs/${article.slug}`} className="flex flex-col group text-left cursor-pointer" style={{ textDecoration: "none" }}>
                <div className="relative aspect-[3/2] rounded-[1.5rem] overflow-hidden bg-bg-secondary mb-6 border border-border transition-colors duration-300 group-hover:border-border-strong">
                  {/* Abstract image placeholder */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--bg-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "1.5rem",
                  }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} style={{
                          flex: 1,
                          height: `${20 + Math.sin(i) * 30 + 20}px`,
                          background: "var(--border-strong)",
                          borderRadius: "2px",
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-3 font-mono text-sm" style={{ marginBottom: 12 }}>
                    <span className="px-2 py-1 rounded border border-border-strong text-fg font-medium tracking-[0.05em] uppercase">{article.category}</span>
                    <span className="text-fg-subtle">{article.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-0.02em] leading-[1.2] mb-3 text-fg group-hover:text-fg-subtle transition-colors duration-200">{article.title}</h3>
                  <p className="text-base text-fg-muted mb-6 leading-[1.6] flex-1">{article.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-border" />
                    <div>
                      <div className="font-semibold text-fg">{article.author}</div>
                      <div className="text-sm text-fg-muted">{article.date}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ paddingBlock: "6rem", borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
        <div className="container-narrow" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle mb-6">Newsletter</p>
          <h2 className="text-6xl font-bold leading-[1.05] tracking-[-0.025em] text-fg mb-4">
            Stay sharp.
          </h2>
          <p className="text-2xl text-fg-muted mb-12 max-w-[560px] mx-auto leading-[1.4]">
            Engineering insights, product updates, and deep technical writing.
            Once a week, no more.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 0, maxWidth: "400px", margin: "0 auto" }}>
            <input
              type="email"
              placeholder="your@company.com"
              className="bg-bg border border-border px-4 py-3 rounded-l-lg text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-strong"
              style={{ flex: 1 }}
            />
            <button className="bg-fg text-bg px-6 py-3 rounded-r-lg font-medium hover:bg-fg/90 transition-colors">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
