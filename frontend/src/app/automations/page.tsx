import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { Footer } from "@/components/sections/13-Footer";
import { PREBUILT_AUTOMATION_TEMPLATES } from "@/lib/automations/automation-engine";
import { ArrowRight, Zap, CheckCircle2, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automations Library | Docodo — Ready-to-Run Business Workflows",
  description: "Browse pre-built automation workflows for salons, clinics, gyms, and local services. Instant 1-click install.",
};

export default function AutomationsDirectoryPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-void)] text-white">
      <Nav />

      {/* Header */}
      <div className="pt-32 pb-12 text-center container max-w-4xl mx-auto px-4">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          ⚡ Ready-to-Run Workflows
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white mb-4">
          Your Business Should Run Itself.
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Pre-built customer journeys, WhatsApp reminders, review collection, and reactivation sequences built specifically for Indian local businesses.
        </p>

        <div className="pt-6 flex justify-center gap-3">
          <Link
            href="/onboarding"
            className="px-6 py-3 bg-[var(--lime)] text-black font-bold rounded-xl text-sm shadow-[var(--lime-glow-md)] hover:opacity-95 transition-all flex items-center gap-2"
          >
            Launch Free in 15 Mins <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard/automations"
            className="px-6 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] text-white font-semibold rounded-xl text-sm hover:border-[var(--lime)]/50 transition-all"
          >
            Explore Dashboard Hub
          </Link>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREBUILT_AUTOMATION_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--lime)]/50 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all group shadow-xl"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {tmpl.category}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    ✓ {tmpl.metrics.successRate}% Success
                  </span>
                </div>

                <h3 className="font-bold text-lg text-white font-display mt-3">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Flow Diagram */}
                <div className="mt-5 p-3.5 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-2 text-xs">
                  <div className="text-[10px] font-mono font-bold uppercase text-[var(--lime)]">
                    Trigger: {tmpl.trigger}
                  </div>
                  <div className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                    {tmpl.actions.map((act, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-[var(--lime)] shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  {tmpl.metrics.runsCount} live runs
                </span>
                <Link
                  href="/auth/signup"
                  className="text-xs font-bold text-[var(--lime)] group-hover:underline flex items-center gap-1"
                >
                  Activate in 1-Click <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
