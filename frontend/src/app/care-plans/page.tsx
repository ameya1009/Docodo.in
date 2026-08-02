"use client";

import React from "react";
import { Nav } from "@/components/sections/01-Nav";
import { CarePlans as CarePlansSection } from "@/components/sections/07-CarePlans";
import { Footer } from "@/components/sections/13-Footer";
import { SectionHeading } from "@/components/ui/SectionElements";
import { Badge } from "@/components/ui/FeedbackElements";

export default function CarePlansPage() {
  return (
    <main className="pt-20">
      <Nav />
      <div className="py-24 bg-[var(--bg-void)]">
        <div className="container">
          <Badge variant="lime" className="mb-6">Pricing & Plans</Badge>
          <SectionHeading
            headline="Transparent pricing for every stage of growth."
            sub="No hidden fees. No long-term contracts. Just results."
            align="left"
            className="mb-12"
          />
        </div>
        <CarePlansSection />
      </div>
      
      {/* FAQ Section (Optional but recommended for pricing page) */}
      <section className="py-24 bg-[var(--bg-deep)]">
        <div className="container max-w-3xl">
          <h3 className="text-3xl font-black mb-12 text-center">Frequently Asked Questions</h3>
          <div className="space-y-8">
            {[
              { q: "Is Docodo free?", a: "Yes — you can start with 50 free credits to try our tools, no credit card required." },
              { q: "Can I switch plans later?", a: "Absolutely. You can upgrade, downgrade, or cancel your Care Plan at any time with a 30-day notice." },
              { q: "What is the 48-hour setup guarantee?", a: "From the moment you complete your onboarding form and payment, our team will have your basic bot and reporting live within 48 business hours." },
              { q: "Is my data secure?", a: "Yes. We host your data on Indian servers (VPS) to comply with the DPDP Act 2023. Your client data never leaves the country." },
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-lg font-bold text-[var(--lime)]">Q: {item.q}</h4>
                <p className="text-[var(--text-secondary)]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
