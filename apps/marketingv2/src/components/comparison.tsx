"use client";

import { Reveal } from "@/components/ui/reveal";

const features = [
  { name: "Zero cold starts", arc: true, others: false },
  { name: "Global edge compute", arc: true, others: "Partial" },
  { name: "Built-in observability", arc: true, others: false },
  { name: "Automatic scaling", arc: true, others: true },
  { name: "Git-based deployments", arc: true, others: true },
  { name: "Unified data layer", arc: true, others: false },
  { name: "TypeScript-native SDK", arc: true, others: "Partial" },
  { name: "Sub-15ms global latency", arc: true, others: false },
  { name: "SOC 2 + HIPAA", arc: true, others: "Partial" },
  { name: "Preview environments", arc: true, others: true },
];

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (value === false) {
    return <span className="inline-block h-px w-4 bg-neutral-300" />;
  }
  return <span className="text-xs text-neutral-400">{value}</span>;
}

export function Comparison() {
  return (
    <section
      className="border-t border-neutral-100 py-24 lg:py-40"
      aria-label="Comparison"
    >
      <div className="mx-auto max-w-4xl px-5">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              Comparison
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Why teams switch to Arc
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <figure className="overflow-hidden rounded-2xl border border-neutral-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-neutral-950 uppercase">
                      Arc
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium tracking-wider text-neutral-400 uppercase">
                      Others
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {features.map((feature) => (
                    <tr
                      key={feature.name}
                      className="transition-colors hover:bg-neutral-50"
                    >
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {feature.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex justify-center">
                          <CellValue value={feature.arc} />
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex justify-center">
                          <CellValue value={feature.others} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}