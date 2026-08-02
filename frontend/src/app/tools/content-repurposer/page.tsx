"use client";

import React from "react";
import { Nav } from "@/components/sections/01-Nav";
import { ContentRepurposer } from "@/components/sections/06-ContentRepurposer";
import { Footer } from "@/components/sections/13-Footer";
import { SectionHeading } from "@/components/ui/SectionElements";
import { Badge } from "@/components/ui/FeedbackElements";

export default function ContentRepurposerPage() {
  return (
    <main className="pt-20">
      <Nav />
      <div className="py-24 bg-[var(--bg-void)]">
        <div className="container">
          <Badge variant="lime" className="mb-6">Tool: Content Repurposer</Badge>
          <SectionHeading
            headline="Turn one video into a month's worth of content."
            sub="Save 12+ hours every week by letting AI handle the heavy lifting of content creation."
            align="left"
            className="mb-12"
          />
        </div>
        <ContentRepurposer />
      </div>
      <Footer />
    </main>
  );
}
