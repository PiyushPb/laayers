"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Product", href: "/#features" },
  { label: "Showcase", href: "/#showcase" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blogs" },
  { label: "Docs", href: "#" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header ref={headerRef} className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="header-inner">
            <Link href="/" className="header-logo">
              Laayers
            </Link>

            <nav className="header-nav">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="header-actions">
              <Link href="#" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>
                Sign in
              </Link>
              <Link href="#" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
                Get started
              </Link>
              <button
                className="header-mobile-toggle"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`}>
        <button
          className="mobile-nav-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
        {navLinks.map((link) => (
          <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link href="#" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
          Get started
        </Link>
      </div>
    </>
  );
}
