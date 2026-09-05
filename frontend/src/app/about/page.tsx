import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { TrustSecurity } from "@/components/sections/12-TrustSecurity";
import { CustomerProof } from "@/components/sections/10-CustomerProof";
import { Footer } from "@/components/sections/13-Footer";
import { ArrowRight, Target, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Docodo | Our Mission for Indian Local Businesses",
  description: "Learn why we built Docodo to help Indian service businesses transition from WhatsApp and notebook chaos to automated online bookings in 15 minutes.",
};

export default function AboutPage() {
  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen">
      <Nav />
      <div className="pt-28 pb-16 text-center container">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          Our Story &amp; Mission
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-display tracking-tight mb-6">
          Empowering India's Local Service Economy
        </h1>
        <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
          We built Docodo with one clear objective: give local salons, clinics, gyms, and service professionals an enterprise-grade booking and CRM engine that takes less than 15 minutes to set up.
        </p>
      </div>

      <section className="py-16 container">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center">
              <Target size={24} />
            </div>
            <h3 className="font-bold text-2xl text-[var(--text-primary)] font-display">
              The Real Local Problem
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Every day, thousands of Indian service business owners lose 30–40% of their enquiries because they're busy attending to a client when a WhatsApp or Instagram DM arrives. Existing SaaS tools are either overpriced, overly complex, or built for Western enterprises.
            </p>
          </div>

          <div className="p-8 bg-[var(--bg-surface)] border border-[var(--lime)]/40 rounded-3xl space-y-4 shadow-[var(--lime-glow-sm)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--lime)] text-black flex items-center justify-center font-bold">
              <Sparkles size={24} />
            </div>
            <h3 className="font-bold text-2xl text-[var(--text-primary)] font-display">
              The Docodo Solution
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Docodo replaces notebook chaos and delayed WhatsApp replies with a live booking link (docodo.in/book/your-business), automated slot blocking, WhatsApp reminders, and an organized customer database—hosted securely on Indian infrastructure.
            </p>
          </div>
        </div>
      </section>

      <CustomerProof />
      <TrustSecurity />
      <Footer />
    </main>
  );
}
