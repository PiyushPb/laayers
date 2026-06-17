"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How does Laayers handle database writes?",
    answer: "Laayers runs a write-through invalidation protocol. When writes or mutations are committed, cached reference keys are automatically evicted or updated at the edge POP and propagated across the global mesh directories in milliseconds.",
  },
  {
    question: "Do I need to migrate my database?",
    answer: "No. Laayers connects to your existing database clusters (Postgres, MySQL, DynamoDB, MongoDB, etc.) via connection strings. It acts as an intelligent caching proxy sitting directly in front of read queries, requiring zero structural changes to your schemas.",
  },
  {
    question: "What happens if a regional cache miss occurs?",
    answer: "A single coalesced query is fired downstream to your database. Other parallel requests for the same stale key are paused at the gateway, reading the fresh payload immediately upon database completion to protect origin clusters.",
  },
  {
    question: "Is there support for edge middleware runtimes?",
    answer: "Yes, our clients are dependency-free and compile natively for Vercel Edge Functions, Cloudflare Workers, Next.js Middleware, and standard Node.js/Bun instances.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 border-b border-white/5 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            Common Inquiries
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Frequently Asked
          </h2>
        </div>

        {/* Accordions */}
        <div className="flex flex-col border-t border-white/10">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="border-b border-white/10">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-6 flex justify-between items-center text-left text-white font-display font-semibold text-sm md:text-base uppercase tracking-wider focus:outline-none hover:text-zinc-300 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 text-zinc-500">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-zinc-400 text-xs md:text-sm leading-relaxed pb-6 pr-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
