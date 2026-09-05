import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { Setup15Min } from "@/components/sections/04-Setup15Min";
import { LiveInteractiveDemo } from "@/components/sections/05-LiveInteractiveDemo";
import { Footer } from "@/components/sections/13-Footer";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Docodo — Turn Enquiries into Bookings in 15 Mins",
  description: "Learn how Docodo gives local service businesses a live booking page, customer management, and simple automation in under 15 minutes.",
};

export default function HowItWorksPage() {
  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen">
      <Nav />
      <div className="pt-28 pb-12 text-center container">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          Step-by-Step Guide
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-display tracking-tight mb-4">
          How Docodo Works
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          From zero to accepting online bookings in under 15 minutes. No coding, no agency retainer, no technical headaches.
        </p>
      </div>

      <Setup15Min />
      <LiveInteractiveDemo />

      <section className="py-20 text-center container">
        <div className="max-w-3xl mx-auto p-10 bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-3xl shadow-[var(--lime-glow-sm)]">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-display mb-3">
            Start Your 15-Minute Setup Right Now
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Join our Pilot Program with ₹0 setup fee and get your business online today.
          </p>
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" className="font-bold">
              Get Started for Free <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
