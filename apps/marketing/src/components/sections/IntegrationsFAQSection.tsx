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
      <section className="section" id="integrations">
        <div className="container">
          <p className="text-eyebrow" style={{ marginBottom: "2rem" }}>Integrations</p>
          <h2 className="text-display-sm" style={{ marginBottom: "1rem", maxWidth: "500px" }}>
            Works with your stack.
          </h2>
          <p className="text-subheading" style={{ marginBottom: "4rem" }}>
            Native integrations with 80+ tools. REST API and webhooks for everything else.
          </p>

          <motion.div 
            className="integrations-grid"
            variants={integrationsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {integrations.map((name) => (
              <motion.div key={name} className="integration-item" variants={integrationItemVariants}>
                <div className="integration-icon">
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                    {name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className="integration-name">{name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div className="faq-grid">
            <div>
              <p className="text-eyebrow" style={{ marginBottom: "1.5rem" }}>FAQ</p>
              <h2 className="text-display-sm" style={{ marginBottom: "1.5rem" }}>
                Common questions.
              </h2>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.7 }}>
                Anything else? Email us at{" "}
                <a href="mailto:hello@laayers.com" style={{ color: "var(--fg)", textDecoration: "underline" }}>
                  hello@laayers.com
                </a>
              </p>
            </div>

            <div>
              {faqs.map((faq, i) => (
                <div key={i} className={`faq-item ${openIdx === i ? "open" : ""}`}>
                  <button
                    className="faq-trigger"
                    onClick={() => toggle(i)}
                    aria-expanded={openIdx === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="faq-question">{faq.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <Plus size={12} />
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    className="faq-answer"
                    role="region"
                  >
                    {faq.answer}
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
