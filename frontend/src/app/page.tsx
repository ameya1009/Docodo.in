"use client";

import React from "react";
import { Nav } from "@/components/sections/01-Nav";
import { Hero } from "@/components/sections/02-Hero";
import { PainPoints } from "@/components/sections/03-Pain";
import { Solution } from "@/components/sections/04-Solution";
import { WhatsAppDemo } from "@/components/sections/05-WhatsAppDemo";
import { ContentRepurposer } from "@/components/sections/06-ContentRepurposer";
import { CarePlans } from "@/components/sections/07-CarePlans";
import { HowItWorks } from "@/components/sections/08-HowItWorks";
import { CaseStudies } from "@/components/sections/09-CaseStudies";
import { WhyDocodo } from "@/components/sections/10-WhyDocodo";
import { Audit } from "@/components/sections/11-Audit";
import { ContentHub } from "@/components/sections/12-ContentHub";
import { Footer } from "@/components/sections/13-Footer";
import { useScrollReveal } from "@/hooks";

export default function Home() {
  // Initialize GSAP Scroll Reveals
  useScrollReveal();

  return (
    <main className="relative bg-[var(--bg-void)]">
      <Nav />
      <Hero />
      <PainPoints />
      <Solution />
      <WhatsAppDemo />
      <ContentRepurposer />
      <CarePlans />
      <HowItWorks />
      <CaseStudies />
      <WhyDocodo />
      <Audit />
      <ContentHub />
      <Footer />
    </main>
  );
}
