"use client";

import React from "react";
import { Nav } from "@/components/sections/01-Nav";
import { WhatsAppDemo } from "@/components/sections/05-WhatsAppDemo";
import { Footer } from "@/components/sections/13-Footer";
import { SectionHeading } from "@/components/ui/SectionElements";
import { Badge } from "@/components/ui/FeedbackElements";

export default function WhatsAppNurturerPage() {
  return (
    <main className="pt-20">
      <Nav />
      <div className="py-24 bg-[var(--bg-void)]">
        <div className="container">
          <Badge variant="lime" className="mb-6">Tool: WhatsApp AI Nurturer</Badge>
          <SectionHeading
            headline="Your business never sleeps. Your bot shouldn't either."
            sub="Scale your response time to 60 seconds and never miss a lead again. Even at 3am."
            align="left"
            className="mb-12"
          />
        </div>
        <WhatsAppDemo />
      </div>
      <Footer />
    </main>
  );
}
