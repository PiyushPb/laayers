import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description: "Engineering insights, product updates, and technical writing from the Laayers team.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
