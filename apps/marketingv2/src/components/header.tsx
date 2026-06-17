"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Developers", href: "#developers" },
  { label: "Enterprise", href: "#enterprise" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
];

export function Header() {
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
              ? "mx-4 mt-4 max-w-6xl rounded-2xl border border-neutral-200/60 bg-white/80 px-6 py-3 shadow-lg shadow-neutral-950/5 backdrop-blur-2xl lg:mx-auto"
              : "max-w-7xl px-6 py-5 lg:px-10"
          }`}
        >
          <nav
            className="flex items-center justify-between"
            role="navigation"
            aria-label="Main navigation"
          >
            <a
              href="/"
              className="flex items-center gap-2.5"
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

            <ul className="hidden items-center gap-1 lg:flex" role="list">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="rounded-lg px-3.5 py-2 text-sm text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-950"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-3 lg:flex">
              <a
                href="#signin"
                className="rounded-lg px-4 py-2 text-sm text-neutral-600 transition-colors duration-200 hover:text-neutral-950"
              >
                Sign in
              </a>
              <MagneticButton
                className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800"
                ariaLabel="Get started"
              >
                Get started
              </MagneticButton>
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="flex w-5 flex-col gap-1.5">
                <motion.span
                  className="block h-px w-full bg-neutral-950"
                  animate={
                    isMobileMenuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="block h-px w-full bg-neutral-950"
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
            className="fixed inset-0 z-40 bg-white lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex h-full flex-col justify-center px-8 pt-20">
              <ul className="flex flex-col gap-2" role="list">
                {navItems.map((item, i) => (
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
                    <a
                      href={item.href}
                      className="block py-3 text-3xl font-medium tracking-tight text-neutral-950"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
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
                <a
                  href="#signin"
                  className="w-full rounded-xl border border-neutral-200 py-3.5 text-center text-base font-medium"
                >
                  Sign in
                </a>
                <a
                  href="#start"
                  className="w-full rounded-xl bg-neutral-950 py-3.5 text-center text-base font-medium text-white"
                >
                  Get started
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}