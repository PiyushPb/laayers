"use client";

import { useState } from "react";
import { Quote } from "lucide-react";

const stories = [
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "VP of Infrastructure",
    company: "Vercel",
    quote: "Integrating Laayers reduced our primary PostgreSQL read load by over 92% overnight. The coalescing gateway completely mitigated our thundering herd issues during heavy traffic peaks.",
    logo: "VERCEL",
  },
  {
    id: "zeno",
    name: "Zeno Rocha",
    role: "Founder & CEO",
    company: "Resend",
    quote: "The developer experience is pristine. We initialized the client libraries and cached our primary dashboards in under 10 minutes. Zero-overhead integration at its finest.",
    logo: "RESEND",
  },
  {
    id: "takahiro",
    name: "Takahiro Shinoda",
    role: "Tech Lead",
    company: "Linear",
    quote: "Caching complex relational database state with dynamic query dependencies was a major hurdle. Laayers solved it at the networking layer, keeping cache keys synchronized automatically.",
    logo: "LINEAR",
  },
];

export default function CustomerStories() {
  const [activeStory, setActiveStory] = useState("sarah");
  const story = stories.find((s) => s.id === activeStory) || stories[0];

  return (
    <section className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            Customer Stories
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            In production globally
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
            Hear from engineering leaders who run Laayers to scale read speeds and safeguard databases.
          </p>
        </div>

        {/* Stories card container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Testimonial Block */}
          <div className="lg:col-span-8 border border-white/10 bg-zinc-950 p-8 md:p-12 rounded-sm flex flex-col justify-between min-h-[300px]">
            <Quote className="w-10 h-10 text-zinc-800 mb-8 shrink-0" />
            <div className="flex-1">
              <p className="text-white text-lg md:text-xl lg:text-2xl font-display font-medium leading-relaxed italic mb-8 select-none">
                "{story.quote}"
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-6">
              <div>
                <span className="text-sm font-bold text-white block uppercase tracking-wide">
                  {story.name}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {story.role} @ {story.company}
                </span>
              </div>
              <span className="font-display font-black text-zinc-600 text-sm tracking-widest">
                {story.logo}
              </span>
            </div>
          </div>

          {/* Testimonial Selector list */}
          <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
            {stories.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveStory(item.id)}
                className={`text-left p-6 border rounded-sm flex flex-col gap-2 transition-all duration-300 focus:outline-none ${
                  activeStory === item.id
                    ? "bg-zinc-950 border-white/20"
                    : "bg-transparent border-transparent hover:bg-zinc-950/20"
                }`}
              >
                <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  {item.company}
                </span>
                <span className="text-zinc-500 text-xs font-mono">
                  {item.name} • {item.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
