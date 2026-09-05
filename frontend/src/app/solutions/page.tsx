import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { BuiltForLocals } from "@/components/sections/08-BuiltForLocals";
import { Setup15Min } from "@/components/sections/04-Setup15Min";
import { Footer } from "@/components/sections/13-Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industry Solutions | Docodo — Built for Salons, Spas, Clinics & Gyms",
  description: "Discover tailored booking and CRM solutions for Salons, Clinics, Spas, Gyms, Trainers, Tutors, and Local Service Businesses.",
};

export default function SolutionsPage() {
  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen">
      <Nav />
      <div className="pt-28 pb-12 text-center container">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          Tailored by Industry
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-display tracking-tight mb-4">
          Solutions for Every Service Vertical
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Every industry has unique scheduling needs. Choose your vertical to see how Docodo customizes your workflow.
        </p>
      </div>

      <BuiltForLocals />
      <Setup15Min />
      <Footer />
    </main>
  );
}
