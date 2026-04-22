import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cabinet = Space_Grotesk({
  variable: "--font-cabinet",
  subsets: ["latin"],
});

const satoshi = Inter({
  variable: "--font-satoshi",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Docodo | AI WhatsApp Automation & Growth OS for Pune SMBs",
  description: "Docodo is India's #1 self-hosted AI Growth OS for SMBs. WhatsApp AI Nurturer, Content Repurposer, and automated marketing for salons, clinics, cafes in Pune. DPDP compliant. Start free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${cabinet.variable} ${satoshi.variable} antialiased bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]`}>
        {children}
      </body>
    </html>
  );
}
