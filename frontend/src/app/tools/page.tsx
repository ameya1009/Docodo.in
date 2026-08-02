"use client";

import React from "react";
import { Nav } from "@/components/sections/01-Nav";
import { Solution as SolutionSection } from "@/components/sections/04-Solution";
import { Footer } from "@/components/sections/13-Footer";
import { SectionHeading } from "@/components/ui/SectionElements";
import { Badge } from "@/components/ui/FeedbackElements";

export default function ToolsPage() {
  return (
    <main className="pt-20">
      <Nav />
      <div className="py-24 bg-[var(--bg-void)]">
        <div className="container">
          <Badge variant="lime" className="mb-6">The Docodo Stack</Badge>
          <SectionHeading
            headline="Powerful tools for the modern Pune founder."
            sub="From WhatsApp automation to content repurposing, we've built the OS for your business growth."
            align="left"
            className="mb-12"
          />
        </div>
        <SolutionSection />
      </div>
      <Footer />
    </main>
  );
}
