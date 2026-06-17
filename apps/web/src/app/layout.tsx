import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import ScrollProgress from "@/components/ui/ScrollProgress";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Laayers — Edge Caching & Real-Time API Orchestration",
  description: "Enterprise multi-layer caching and intelligent edge routing for modern high-throughput API systems. Built for developers who ship.",
  metadataBase: new URL("https://laayers.dev"),
  openGraph: {
    title: "Laayers — Edge Caching & Real-Time API Orchestration",
    description: "Enterprise multi-layer caching and intelligent edge routing for modern high-throughput API systems. Built for developers who ship.",
    url: "https://laayers.dev",
    siteName: "Laayers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laayers — Edge Caching & Real-Time API Orchestration",
    description: "Enterprise multi-layer caching and intelligent edge routing for modern high-throughput API systems. Built for developers who ship.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#000000] text-[#fafafa] font-sans antialiased min-h-screen selection:bg-white/15 selection:text-white">
        <ScrollProgress />
        <SmoothScrollProvider>
          <div className="relative flex flex-col w-full min-h-screen">
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
