"use client";

import { Reveal } from "@/components/ui/reveal";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "SDKs", href: "#" },
      { label: "CLI", href: "#" },
      { label: "Examples", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "DPA", href: "#" },
      { label: "GDPR", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Reveal>
              <a
                href="/"
                className="mb-4 flex items-center gap-2.5"
                aria-label="Arc home"
              >
                <figure className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 1L15 14H1L8 1Z"
                      fill="white"
                      strokeLinejoin="round"
                    />
                  </svg>
                </figure>
                <span className="text-lg font-medium tracking-tight">Arc</span>
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
                Infrastructure for the modern stack. Build, deploy, and scale
                with confidence.
              </p>
            </Reveal>
          </div>

          {footerLinks.map((group, i) => (
            <Reveal key={group.title} delay={0.1 + i * 0.05} direction="up">
              <nav aria-label={group.title}>
                <h3 className="mb-4 text-sm font-semibold text-neutral-950">
                  {group.title}
                </h3>
                <ul className="space-y-3" role="list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-8 sm:flex-row">
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} Arc Technologies, Inc. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {["Twitter", "GitHub", "Discord", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-neutral-400 transition-colors hover:text-neutral-950"
                aria-label={social}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}