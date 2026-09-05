import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { FAQSection } from "@/components/sections/11-FAQSection";
import { CustomerProof } from "@/components/sections/10-CustomerProof";
import { Footer } from "@/components/sections/13-Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Docodo",
  description: "Get answers to common questions about Docodo booking setup, WhatsApp automation, payment security, and pricing.",
};

export default function FAQPage() {
  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen">
      <Nav />
      <div className="pt-28 pb-8 text-center container">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          Help Center &amp; Answers
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-display tracking-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Have questions about pricing, setup, WhatsApp integration, or payments? Find all answers below.
        </p>
      </div>

      <FAQSection />
      <CustomerProof />
      <Footer />
    </main>
  );
}
