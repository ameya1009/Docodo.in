import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { LiveInteractiveDemo } from "@/components/sections/05-LiveInteractiveDemo";
import { Setup15Min } from "@/components/sections/04-Setup15Min";
import { ClinicWalkthroughForm } from "@/components/sections/ClinicWalkthroughForm";
import { Footer } from "@/components/sections/13-Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Clinic Demo & Walkthrough | Docodo Practice Management",
  description: "Test the live Docodo doctor setup, patient appointment booking interface, and request an immediate live clinic walkthrough callback.",
};

export default function DemoPage() {
  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen">
      <Nav />
      <div className="pt-28 pb-6 text-center container">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          Interactive Clinic Sandbox
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-display tracking-tight mb-4">
          Experience Docodo Firsthand
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Simulate managing OPD slots as a doctor, booking an appointment as a patient, and receiving instant WhatsApp token alerts.
        </p>
      </div>

      {/* Live Walkthrough Request Form for Doctors */}
      <ClinicWalkthroughForm />

      <LiveInteractiveDemo />
      <Setup15Min />
      <Footer />
    </main>
  );
}
