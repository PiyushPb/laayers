"use client";

import { useState } from "react";
import { Check, Copy, Code } from "lucide-react";

const sdks = [
  {
    id: "ts",
    name: "TypeScript",
    lang: "typescript",
    code: `import { createClient } from "@laayers/client";

const client = createClient({ token: "ly_19x72a" });

const user = await client.cache("user:102", {
  ttl: 300,
  query: () => prisma.user.findUnique({ where: { id: 102 } })
});`,
  },
  {
    id: "py",
    name: "Python",
    lang: "python",
    code: `from laayers import create_client

client = create_client(token="ly_19x72a")

# Cache query response
user = client.cache(
    key="user:102",
    ttl=300,
    query=lambda: db.query(User).filter_by(id=102).first()
)`,
  },
  {
    id: "go",
    name: "Go",
    lang: "go",
    code: `import "github.com/laayers/client-go"

client := laayers.NewClient("ly_19x72a")

var user User
err := client.Cache(ctx, "user:102", &user, 300 * time.Second, func() (interface{}, error) {
    return db.FindUser(102)
})`,
  },
  {
    id: "rust",
    name: "Rust",
    lang: "rust",
    code: `use laayers::Client;

let client = Client::new("ly_19x72a");

let user: User = client.cache("user:102", 300, || {
    database::find_user(102)
}).await?;`,
  },
];

export default function SdkShowcase() {
  const [activeLang, setActiveLang] = useState("ts");
  const [copied, setCopied] = useState(false);

  const activeSdk = sdks.find((s) => s.id === activeLang) || sdks[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSdk.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual code layout column */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 rounded-sm bg-zinc-950 overflow-hidden shadow-2xl">
              {/* SDK Header Selector */}
              <div className="flex justify-between items-center bg-zinc-900/50 border-b border-white/5 px-4">
                <div className="flex overflow-x-auto scrollbar-none">
                  {sdks.map((sdk) => (
                    <button
                      key={sdk.id}
                      onClick={() => setActiveLang(sdk.id)}
                      className={`font-mono text-[10px] uppercase tracking-wider py-4 px-4 transition-colors focus:outline-none shrink-0 border-b-2 ${
                        activeLang === sdk.id
                          ? "border-white text-white"
                          : "border-transparent text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {sdk.name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="p-1.5 text-zinc-500 hover:text-white rounded transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-800"
                  aria-label="Copy SDK example"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Terminal snippet container */}
              <div className="p-6 font-mono text-xs md:text-sm text-zinc-400 bg-black/40 min-h-[220px] overflow-x-auto">
                <pre className="whitespace-pre">
                  <code>{activeSdk.code}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Description text column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
                Native Integrations
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
                Native client SDKs
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                We maintain zero-dependency native libraries for major developer stacks. Full TypeScript support, native python lambdas, type-safe Rust structures, and lightweight Go interfaces.
              </p>
            </div>

            <div className="flex items-center gap-3 border border-white/10 rounded-sm p-4 bg-zinc-950/40 w-fit">
              <Code className="w-5 h-5 text-zinc-400" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-300">
                100% Async / Fully Thread-Safe
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
