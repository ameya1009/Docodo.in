"use client";

import React from "react";
import { Nav } from "@/components/sections/01-Nav";
import { CaseStudies as CaseStudiesSection } from "@/components/sections/09-CaseStudies";
import { Footer } from "@/components/sections/13-Footer";
import { SectionHeading } from "@/components/ui/SectionElements";
import { Badge } from "@/components/ui/FeedbackElements";

export default function CaseStudiesPage() {
  return (
    <main className="pt-20">
      <Nav />
      <div className="py-24 bg-[var(--bg-void)]">
        <div className="container">
          <Badge variant="lime" className="mb-6">Our Impact</Badge>
          <SectionHeading
            headline="Real stories. Real results."
            sub="See how Pune businesses are transforming their operations and scaling revenue with the Docodo Growth OS."
            align="left"
            className="mb-12"
          />
        </div>
        <CaseStudiesSection />
      </div>
      <Footer />
    </main>
  );
}
