import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { PricingSection } from "@/components/sections/09-PricingSection";
import { FAQSection } from "@/components/sections/11-FAQSection";
import { CustomerProof } from "@/components/sections/10-CustomerProof";
import { Footer } from "@/components/sections/13-Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Docodo — Simple, Transparent Plans for Local Businesses",
  description: "Simple, honest pricing. Join our Pilot Program for ₹0, or choose Starter at ₹999/mo or Growth at ₹2,499/mo.",
};

export default function PricingPage() {
  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen">
      <Nav />
      <div className="pt-28 pb-12 text-center container">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          Pricing Plans
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-display tracking-tight mb-4">
          Transparent Pricing, Zero Hidden Fees
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Start for free on our Pilot tier. Upgrade only when you want to automate WhatsApp reminders and review collection.
        </p>
      </div>

      <PricingSection />
      <CustomerProof />
      <FAQSection />
      <Footer />
    </main>
  );
}
