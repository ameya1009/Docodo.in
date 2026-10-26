import { Metadata } from "next";

export const SITE_CONFIG = {
  name: "Docodo",
  title: "Docodo | #1 CRM, Automation, Marketing & Dashboard for Doctors, Clinics & Local Businesses",
  description: "Docodo is India's leading B2B operating system: combining #1 Clinic CRM, WhatsApp Appointment Automation, Digital Marketing Engine, and Real-Time Practice Dashboard with 0% aggregator commissions and DPDP Act compliance.",
  url: "https://docodo.in",
  ogImage: "https://docodo.in/images/og-image.png",
  twitterHandle: "@docodo_in",
};

export const defaultMetadata: Metadata = {
  title: {
    default: "Docodo | #1 CRM, Automation, Marketing & Dashboard for Doctors & Clinics",
    template: "%s | Docodo OS",
  },
  description: SITE_CONFIG.description,
  keywords: [
    // Primary High-Volume Search Keywords
    "CRM",
    "automation",
    "marketing",
    "dashboard",
    "doctor CRM",
    "clinic CRM",
    "patient CRM",
    "healthcare CRM India",
    "appointment automation",
    "WhatsApp automation",
    "marketing automation",
    "OPD queue automation",
    "doctor marketing",
    "clinic marketing",
    "patient retention marketing",
    "doctor dashboard",
    "clinic dashboard",
    "real-time appointment dashboard",
    "OPD queue dashboard",
    "medical practice dashboard",
    // Brand & Long-tail Keywords
    "Docodo",
    "Docodo.in",
    "clinic booking software India",
    "opd appointment scheduling",
    "appointment booking SaaS",
    "dental clinic software",
    "Razorpay booking gateway",
    "0% aggregator commission",
    "DPDP Act 2023 compliant medical software",
    "UPI advance token booking",
  ],
  authors: [{ name: "Docodo Technologies", url: "https://docodo.in" }],
  creator: "Docodo Technologies",
  publisher: "Docodo Technologies Private Limited",
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.url,
    title: "Docodo | #1 CRM, Automation, Marketing & Dashboard for Clinics & Doctors",
    description: "Launch your branded clinic booking page, automate WhatsApp reminders, manage patient CRM, and access real-time clinical dashboards in under 15 minutes.",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "Docodo #1 CRM, Automation, Marketing & Dashboard Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Docodo | #1 CRM, Automation, Marketing & Dashboard",
    description: "The dedicated operating system for clinics, doctors & local appointment businesses. Zero aggregator commissions, 100% direct UPI settlement.",
    images: [SITE_CONFIG.ogImage],
    creator: SITE_CONFIG.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://docodo.in/#organization",
      "name": "Docodo Technologies",
      "url": "https://docodo.in",
      "logo": "https://docodo.in/logo.png",
      "sameAs": [
        "https://www.youtube.com/channel/UCAgiu7bzl3QvGLNKhXcXsxw/",
        "https://www.youtube.com/channel/UCOxuYbcj1vUjItVTKXd8xgQ/",
        "https://www.instagram.com/ameyakshirsagar10/",
        "https://linkedin.com/company/docodo",
        "https://twitter.com/docodo_in",
        "https://medium.com/@ameyakshirsagar02"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9284310604",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Marathi"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://docodo.in/#website",
      "url": "https://docodo.in",
      "name": "Docodo — #1 CRM, Automation, Marketing & Dashboard Platform",
      "publisher": { "@id": "https://docodo.in/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://docodo.in/book/{slug}",
        "query-input": "required name=slug"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Docodo Clinic CRM, Automation & Dashboard Operating System",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, Mobile",
      "featureList": [
        "Patient Relationship Management (CRM)",
        "Automated WhatsApp Appointment & Token Workflows",
        "Doctor Digital Marketing & Retention Engine",
        "Real-Time Clinical Consultation & Revenue Dashboard",
        "Direct UPI Bank Settlement via Razorpay Standard Checkout",
        "Digital Personal Data Protection Act (DPDP Act 2023) Compliant Storage"
      ],
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": "0",
        "highPrice": "9999",
        "offerCount": "3"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.95",
        "ratingCount": "210"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What makes Docodo the best CRM and Dashboard for doctors and clinics?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Docodo provides a zero-aggregator private clinic operating system that unifies patient CRM, WhatsApp automation, review marketing, and real-time consultation dashboards, eliminating empty clinic chairs and double-bookings."
          }
        },
        {
          "@type": "Question",
          "name": "How does Docodo automate clinic appointments and patient follow-ups?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Docodo automatically dispatches verified WhatsApp token slips, directions, and pre-op care guides, followed by automated reminders that decrease patient no-shows from 28% to under 2%."
          }
        },
        {
          "@type": "Question",
          "name": "Does Docodo charge a commission on patient consultation fees?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Docodo charges 0% commission on consultations. Patient advance tokens and consultation fees settle directly into the clinic's bank account via official Razorpay UPI integration."
          }
        },
        {
          "@type": "Question",
          "name": "Is Docodo compliant with the Digital Personal Data Protection Act 2023?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Docodo complies strictly with India's DPDP Act 2023, featuring multi-tenant database isolation, AES-256 encryption at rest, and explicit patient consent gates."
          }
        }
      ]
    }
  ]
};
