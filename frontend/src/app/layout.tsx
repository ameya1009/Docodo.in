import type { Metadata } from "next";
import { Unbounded, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/SmoothScroll";

const unbounded = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Docodo | AI WhatsApp Automation & Growth OS for Pune SMBs | Free 50-Point Audit",
  description: "Docodo turns your WhatsApp into a 24/7 AI sales machine. Self-hosted, DPDP compliant, Claude-powered. Care Plans from ₹2,499/mo. Used by 47 Pune businesses. Start free today.",
  keywords: ["WhatsApp AI bot India", "AI automation Pune", "Docodo Care Plans", "WhatsApp lead nurturer", "Claude AI automation"],
  openGraph: {
    title: "Docodo | AI Growth OS",
    description: "AI WhatsApp Automation & Growth for Pune SMBs.",
    url: "https://docodo.in",
    siteName: "Docodo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docodo | AI Growth OS",
    description: "AI WhatsApp Automation & Growth for Pune SMBs.",
    images: ["/og-image.png"],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        unbounded.variable,
        dmSans.variable,
        jetbrainsMono.variable,
        "antialiased bg-bg-deep text-white"
      )}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
