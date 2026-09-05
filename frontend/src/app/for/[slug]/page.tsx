import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/01-Nav";
import { Setup15Min } from "@/components/sections/04-Setup15Min";
import { FAQSection } from "@/components/sections/11-FAQSection";
import { Footer } from "@/components/sections/13-Footer";
import { VERTICALS, WHATSAPP_LINK } from "@/lib/constants";
import { ArrowRight, CheckCircle2, Scissors, Sparkles, Stethoscope, Dumbbell, Trophy, GraduationCap, HeartHandshake, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const iconMap: Record<string, any> = {
  Scissors,
  Sparkles,
  Stethoscope,
  Dumbbell,
  Trophy,
  GraduationCap,
  HeartHandshake,
  Wrench,
};

export async function generateStaticParams() {
  return VERTICALS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vertical = VERTICALS.find((v) => v.slug === slug);
  if (!vertical) return { title: "Not Found" };

  return {
    title: `Docodo for ${vertical.name} | Online Booking & CRM Engine`,
    description: `${vertical.tagline}. ${vertical.desc}. Go live in 15 minutes with Docodo.`,
  };
}

export default async function VerticalPage({ params }: Props) {
  const { slug } = await params;
  const vertical = VERTICALS.find((v) => v.slug === slug);
  if (!vertical) notFound();

  const Icon = iconMap[vertical.icon] || Scissors;

  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen">
      <Nav />

      {/* Hero Section */}
      <section className="pt-32 pb-20 container text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 flex items-center justify-center mb-6 shadow-md">
            {Icon && <Icon className="w-8 h-8" />}
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-4 inline-block">
            Tailored for {vertical.name}
          </span>

          <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-display tracking-tight leading-[1.1] mb-6">
            Turn {vertical.name} Enquiries into Bookings in 15 Minutes
          </h1>

          <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-8">
            {vertical.desc} Stop losing clients to delayed WhatsApp replies.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="shadow-[var(--lime-glow-md)] font-bold text-base">
                Get My Business Online <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href={WHATSAPP_LINK(`Hi! I run a ${vertical.name} and want to set up Docodo.`)}>
              <Button variant="secondary" size="lg" className="text-base">
                Chat with Onboarding Specialist
              </Button>
            </Link>
          </div>

          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-2xl inline-flex items-center gap-3 text-xs font-mono text-[var(--lime)]">
            <span>✨ Result for Indian {vertical.name}:</span>
            <span className="font-bold text-[var(--text-primary)]">{vertical.stat}</span>
          </div>
        </div>
      </section>

      {/* Services Showcase Preview */}
      <section className="py-16 bg-[var(--bg-elevated)]/30 border-y border-[var(--border-subtle)]">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text-primary)]">
              Popular Pre-Configured Services for {vertical.name}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Ready to publish out of the box or customize in seconds.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {vertical.popularServices.map((service, idx) => (
              <div key={idx} className="p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">{service}</h3>
                    <p className="text-[11px] text-[var(--text-muted)]">Custom durations &amp; online payment ready</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--lime)]">Active</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15-Min Setup Promise */}
      <Setup15Min />

      {/* FAQ */}
      <FAQSection />

      <Footer />
    </main>
  );
}
