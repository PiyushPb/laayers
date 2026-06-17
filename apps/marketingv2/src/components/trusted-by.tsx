"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

const companies = [
  "Vercel",
  "Stripe",
  "Linear",
  "Notion",
  "Figma",
  "Raycast",
  "Resend",
  "Supabase",
];

export function TrustedBy() {
  return (
    <section className="border-t border-neutral-100 py-16 lg:py-20" aria-label="Trusted by">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal direction="none">
          <p className="mb-10 text-center text-xs font-medium tracking-widest text-neutral-400 uppercase">
            Trusted by engineering teams everywhere
          </p>
        </Reveal>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

          <motion.div
            className="flex items-center gap-16 whitespace-nowrap"
            animate={{ x: [0, -1200] }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...companies, ...companies, ...companies].map((company, i) => (
              <span
                key={`${company}-${i}`}
                className="flex-shrink-0 text-lg font-medium tracking-tight text-neutral-300 select-none lg:text-xl"
              >
                {company}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}