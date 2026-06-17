"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

const sdks = [
  {
    lang: "TypeScript",
    code: `import { Arc } from "@arc/sdk"

const arc = new Arc({ apiKey: process.env.ARC_KEY })

const deployment = await arc.deployments.create({
  project: "my-app",
  ref: "main",
  environment: "production",
})

console.log(deployment.url)
// → https://my-app.arc.app`,
  },
  {
    lang: "Python",
    code: `from arc import Arc

arc = Arc(api_key=os.environ["ARC_KEY"])

deployment = arc.deployments.create(
    project="my-app",
    ref="main",
    environment="production",
)

print(deployment.url)
# → https://my-app.arc.app`,
  },
  {
    lang: "Go",
    code: `package main

import "github.com/arc-dev/arc-go"

func main() {
    client := arc.NewClient(os.Getenv("ARC_KEY"))

    deployment, _ := client.Deployments.Create(&arc.DeploymentParams{
        Project:     "my-app",
        Ref:         "main",
        Environment: "production",
    })

    fmt.Println(deployment.URL)
    // → https://my-app.arc.app
}`,
  },
  {
    lang: "Rust",
    code: `use arc_sdk::Arc;

#[tokio::main]
async fn main() {
    let client = Arc::new(std::env::var("ARC_KEY").unwrap());

    let deployment = client.deployments()
        .create("my-app", "main", "production")
        .await
        .unwrap();

    println!("{}", deployment.url);
    // → https://my-app.arc.app
}`,
  },
];

export function SdkShowcase() {
  const [activeSdk, setActiveSdk] = useState("TypeScript");
  const active = sdks.find((s) => s.lang === activeSdk) ?? sdks[0];

  return (
    <section className="py-24 lg:py-40" aria-label="SDK showcase">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              SDKs
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Your language. Our platform.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-base leading-relaxed text-neutral-500 lg:text-lg">
              Idiomatic SDKs that feel native to every language. Full type
              safety, comprehensive documentation, and consistent patterns.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <div className="mx-auto max-w-3xl">
            <nav className="mb-4 flex gap-1 rounded-xl bg-neutral-100 p-1" aria-label="SDK languages">
              {sdks.map((sdk) => (
                <button
                  key={sdk.lang}
                  onClick={() => setActiveSdk(sdk.lang)}
                  className={`relative flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeSdk === sdk.lang
                      ? "text-neutral-950"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                  aria-pressed={activeSdk === sdk.lang}
                >
                  {activeSdk === sdk.lang && (
                    <motion.span
                      className="absolute inset-0 rounded-lg bg-white shadow-sm"
                      layoutId="sdk-tab"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative z-10">{sdk.lang}</span>
                </button>
              ))}
            </nav>

            <AnimatePresence mode="wait">
              <motion.figure
                key={active.lang}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950"
              >
                <header className="flex items-center justify-between border-b border-neutral-800 px-5 py-3">
                  <span className="text-xs text-neutral-500">
                    {active.lang.toLowerCase()}/example
                  </span>
                  <button
                    className="rounded-md px-3 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
                    aria-label="Copy code"
                  >
                    Copy
                  </button>
                </header>

                <div className="p-5 lg:p-6">
                  <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-neutral-300 sm:text-sm">
                    <code>{active.code}</code>
                  </pre>
                </div>
              </motion.figure>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}