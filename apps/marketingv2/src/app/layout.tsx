import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arc — Infrastructure for the Modern Stack",
  description:
    "The unified platform for building, deploying, and scaling production-grade applications. Trusted by engineering teams at the world's most ambitious companies.",
  keywords: [
    "infrastructure",
    "platform",
    "developer tools",
    "API",
    "SDK",
    "deployment",
    "cloud",
  ],
  openGraph: {
    title: "Arc — Infrastructure for the Modern Stack",
    description:
      "The unified platform for building, deploying, and scaling production-grade applications.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arc — Infrastructure for the Modern Stack",
    description:
      "The unified platform for building, deploying, and scaling production-grade applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Google+Sans+Text:wght@400;500;700&family=Google+Sans+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white font-sans text-neutral-950 antialiased">
        {children}
      </body>
    </html>
  );
}