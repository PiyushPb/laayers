"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Plus } from "lucide-react";

const integrations = [
  "GitHub", "GitLab", "Bitbucket", "AWS", "GCP", "Azure",
  "Datadog", "PagerDuty", "Slack", "Linear", "Jira", "Terraform",
  "Pulumi", "Kubernetes", "Prometheus", "Grafana", "Vault", "1Password",
];

const faqs = [
  {
    question: "How long does onboarding take?",
    answer: "Most teams are deploying within 2 hours of signing up. Our onboarding concierge handles the initial connection of your repositories and environments, and our defaults are sensible enough to go live without any configuration.",
  },
  {
    question: "Can I use Laayers with my existing CI/CD setup?",
    answer: "Yes. Laayers integrates with GitHub Actions, GitLab CI, CircleCI, Buildkite, and any custom runner via webhooks. You can adopt us incrementally — starting with just observability, and adding deployments and access control when ready.",
  },
  {
    question: "What does self-hosted mean?",
    answer: "On our Enterprise plan, you can deploy the Laayers control plane inside your own VPC or on-premise. You get full data residency, network isolation, and can bring your own encryption keys via AWS KMS, GCP KMS, or HashiCorp Vault.",
  },
  {
    question: "How does pricing work?",
    answer: "We charge per seat, not per deployment or per resource. There are no surprise overage fees. Enterprise pricing is custom and includes dedicated support, SLA guarantees, and volume discounts.",
  },
  {
    question: "Is there a free tier?",
    answer: "Yes. Individual developers and small teams (up to 3 users) can use Laayers for free, with generous limits. No credit card required. The free tier includes our core deployment and observability features.",
  },
  {
    question: "What compliance certifications do you have?",
    answer: "SOC 2 Type II (audited annually), GDPR compliant, and HIPAA-eligible on Enterprise. ISO 27001 certification is in progress. Full report is available under NDA for enterprise prospects during security review.",
  },
];

const integrationsContainerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 }
  }
};

const integrationItemVariants: any = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, scale: 1, 
    transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } 
  }
};

export default function IntegrationsFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? null : i);
  };

  return (
    <div>
      {/* Integrations */}
      <section className="py-[var(--spacing-section-py)]" id="integrations">
        <div className="container">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-8">Integrations</p>
          <h2 className="text-6xl font-bold leading-[1.05] tracking-[-0.025em] text-fg mb-4 max-w-[500px]">
            Works with your stack.
          </h2>
          <p className="text-2xl text-fg-muted mb-16 max-w-[560px] leading-[1.4]">
            Native integrations with 80+ tools. REST API and webhooks for everything else.
          </p>

          <motion.div 
            className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 max-md:grid-cols-2"
            variants={integrationsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {integrations.map((name) => (
              <motion.div key={name} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-bg-secondary transition-colors duration-200 hover:bg-border" variants={integrationItemVariants}>
                <div className="w-8 h-8 rounded flex items-center justify-center bg-bg border border-border">
                  <span className="text-xs font-bold text-fg-muted font-mono uppercase">
                    {name.slice(0, 2)}
                  </span>
                </div>
                <span className="text-sm font-medium text-fg">{name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-[var(--spacing-section-py)] border-t border-border" id="faq">
        <div className="container">
          <div className="grid grid-cols-[1fr_2fr] gap-16 items-start max-lg:grid-cols-1">
            <div>
              <p className="text-xs font-medium tracking-[0.15em] uppercase text-fg-subtle border-l-2 border-border-strong pl-3 mb-6">FAQ</p>
              <h2 className="text-6xl font-bold leading-[1.05] tracking-[-0.025em] text-fg mb-6">
                Common questions.
              </h2>
              <p className="text-sm text-fg-muted leading-[1.7]">
                Anything else? Email us at{" "}
                <a href="mailto:hello@laayers.com" className="text-fg underline">
                  hello@laayers.com
                </a>
              </p>
            </div>

            <div>
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border group">
                  <button
                    className="w-full flex items-center justify-between py-6 bg-transparent border-none text-left cursor-pointer"
                    onClick={() => toggle(i)}
                    aria-expanded={openIdx === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="text-lg font-medium text-fg transition-colors duration-200 group-hover:text-fg-subtle">{faq.question}</span>
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full border border-border text-fg transition-transform duration-300 ${openIdx === i ? "rotate-45 bg-fg text-bg border-fg" : ""}`} aria-hidden="true">
                      <Plus size={12} />
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    className={`grid transition-all duration-300 ${openIdx === i ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}
                    role="region"
                  >
                    <div className="overflow-hidden text-base text-fg-muted leading-[1.6]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
