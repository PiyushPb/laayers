"use client";

import { Reveal } from "@/components/ui/reveal";

const securityFeatures = [
  {
    title: "Encryption at rest",
    description: "AES-256-GCM encryption for all stored data. Keys rotated automatically.",
  },
  {
    title: "Encryption in transit",
    description: "TLS 1.3 enforced on all connections. Automatic certificate provisioning.",
  },
  {
    title: "Network isolation",
    description: "Private networking between services. VPC peering. IP allowlisting.",
  },
  {
    title: "Secrets management",
    description: "Encrypted environment variables. Secret versioning and rotation.",
  },
  {
    title: "DDoS protection",
    description: "Layer 3/4/7 protection. Rate limiting. Bot detection. WAF rules.",
  },
  {
    title: "Vulnerability scanning",
    description: "Continuous scanning of dependencies. Automated patching for critical CVEs.",
  },
];

export function Security() {
  return (
    <section className="bg-neutral-950 py-24 lg:py-40" aria-label="Security">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="mb-4 text-sm font-medium tracking-widest text-neutral-500 uppercase">
                Security
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Security is not
                <br />a feature toggle
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="max-w-md text-base leading-relaxed text-neutral-400">
                Every layer of the Arc platform is hardened by default.
                Enterprise security without enterprise complexity.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-3">
                {["SOC 2", "GDPR", "HIPAA", "ISO 27001", "PCI DSS"].map(
                  (cert) => (
                    <span
                      key={cert}
                      className="rounded-full border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-400"
                    >
                      {cert}
                    </span>
                  )
                )}
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {securityFeatures.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.08} direction="up">
                <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-neutral-700">
                  <h3 className="mb-2 text-sm font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-500">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}