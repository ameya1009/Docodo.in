"use client";

import React from "react";
import { Nav } from "@/components/sections/01-Nav";
import { Audit as AuditSection } from "@/components/sections/11-Audit";
import { Footer } from "@/components/sections/13-Footer";
import { SectionHeading } from "@/components/ui/SectionElements";
import { Badge } from "@/components/ui/FeedbackElements";

export default function AuditPage() {
  return (
    <main className="pt-20">
      <Nav />
      <div className="py-24 bg-[var(--bg-void)]">
        <div className="container">
          <Badge variant="lime" className="mb-6">Free 50-Point Audit</Badge>
          <SectionHeading
            headline="Stop guessing. Start growing."
            sub="Our comprehensive audit covers your WhatsApp, SEO, and social presence to find hidden revenue leaks."
            align="left"
            className="mb-12"
          />
        </div>
        <AuditSection />

        <section className="py-24 bg-[var(--bg-deep)]">
          <div className="container max-w-4xl">
            <h3 className="text-3xl font-black mb-12 text-center">What we audit (50 Checkpoints)</h3>
            <div className="grid md:grid-cols-2 gap-12">
              {[
                { 
                  title: "WhatsApp & Leads", 
                  items: ["Average reply time", "Drip sequence quality", "Hinglish naturalness", "CRM logging efficiency", "Contact card optimization"] 
                },
                { 
                  title: "Google & SEO", 
                  items: ["GBP post frequency", "Review velocity", "Local keyword rankings", "Backlink quality", "NAP consistency"] 
                },
                { 
                  title: "Social Presence", 
                  items: ["Instagram DM automation", "Bio-to-lead conversion", "Content consistency", "Comment reply rate", "Call-to-action effectiveness"] 
                },
                { 
                  title: "Systems & ROI", 
                  items: ["Manual work overhead", "Lead-to-sale tracking", "Weekly reporting accuracy", "Customer retention flows", "Payment automation"] 
                }
              ].map((group, i) => (
                <div key={i} className="p-8 bg-[var(--bg-surface)] border border-white/5 rounded-xl">
                  <h4 className="text-[var(--lime)] font-bold mb-4 uppercase tracking-widest">{group.title}</h4>
                  <ul className="space-y-3">
                    {group.items.map((item, j) => (
                      <li key={j} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[var(--lime)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
