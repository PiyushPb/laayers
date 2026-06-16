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
    <footer className="footer noise">
      <div className="container">
        <p className="footer-statement">
          Built for<br />scale.
        </p>

        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo">Laayers</span>
            <p>
              The infrastructure layer for teams that move fast without breaking things.
              Trusted by engineering teams at the world&apos;s most demanding companies.
            </p>
            <div className="footer-newsletter">
              <input
                type="email"
                placeholder="your@company.com"
                className="footer-input"
              />
              <button className="footer-input-btn">Subscribe</button>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Laayers, Inc. All rights reserved.</p>
          <div className="footer-social">
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
            <a href="#">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
