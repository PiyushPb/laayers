"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

const navLinks = [
  { label: "Product", href: "/#features" },
  { label: "Showcase", href: "/#showcase" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blogs" },
  { label: "Docs", href: "#" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 right-0 left-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={`mx-auto transition-all duration-500 ${
            isScrolled
              ? "mx-4 mt-4 max-w-6xl rounded-2xl bg-bg/80 border border-border px-6 py-3 shadow-lg backdrop-blur-2xl lg:mx-auto"
              : "max-w-7xl px-6 py-5 lg:px-10"
          }`}
        >
          <nav
            className="flex items-center justify-between"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="Laayers home"
            >
              <figure className="flex h-8 w-8 items-center justify-center rounded-lg bg-fg">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--bg)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </figure>
              <span className="text-lg font-medium tracking-tight text-fg">Laayers</span>
            </Link>

            <ul className="hidden items-center gap-1 lg:flex" role="list">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="rounded-lg px-3.5 py-2 text-sm text-fg-muted transition-colors duration-200 hover:bg-bg-secondary hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="#"
                className="rounded-lg px-4 py-2 text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                Sign in
              </Link>
              <MagneticButton
                className="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-fg/90"
                ariaLabel="Get started"
              >
                Get started
              </MagneticButton>
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-bg-secondary lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="flex w-5 flex-col gap-1.5">
                <motion.span
                  className="block h-px w-full bg-fg"
                  animate={
                    isMobileMenuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="block h-px w-full bg-fg"
                  animate={
                    isMobileMenuOpen
                      ? { rotate: -45, y: -3.5 }
                      : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.3 }}
                />
              </div>
            </button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex h-full flex-col justify-center px-8 pt-20">
              <ul className="flex flex-col gap-2" role="list">
                {navLinks.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      className="block py-3 text-3xl font-medium tracking-tight text-fg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="mt-12 flex flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Link
                  href="#"
                  className="w-full rounded-xl border border-border py-3.5 text-center text-base font-medium text-fg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="#"
                  className="w-full rounded-xl bg-fg py-3.5 text-center text-base font-medium text-bg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get started
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

