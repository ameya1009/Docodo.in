import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
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
    default: "Docodo | Founder-First Growth Studio",
    template: "%s | Docodo"
  },
  description: "Marketing-as-a-Service Platform engineered for founders scaling from $1M to $10M ARR. Data-backed growth systems and automated GTM engines.",
  keywords: ["SaaS Growth", "GTM Engineering", "Founder-Led Growth", "Marketing Systems", "Scale from 1M to 10M"],
  authors: [{ name: "Ameya", url: "https://docodo.in" }],
  creator: "Ameya",
  openGraph: {
    title: "Docodo | Founder-First Growth Studio",
    description: "Engineering growth systems for founders scaling from $1M to $10M ARR.",
    url: "https://docodo.in",
    siteName: "Docodo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Docodo | Founder-First Growth Studio",
    description: "Data-backed growth systems for founders scaling from $1M to $10M ARR.",
    creator: "@ameya",
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
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "UK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 0,
      "longitude": 0
    },
    "sameAs": [
      "https://www.linkedin.com/company/docodo",
      "https://twitter.com/docodo"
    ],
    "priceRange": "$$$"
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
