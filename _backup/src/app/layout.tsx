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
    default: "Docodo | AI-Powered Growth OS for Pune SMBs",
    template: "%s | Docodo Growth OS"
  },
  description: "Transform your Pune business with Docodo's AI-Powered Growth OS. Premium websites, AI agents, and ROI-driven marketing for salons, clinics, and cafes. Built by COEP/VJTI engineers.",
  keywords: [
    "AI Growth OS Pune",
    "SMB Digital Transformation Pune",
    "Best Website Designer Pune",
    "WhatsApp AI Bot for Pune Businesses",
    "Clinic Marketing Pune",
    "Salon Growth Pune",
    "Docodo Pune"
  ],
  authors: [{ name: "Ameya - Founder, Docodo", url: "https://docodo.in/about" }],
  creator: "Docodo Engineering",
  openGraph: {
    title: "Docodo: The AI-Powered Growth OS for Pune SMBs",
    description: "Premium sites, apps, and AI agents that deliver ₹50k+/Month extra ROI. No tech hassle.",
    url: "https://docodo.in",
    siteName: "Docodo Growth OS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Docodo - AI Growth OS for Pune Businesses",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docodo | Pune's AI-Powered Growth Engine",
    description: "Premium growth systems for local businesses. Apple design, Indian scale.",
    images: ["/og-image.png"],
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
  alternates: {
    canonical: "https://docodo.in",
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
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://docodo.in/#organization",
        "name": "Docodo",
        "url": "https://docodo.in",
        "logo": "https://docodo.in/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9876543210",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["en", "Hindi", "Marathi"]
        },
        "sameAs": [
          "https://www.linkedin.com/company/docodo",
          "https://twitter.com/docodo_in"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://docodo.in/#website",
        "url": "https://docodo.in",
        "name": "Docodo Growth OS",
        "publisher": { "@id": "https://docodo.in/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://docodo.in/tools?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Service",
        "serviceType": "AI Growth OS",
        "provider": { "@id": "https://docodo.in/#organization" },
        "description": "Premium websites, AI agents, and marketing systems for Pune SMBs.",
        "areaServed": {
          "@type": "City",
          "name": "Pune"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Docodo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Docodo is an AI-Powered Growth OS designed specifically for Pune SMBs to scale revenue and automate customer trust."
            }
          },
          {
            "@type": "Question",
            "name": "How much does it cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pricing starts at ₹4,999 for essential growth services, with scalable AI credit packs."
            }
          }
        ]
      }
    ]
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
