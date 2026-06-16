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
      <section className="blog-hero">
        <div className="container blog-hero-header">
          <h1 className="blog-hero-title">Journal</h1>
        </div>

        {/* Featured Article */}
        <div className="blog-hero-featured">
          <Link href={`/blogs/${featuredArticle.slug}`} className="blog-hero-image" style={{ textDecoration: "none" }}>
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

          <div className="blog-hero-content">
            <div className="blog-hero-meta">
              <span className="blog-category-tag">{featuredArticle.category}</span>
              <span className="blog-read-time">{featuredArticle.readTime}</span>
            </div>
            <h2 className="blog-hero-article-title">
              <Link href={`/blogs/${featuredArticle.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                {featuredArticle.title}
              </Link>
            </h2>
            <p className="blog-excerpt">{featuredArticle.excerpt}</p>
            <div className="blog-author">
              <div className="blog-author-avatar" />
              <div>
                <div className="blog-author-name">{featuredArticle.author}</div>
                <div className="blog-author-date">{featuredArticle.date}</div>
              </div>
            </div>
            <Link
              href={`/blogs/${featuredArticle.slug}`}
              className="btn btn-secondary"
              style={{ marginTop: "2rem", width: "fit-content" }}
            >
              Read article
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ paddingBlock: "3rem", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="category-nav">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {regularArticles.map((article) => (
              <Link key={article.slug} href={`/blogs/${article.slug}`} className="blog-card">
                <div className="blog-card-image">
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
                <div className="blog-card-body">
                  <div className="blog-hero-meta" style={{ marginBottom: 0 }}>
                    <span className="blog-category-tag">{article.category}</span>
                    <span className="blog-read-time">{article.readTime}</span>
                  </div>
                  <h3 className="blog-card-title">{article.title}</h3>
                  <p className="blog-card-excerpt">{article.excerpt}</p>
                  <div className="blog-author">
                    <div className="blog-author-avatar" />
                    <div>
                      <div className="blog-author-name">{article.author}</div>
                      <div className="blog-author-date">{article.date}</div>
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
        <div className="container-narrow" style={{ textAlign: "center" }}>
          <p className="text-eyebrow" style={{ marginBottom: "1.5rem" }}>Newsletter</p>
          <h2 className="text-display-sm" style={{ marginBottom: "1rem" }}>
            Stay sharp.
          </h2>
          <p className="text-subheading" style={{ marginBottom: "3rem" }}>
            Engineering insights, product updates, and deep technical writing.
            Once a week, no more.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 0, maxWidth: "400px", margin: "0 auto" }}>
            <input
              type="email"
              placeholder="your@company.com"
              className="footer-input"
              style={{ flex: 1 }}
            />
            <button className="footer-input-btn">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
