"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

const faqs = [
  {
    question: "How does Arc compare to deploying on AWS or GCP directly?",
    answer:
      "Arc abstracts the complexity of major cloud providers while running on their infrastructure. You get the reliability of AWS/GCP without managing VPCs, load balancers, auto-scaling groups, or IAM policies. Teams typically reduce their infrastructure code by 60-80%.",
  },
  {
    question: "Can I migrate my existing application?",
    answer:
      "Yes. Arc supports any framework that runs on Node.js, Python, Go, or Rust. Most applications require zero code changes. Our migration tooling handles database imports, DNS cutover, and traffic shifting with zero downtime.",
  },
  {
    question: "What does pricing look like?",
    answer:
      "Arc uses usage-based pricing with no minimum commitments. You pay for compute time, bandwidth, and storage. Most teams see 30-50% cost reduction compared to their existing cloud bills due to efficient resource utilization and auto-scaling to zero.",
  },
  {
    question: "Is there vendor lock-in?",
    answer:
      "No. Arc uses open standards (OCI containers, Postgres, S3-compatible storage). Your application code requires no Arc-specific changes. You can export your data and migrate away at any time. Our SDK is MIT licensed.",
  },
  {
    question: "What about data sovereignty and compliance?",
    answer:
      "Arc offers data residency controls for EU, US, and APAC regions. We maintain SOC 2 Type II, HIPAA, GDPR, and ISO 27001 compliance. BAAs are available for healthcare workloads. Audit logs capture every action.",
  },
  {
    question: "How does support work?",
    answer:
      "Free tier includes community support. Pro includes email support with 4-hour SLA. Enterprise includes a dedicated account engineer, shared Slack channel, 15-minute response time, and quarterly architecture reviews.",
  },
];

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="border-b border-neutral-200">
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-6 text-left"
        aria-expanded={isOpen}
      >
        <h3 className="text-base font-medium text-neutral-950 lg:text-lg">
          {faq.question}
        </h3>
        <motion.span
          className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 1V13M1 7H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm leading-relaxed text-neutral-500 lg:text-base lg:leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-neutral-50 py-24 lg:py-40" aria-label="FAQ" id="pricing">
      <div className="mx-auto max-w-3xl px-5">
        <div className="mb-16 text-center">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              FAQ
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Common questions
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="border-t border-neutral-200">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}