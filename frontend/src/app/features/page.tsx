import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { FeatureMatrix } from "@/components/sections/06-FeatureMatrix";
import { BeforeAfter } from "@/components/sections/07-BeforeAfter";
import { TrustSecurity } from "@/components/sections/12-TrustSecurity";
import { Footer } from "@/components/sections/13-Footer";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | Docodo — Complete Operating System for Service Businesses",
  description: "Explore Docodo's 9 core features: dynamic booking pages, service catalogue, CRM, enquiry pipelines, WhatsApp integration, payments, and analytics.",
};

export default function FeaturesPage() {
  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen">
      <Nav />
      <div className="pt-28 pb-12 text-center container">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          Complete Feature Suite
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-display tracking-tight mb-4">
          Built for Everyday Business Operations
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Every tool you need to turn visitors into paying customers, manage appointments, and eliminate manual admin chaos.
        </p>
      </div>

      <FeatureMatrix />
      <BeforeAfter />
      <TrustSecurity />

      <section className="py-20 text-center container">
        <div className="max-w-3xl mx-auto p-10 bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-3xl shadow-[var(--lime-glow-sm)]">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-display mb-3">
            Experience All Features Live in 15 Minutes
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Get your own branded booking portal and dashboard ready today.
          </p>
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" className="font-bold">
              Start Free Trial <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
