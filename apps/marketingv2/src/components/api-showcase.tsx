"use client";

import { Reveal } from "@/components/ui/reveal";

const endpoints = [
  { method: "POST", path: "/v1/deployments", status: "201", time: "142ms" },
  { method: "GET", path: "/v1/projects/:id", status: "200", time: "12ms" },
  { method: "PUT", path: "/v1/domains/:id", status: "200", time: "89ms" },
  { method: "GET", path: "/v1/analytics", status: "200", time: "34ms" },
  { method: "DELETE", path: "/v1/secrets/:key", status: "204", time: "23ms" },
];

export function ApiShowcase() {
  return (
    <section className="bg-neutral-950 py-24 lg:py-40" aria-label="API showcase">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="mb-4 text-sm font-medium tracking-widest text-neutral-500 uppercase">
                API
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                REST API that
                <br />
                developers love
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mb-10 max-w-md text-base leading-relaxed text-neutral-400">
                Consistent, predictable, and thoroughly documented. Every
                resource follows the same patterns. Every error tells you
                exactly what went wrong.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="space-y-3">
                {[
                  "OpenAPI 3.1 specification",
                  "Idempotent operations",
                  "Cursor-based pagination",
                  "Webhook delivery with retry",
                  "Rate limiting with backpressure",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <span className="text-sm text-neutral-300">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} direction="right">
            <figure className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
              <header className="border-b border-neutral-800 px-5 py-3">
                <p className="text-xs font-medium text-neutral-500">
                  API Explorer
                </p>
              </header>

              <div className="divide-y divide-neutral-800/50">
                {endpoints.map((endpoint, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-neutral-800/30"
                  >
                    <span
                      className={`w-16 flex-shrink-0 font-mono text-xs font-medium ${
                        endpoint.method === "GET"
                          ? "text-emerald-400/80"
                          : endpoint.method === "POST"
                            ? "text-blue-400/80"
                            : endpoint.method === "PUT"
                              ? "text-amber-400/80"
                              : "text-red-400/80"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <span className="flex-1 truncate font-mono text-xs text-neutral-300">
                      {endpoint.path}
                    </span>
                    <span className="font-mono text-xs text-neutral-500">
                      {endpoint.status}
                    </span>
                    <span className="font-mono text-xs text-neutral-600">
                      {endpoint.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-800 p-5">
                <pre className="font-mono text-xs leading-relaxed text-neutral-400">
                  <code>
                    {`curl -X POST https://api.arc.dev/v1/deployments \\
  -H "Authorization: Bearer arc_sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"project": "my-app", "ref": "main"}'`}
                  </code>
                </pre>
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}