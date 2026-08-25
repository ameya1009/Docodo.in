"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Nav } from "@/components/sections/01-Nav";
import { Hero } from "@/components/sections/02-Hero";
import { PainPoints } from "@/components/sections/03-Pain";
import { Solution } from "@/components/sections/04-Solution";
import { useScrollReveal } from "@/hooks";

// Dynamically import below-the-fold sections to optimize initial load & mobile bundle
const WhatsAppDemo = dynamic(
  () => import("@/components/sections/05-WhatsAppDemo").then((mod) => mod.WhatsAppDemo),
  { ssr: true }
);
const ContentRepurposer = dynamic(
  () => import("@/components/sections/06-ContentRepurposer").then((mod) => mod.ContentRepurposer),
  { ssr: true }
);
const CarePlans = dynamic(
  () => import("@/components/sections/07-CarePlans").then((mod) => mod.CarePlans),
  { ssr: true }
);
const HowItWorks = dynamic(
  () => import("@/components/sections/08-HowItWorks").then((mod) => mod.HowItWorks),
  { ssr: true }
);
const CaseStudies = dynamic(
  () => import("@/components/sections/09-CaseStudies").then((mod) => mod.CaseStudies),
  { ssr: true }
);
const WhyDocodo = dynamic(
  () => import("@/components/sections/10-WhyDocodo").then((mod) => mod.WhyDocodo),
  { ssr: true }
);
const Audit = dynamic(
  () => import("@/components/sections/11-Audit").then((mod) => mod.Audit),
  { ssr: true }
);
const ContentHub = dynamic(
  () => import("@/components/sections/12-ContentHub").then((mod) => mod.ContentHub),
  { ssr: true }
);
const Footer = dynamic(
  () => import("@/components/sections/13-Footer").then((mod) => mod.Footer),
  { ssr: true }
);

export default function Home() {
  // Initialize GSAP Scroll Reveals
  useScrollReveal();

  return (
    <main className="relative bg-[var(--bg-void)] overflow-x-hidden">
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
