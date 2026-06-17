import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Showcase", href: "/#showcase" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "SDKs", href: "#" },
      { label: "Status", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "/blogs" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "/#security" },
      { label: "DPA", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="noise border-t border-border pt-[clamp(3rem,6vw,5rem)] pb-10 bg-bg-secondary relative overflow-hidden">
      <div className="container">
        <p className="text-[clamp(3rem,6vw,var(--text-7xl))] max-lg:text-[clamp(2.5rem,5vw,4.5rem)] max-md:text-[clamp(2rem,8vw,3.5rem)] max-sm:text-[clamp(2rem,10vw,3rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-border-strong mb-[clamp(2.5rem,5vw,5rem)] max-md:mb-8">
          Built for<br />scale.
        </p>

        <div className="grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-[clamp(1.5rem,3vw,3rem)] max-lg:gap-8 max-md:gap-y-8 max-md:gap-x-6 pt-10 border-t border-border mb-12">
          <div className="lg:pr-4 col-span-2 max-lg:col-span-full max-lg:flex max-lg:flex-wrap max-lg:gap-6 max-lg:items-start max-md:block">
            <span className="text-xl font-bold tracking-[-0.03em] text-fg mb-4 block max-lg:basis-full">Laayers</span>
            <p className="text-sm text-fg-muted leading-[1.7] max-w-[280px] mb-6 max-lg:flex-1 max-lg:basis-[280px] max-lg:mb-0 max-lg:max-w-[380px] max-md:max-w-full">
              The infrastructure layer for teams that move fast without breaking things.
              Trusted by engineering teams at the world&apos;s most demanding companies.
            </p>
            <div className="flex mt-4 w-[260px] max-w-full max-lg:flex-1 max-lg:basis-[260px] max-lg:mt-0 max-md:max-w-[320px] max-sm:max-w-full">
              <input
                type="email"
                placeholder="your@company.com"
                className="flex-1 min-w-0 bg-bg-tertiary border border-r-0 border-border-strong rounded-l-md px-3.5 py-2.5 font-sans text-sm text-fg outline-none transition-colors duration-200 focus:border-fg placeholder:text-fg-subtle"
              />
              <button className="shrink-0 bg-fg text-bg border-none rounded-r-md px-4 py-2.5 font-sans text-sm font-medium cursor-pointer whitespace-nowrap transition-colors duration-200 hover:bg-fg-muted">Subscribe</button>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-[0.12em] uppercase text-fg-subtle mb-5">{col.title}</h4>
              <ul className="list-none flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-fg-muted no-underline transition-colors duration-200 hover:text-fg">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-border gap-4 flex-wrap max-sm:flex-col max-sm:items-start max-sm:gap-3">
          <p className="text-xs text-fg-subtle">© {new Date().getFullYear()} Laayers, Inc. All rights reserved.</p>
          <div className="flex gap-6 flex-wrap max-sm:gap-4">
            <a href="#" className="text-xs text-fg-subtle no-underline tracking-[0.08em] uppercase transition-colors duration-200 hover:text-fg">Twitter</a>
            <a href="#" className="text-xs text-fg-subtle no-underline tracking-[0.08em] uppercase transition-colors duration-200 hover:text-fg">LinkedIn</a>
            <a href="#" className="text-xs text-fg-subtle no-underline tracking-[0.08em] uppercase transition-colors duration-200 hover:text-fg">GitHub</a>
            <a href="#" className="text-xs text-fg-subtle no-underline tracking-[0.08em] uppercase transition-colors duration-200 hover:text-fg">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
