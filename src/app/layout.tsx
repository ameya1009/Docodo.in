import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AIChatBubble } from "@/components/ui/AIChatBubble";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docodo.in"),
  title: {
    default: "Docodo | AI-Powered SMB Growth OS for Pune Businesses",
    template: "%s | Docodo"
  },
  description: "The Apple of SMB Digital Growth. Premium Websites, Digital Marketing, and AI Automations engineered for Pune clinics, salons, and cafes starting at ₹4,999.",
  keywords: ["Pune SMB Growth", "AI Automation Pune", "Website Design Pune", "Digital Marketing Pune", "WhatsApp Bot Pune", "Growth OS"],
  authors: [{ name: "Docodo Engineering Team", url: "https://docodo.in" }],
  creator: "Docodo",
  openGraph: {
    title: "Docodo | Founder-First Growth Studio",
    description: "Engineering growth systems for founders scaling from $1M to $10M ARR.",
    url: "https://docodo.in",
    siteName: "Docodo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docodo | Your AI-Powered SMB Growth OS",
    description: "Premium growth systems for Pune businesses. Apple design, Android volume.",
    creator: "@docodo_in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "B9wMp4XDva_nrfN0R_8pJ1mhq3srcjCbXq6AhPHGL6U",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Docodo",
    "@id": "https://docodo.in",
    "url": "https://docodo.in",
    "telephone": "+91-PON-DOCODO",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.5204,
      "longitude": 73.8567
    },
    "sameAs": [
      "https://www.linkedin.com/company/docodo",
      "https://twitter.com/docodo_in"
    ],
    "priceRange": "₹₹"
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
        <AIChatBubble />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
