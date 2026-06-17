"use client";

import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";

const features = [
  {
    title: "SOC 2 Type II",
    description: "Audited annually. Compliance reports available on request.",
  },
  {
    title: "HIPAA ready",
    description: "BAA available. PHI handling meets all regulatory requirements.",
  },
  {
    title: "SSO / SAML",
    description: "Enterprise identity providers. Okta, Azure AD, Google Workspace.",
  },
  {
    title: "Audit logs",
    description: "Immutable, exportable audit trail for every action and API call.",
  },
  {
    title: "Role-based access",
    description: "Granular permissions. Custom roles. Team-level isolation.",
  },
  {
    title: "99.99% SLA",
    description: "Backed by financial credits. Transparent status reporting.",
  },
  {
    title: "Dedicated support",
    description: "Named account engineer. 15-minute response time. Shared Slack.",
  },
  {
    title: "Data residency",
    description: "Choose where your data lives. EU, US, APAC region options.",
  },
];

export function EnterpriseInfrastructure() {
  return (
    <section
      className="border-t border-neutral-100 py-24 lg:py-40"
      aria-label="Enterprise"
      id="enterprise"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              Enterprise
            </p>
          </Reveal>

          <TextReveal
            text="Built for the most demanding organizations"
            as="h2"
            className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          />

          <Reveal delay={0.3}>
            <p className="text-base leading-relaxed text-neutral-500 lg:text-lg">
              Security, compliance, and reliability that meets the bar set by
              the world&apos;s most regulated industries.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.05} direction="none">
              <article className="flex h-full flex-col bg-white p-6 transition-colors hover:bg-neutral-50 lg:p-8">
                <h3 className="mb-2 text-base font-semibold tracking-tight text-neutral-950">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}