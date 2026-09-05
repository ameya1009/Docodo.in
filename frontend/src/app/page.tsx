"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Nav } from "@/components/sections/01-Nav";
import { Hero } from "@/components/sections/02-Hero";
import { PainPoints } from "@/components/sections/03-Pain";
import { Setup15Min } from "@/components/sections/04-Setup15Min";
import { LiveInteractiveDemo } from "@/components/sections/05-LiveInteractiveDemo";
import { FeatureMatrix } from "@/components/sections/06-FeatureMatrix";
import { BeforeAfter } from "@/components/sections/07-BeforeAfter";
import { BuiltForLocals } from "@/components/sections/08-BuiltForLocals";
import { PricingSection } from "@/components/sections/09-PricingSection";
import { CustomerProof } from "@/components/sections/10-CustomerProof";
import { FAQSection } from "@/components/sections/11-FAQSection";
import { TrustSecurity } from "@/components/sections/12-TrustSecurity";
import { Footer } from "@/components/sections/13-Footer";
import { useScrollReveal } from "@/hooks";

export default function Home() {
  // Initialize GSAP Scroll Reveals
  useScrollReveal();

  return (
    <main className="relative bg-[var(--bg-void)] overflow-x-hidden">
      {/* 1. Header Navigation */}
      <Nav />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Problem Section */}
      <PainPoints />

      {/* 4. The 15-Minute Setup Promise */}
      <Setup15Min />

      {/* 5. Live Product Demonstration Workflow */}
      <LiveInteractiveDemo />

      {/* 6. Comprehensive Product Features (A-I) */}
      <FeatureMatrix />

      {/* 7. Before vs After Comparison */}
      <BeforeAfter />

      {/* 8. Built for Local Businesses Verticals */}
      <BuiltForLocals />

      {/* 9. Simple Transparent Pricing */}
      <PricingSection />

      {/* 10. Honest Social Proof & Pilot Program */}
      <CustomerProof />

      {/* 11. Frequently Asked Questions */}
      <FAQSection />

      {/* 12. Trust & Security Guarantees */}
      <TrustSecurity />

      {/* 13. Comprehensive Footer */}
      <Footer />
    </main>
  );
}
