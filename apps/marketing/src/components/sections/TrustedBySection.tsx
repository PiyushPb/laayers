"use client";

const logos = [
  "Vercel", "Stripe", "Linear", "Notion", "Figma", "Supabase",
  "Resend", "PlanetScale", "Railway", "Clerk", "Neon", "Upstash",
];

export default function TrustedBySection() {
  const doubled = [...logos, ...logos]; // Infinite loop effect

  return (
    <div className="py-16 border-y border-border bg-bg-secondary overflow-hidden relative flex before:absolute before:inset-y-0 before:left-0 before:w-[15%] before:z-[2] before:pointer-events-none before:bg-gradient-to-r before:from-bg-secondary before:to-transparent after:absolute after:inset-y-0 after:right-0 after:w-[15%] after:z-[2] after:pointer-events-none after:bg-gradient-to-l after:from-bg-secondary after:to-transparent">
      <div className="flex w-max animate-[marquee_30s_linear_infinite]">
        {doubled.map((logo, i) => (
          <span key={i} className="text-2xl font-bold text-fg-subtle mx-12 tracking-[-0.04em] opacity-50 transition-all duration-300 hover:opacity-100 hover:text-fg">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
