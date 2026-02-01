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
  title: "Docodo | AI-Powered Digital Growth Studio",
  description: "Marketing-as-a-Service Platform engineered for founders. Automated, Intelligent, Scalable GTM systems.",
  keywords: ["AI Marketing", "Digital Growth", "Founder-Led Studio", "GTM Automation", "SaaS Scaling"],
  openGraph: {
    title: "Docodo | AI-Powered Digital Growth Studio",
    description: "Marketing-as-a-Service Platform engineered for founders.",
    url: "https://docodo.in",
    siteName: "Docodo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docodo | AI-Powered Digital Growth Studio",
    description: "Marketing-as-a-Service Platform engineered for founders.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
