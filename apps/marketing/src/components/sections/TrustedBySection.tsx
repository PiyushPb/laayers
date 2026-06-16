"use client";

const logos = [
  "Vercel", "Stripe", "Linear", "Notion", "Figma", "Supabase",
  "Resend", "PlanetScale", "Railway", "Clerk", "Neon", "Upstash",
];

export default function TrustedBySection() {
  const doubled = [...logos, ...logos]; // Infinite loop effect

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {doubled.map((logo, i) => (
          <span key={i} className="marquee-logo">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
