"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

const integrations = [
  { name: "GitHub", category: "Source control" },
  { name: "GitLab", category: "Source control" },
  { name: "Slack", category: "Communication" },
  { name: "PagerDuty", category: "Incident management" },
  { name: "Datadog", category: "Monitoring" },
  { name: "Terraform", category: "IaC" },
  { name: "Stripe", category: "Payments" },
  { name: "Auth0", category: "Identity" },
  { name: "Sentry", category: "Error tracking" },
  { name: "Jira", category: "Project management" },
  { name: "AWS", category: "Cloud" },
  { name: "Cloudflare", category: "Edge" },
];

export function Integrations() {
  return (
    <section className="py-24 lg:py-40" aria-label="Integrations">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              Integrations
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Connects to your
              <br />
              existing stack
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-base leading-relaxed text-neutral-500 lg:text-lg">
              First-class integrations with the tools your team already uses.
              Native webhooks, OAuth, and API-level access for everything else.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {integrations.map((integration, i) => (
            <Reveal key={integration.name} delay={i * 0.04} direction="none">
              <motion.article
                className="group flex flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-white p-6 text-center transition-all duration-300 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-950/5"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <figure className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-lg font-bold text-neutral-400 transition-colors group-hover:bg-neutral-950 group-hover:text-white">
                  {integration.name[0]}
                </figure>
                <div>
                  <p className="text-sm font-medium text-neutral-950">
                    {integration.name}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {integration.category}
                  </p>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}