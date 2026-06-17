"use client";

import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { Parallax } from "@/components/ui/parallax";

const dxFeatures = [
  {
    title: "TypeScript native",
    description:
      "Full type safety across your entire stack. Autocomplete for configs, API responses, and database queries.",
  },
  {
    title: "Local development",
    description:
      "arc dev mirrors production exactly. Hot reload, local databases, and edge function emulation.",
  },
  {
    title: "CLI-first",
    description:
      "Every operation available through the CLI. Script anything, automate everything.",
  },
  {
    title: "Git integration",
    description:
      "Preview deployments for every PR. Branch-level databases. Environment-aware configuration.",
  },
  {
    title: "IDE extensions",
    description:
      "First-class VS Code and JetBrains extensions with inline diagnostics and one-click deploys.",
  },
  {
    title: "Open source",
    description:
      "Core SDK is MIT licensed. Community-driven development with public roadmap and RFC process.",
  },
];

export function DeveloperExperience() {
  return (
    <section
      className="border-t border-neutral-100 py-24 lg:py-40"
      aria-label="Developer experience"
      id="developers"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
                Developer experience
              </p>
            </Reveal>

            <TextReveal
              text="Built for developers who care about their craft"
              as="h2"
              className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
            />

            <Reveal delay={0.3}>
              <p className="text-base leading-relaxed text-neutral-500">
                We obsess over the details so you can focus on what matters.
                Every API, every CLI command, every error message — designed to
                respect your time and intelligence.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <figure className="mt-10 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-neutral-700">
                  <code>
                    {`$ arc init my-app
$ arc dev

  ✓ Database provisioned (local)
  ✓ Edge functions ready
  ✓ Hot reload enabled

  → http://localhost:3000
  → Dashboard: localhost:3001`}
                  </code>
                </pre>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Parallax speed={0.15}>
              <div className="grid gap-4 sm:grid-cols-2">
                {dxFeatures.map((feature, i) => (
                  <Reveal key={feature.title} delay={i * 0.08} direction="up">
                    <article className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-950/5">
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
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}