"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { name: "Platform", href: "#platform" },
  { name: "Developer XP", href: "#developer-xp" },
  { name: "Infrastructure", href: "#infrastructure" },
  { name: "Integrations", href: "#integrations" },
  { name: "FAQ", href: "#faq" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-black/70 backdrop-blur-md border-b border-white/5 py-4"
            : "bg-transparent border-b border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="Laayers Homepage"
          >
            <div className="w-5 h-5 bg-white rounded-sm transition-transform duration-500 group-hover:rotate-45" />
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Laayers
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#docs"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200 px-3 py-1.5 focus:outline-none focus:text-white"
            >
              Docs
            </a>
            <a
              href="#login"
              className="group flex items-center gap-1.5 bg-white text-black text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm hover:bg-zinc-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Start Free
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-800 rounded"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black pt-28 px-8 flex flex-col gap-8 md:hidden"
          >
            <nav className="flex flex-col gap-6" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-display font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="h-px bg-zinc-800 my-2" />

            <div className="flex flex-col gap-4">
              <a
                href="#docs"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Documentation
              </a>
              <a
                href="#login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between bg-white text-black text-sm font-semibold uppercase tracking-wider px-6 py-3.5 rounded-sm hover:bg-zinc-200 transition-colors"
              >
                Start Free Account
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
