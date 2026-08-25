import { Metadata } from "next";

export const SITE_CONFIG = {
  name: "Docodo",
  title: "Docodo | All-in-One Booking SaaS, CRM & Digital Marketing Platform for Local Businesses",
  description: "Docodo is the premier B2B SaaS platform equipping local service businesses (salons, spas, clinics, gyms) with live booking pages, CRM, payment gateway, and digital marketing growth tools in under 15 minutes.",
  url: "https://docodo.in",
  ogImage: "https://docodo.in/images/og-image.png",
  twitterHandle: "@docodo_in",
};

export const defaultMetadata: Metadata = {
  title: {
    default: "Docodo | All-in-One Booking SaaS, CRM & Dashboard for Local Businesses",
    template: "%s | Docodo SaaS",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Docodo",
    "SaaS",
    "digital marketing",
    "CRM",
    "dashboard",
    "salon booking software India",
    "appointment booking SaaS",
    "spa management software",
    "clinic appointment scheduler",
    "gym management software",
    "WhatsApp CRM automation",
    "Razorpay booking gateway",
    "local business growth OS",
    "service business operating system",
    "automated appointment scheduling",
    "online booking system India",
    "B2B SaaS India",
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
    title: "Docodo — The Complete Booking SaaS, CRM & Digital Marketing Dashboard",
    description: "Launch your branded booking page, collect online payments with Razorpay, manage customers, and automate marketing in 15 minutes.",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "Docodo B2B Booking SaaS & CRM Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Docodo | All-in-One Booking SaaS, CRM & Growth Platform",
    description: "Equip your salon, spa, clinic, or service business with an automated booking engine and CRM in 15 minutes.",
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
        "https://youtube.com/@docodo",
        "https://linkedin.com/company/docodo",
        "https://twitter.com/docodo_in",
        "https://medium.com/@ameyakshirsagar02"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9876543210",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Marathi"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://docodo.in/#website",
      "url": "https://docodo.in",
      "name": "Docodo SaaS & Digital Marketing Dashboard",
      "publisher": { "@id": "https://docodo.in/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://docodo.in/book/{slug}",
        "query-input": "required name=slug"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Docodo Appointment Booking & CRM Platform",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": "0",
        "highPrice": "9999",
        "offerCount": "3"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "142"
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
            "text": "Docodo is an all-in-one B2B SaaS platform for local appointment businesses (salons, spas, clinics, gyms) providing online booking pages, customer CRM, digital marketing automation, and Razorpay payment integration."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to set up Docodo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can configure your business profile, add services, set working hours, and publish your live booking page in under 15 minutes."
          }
        },
        {
          "@type": "Question",
          "name": "Does Docodo support online payments in India?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Docodo integrates official Razorpay Standard Web Checkout supporting UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Netbanking with automated verification."
          }
        },
        {
          "@type": "Question",
          "name": "Is Docodo DPDP Act 2023 compliant?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Docodo complies with the Digital Personal Data Protection Act 2023 with secure multi-tenant encryption and local Indian data residency."
          }
        }
      ]
    }
  ]
};
