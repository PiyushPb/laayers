"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

const rows = [
  { feature: "Zero-downtime deployments", us: true, comp1: true, comp2: false },
  { feature: "Automatic canary analysis", us: true, comp1: false, comp2: false },
  { feature: "Unified observability", us: true, comp1: false, comp2: true },
  { feature: "Environment access control", us: true, comp1: true, comp2: true },
  { feature: "Secrets management", us: true, comp1: true, comp2: false },
  { feature: "SCIM / SSO provisioning", us: true, comp1: false, comp2: false },
  { feature: "SOC 2 Type II certified", us: true, comp1: true, comp2: false },
  { feature: "Preview environments", us: true, comp1: true, comp2: true },
  { feature: "Full audit trail", us: true, comp1: false, comp2: false },
  { feature: "Self-hosted option", us: true, comp1: false, comp2: true },
];

const testimonials = [
  {
    quote:
      "Laayers replaced four tools we were paying for separately. The consolidation alone paid for itself in the first quarter.",
    name: "Marcus Webb",
    role: "VP Engineering",
    company: "Cascade AI",
  },
  {
    quote:
      "Our on-call rotation got three hours of sleep back per week after switching. The correlation engine is genuinely useful.",
    name: "Priya Nair",
    role: "Staff Engineer",
    company: "Meridian Health",
  },
  {
    quote:
      "I was skeptical about another DevOps platform, but the canary analysis has saved us from three bad deploys this month alone.",
    name: "Thomas Park",
    role: "CTO",
    company: "Buildwire",
  },
];

export default function ComparisonSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Comparison Table */}
      <section className="py-[var(--spacing-section-py)]" id="comparison">
        <div className="container">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-8">Comparison</p>
          <h2 className="text-6xl font-bold leading-[1.05] tracking-[-0.025em] text-fg mb-16 max-w-[600px]">
            How we stack up.
          </h2>

          <motion.div 
            className="border border-border rounded-xl overflow-hidden bg-bg"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="font-semibold text-fg px-6 py-5 border-b border-border bg-bg-secondary text-sm" style={{ width: "45%" }}>Feature</th>
                  <th className="font-semibold text-fg px-6 py-5 border-b border-border bg-bg-tertiary text-sm">Laayers</th>
                  <th className="font-semibold text-fg px-6 py-5 border-b border-border bg-bg-secondary text-sm max-lg:hidden">Competitor A</th>
                  <th className="font-semibold text-fg px-6 py-5 border-b border-border bg-bg-secondary text-sm max-lg:hidden">Competitor B</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.feature}>
                    <td className={`px-6 py-4 border-b border-border text-sm font-medium text-fg ${idx === rows.length - 1 ? 'border-b-0' : ''}`}>{row.feature}</td>
                    <td className={`px-6 py-4 border-b border-border text-sm bg-bg-tertiary text-center ${idx === rows.length - 1 ? 'border-b-0' : ''}`}>
                      {row.us ? <Check size={16} className="text-fg mx-auto" /> : <Minus size={16} className="text-fg-subtle opacity-50 mx-auto" />}
                    </td>
                    <td className={`px-6 py-4 border-b border-border text-sm text-center max-lg:hidden ${idx === rows.length - 1 ? 'border-b-0' : ''}`}>
                      {row.comp1 ? <Check size={16} className="text-fg mx-auto" /> : <Minus size={16} className="text-fg-subtle opacity-50 mx-auto" />}
                    </td>
                    <td className={`px-6 py-4 border-b border-border text-sm text-center max-lg:hidden ${idx === rows.length - 1 ? 'border-b-0' : ''}`}>
                      {row.comp2 ? <Check size={16} className="text-fg mx-auto" /> : <Minus size={16} className="text-fg-subtle opacity-50 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-[var(--spacing-section-py)] bg-bg-secondary border-t border-border" id="testimonials">
        <div className="container">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-12">Customer Stories</p>

          <div className="overflow-hidden">
            <motion.div 
              className="flex w-full"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {testimonials.map((t) => (
                <div key={t.name} className="min-w-full flex-shrink-0 flex flex-col justify-between p-12 max-lg:p-6 bg-bg border border-border rounded-2xl">
                  <div>
                    <p className="text-3xl font-medium leading-[1.35] tracking-[-0.02em] text-fg mb-12 max-lg:text-2xl">{t.quote}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="w-12 h-12 rounded-full bg-border" />
                    <span className="font-semibold text-fg">{t.name}</span>
                    <span className="text-fg-muted">{t.role}</span>
                    <span className="text-fg-subtle">{t.company}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex gap-2 mt-8 justify-center">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex ? "bg-fg w-6" : "bg-border-strong w-2 hover:bg-fg"}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
