import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { BuiltForLocals } from "@/components/sections/08-BuiltForLocals";
import { Setup15Min } from "@/components/sections/04-Setup15Min";
import { Footer } from "@/components/sections/13-Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Practice Solutions | Docodo — Outpatient Clinics & Doctors",
  description: "Discover tailored appointment scheduling and patient communication solutions for dental, dermatology, pediatric, orthopedic, and outpatient clinics.",
};

export default function SolutionsPage() {
  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen">
      <Nav />
      <div className="pt-28 pb-12 text-center container">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          Tailored for Healthcare
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-display tracking-tight mb-4">
          Solutions for Clinical Practices
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Every medical specialty has unique scheduling needs. Choose your specialty to see how Docodo streamlines your OPD queue and patient communication.
        </p>
      </div>

      <BuiltForLocals />
      <Setup15Min />
      <Footer />
    </main>
  );
}
