import { Metadata } from "next";

export const SITE_CONFIG = {
  name: "Docodo",
  title: "Docodo | AI WhatsApp Automation & Growth OS for Pune SMBs | Free Audit",
  description: "Docodo turns WhatsApp into a 24/7 AI sales machine. Self-hosted, DPDP compliant, Claude-powered. Care Plans from ₹2,499/mo. 47 Pune businesses. Start free.",
  url: "https://docodo.in",
  ogImage: "https://docodo.in/images/og-image.png",
  twitterHandle: "@docodo_in",
};

export const defaultMetadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: [
    "ai whatsapp bot india",
    "whatsapp automation pune",
    "docodo care plans",
    "self-hosted whatsapp bot dpdp compliant",
    "ai growth os pune smb",
    "content repurposer youtube to blog",
    "whatsapp lead nurturer india",
    "best whatsapp automation india 2026",
    "ai automation for clinics india",
  ],
  authors: [{ name: "Ameya Kshirsagar" }],
  creator: "Ameya Kshirsagar",
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
    creator: SITE_CONFIG.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://docodo.in/#organization",
      "name": "Docodo",
      "url": "https://docodo.in",
      "logo": "https://docodo.in/logo.png",
      "sameAs": [
        "https://youtube.com/@docodo",
        "https://spotify.com/docodo",
        "https://medium.com/@ameyakshirsagar02",
        "https://linkedin.com/company/docodo"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXXXXXXX",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["en", "Hindi", "Marathi"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://docodo.in/#website",
      "url": "https://docodo.in",
      "name": "Docodo AI Growth OS",
      "publisher": { "@id": "https://docodo.in/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://docodo.in/tools?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Docodo AI Growth OS",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": "2499",
        "highPrice": "9999",
        "offerCount": "3"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Docodo free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — start with 50 free credits, no card required."
          }
        },
        {
          "@type": "Question",
          "name": "Is Docodo DPDP compliant?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — self-hosted, data stays in India."
          }
        },
        {
          "@type": "Question",
          "name": "How fast is the WhatsApp bot?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Average 60-second reply time, 24/7."
          }
        },
        {
          "@type": "Question",
          "name": "Which businesses use Docodo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Clinics, salons, cafes, coaching centres in Pune."
          }
        },
        {
          "@type": "Question",
          "name": "Can I cancel anytime?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — 30-day notice, no lock-in."
          }
        },
        {
          "@type": "Question",
          "name": "Does it work in Hinglish?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — Claude AI supports Hinglish natively."
          }
        },
        {
          "@type": "Question",
          "name": "What is the cheapest Care Plan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Starter at ₹2,499/mo."
          }
        },
        {
          "@type": "Question",
          "name": "How many credits do I get free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "50 credits on signup, no card needed."
          }
        },
        {
          "@type": "Question",
          "name": "What AI powers Docodo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Anthropic Claude API."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a setup fee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No — setup is included in all Care Plans."
          }
        }
      ]
    },
    {
      "@type": "LocalBusiness",
      "name": "Docodo",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Pune",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Pune", "India"],
      "priceRange": "₹₹"
    }
  ]
};
