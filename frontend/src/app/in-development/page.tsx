import React from "react";
import Link from "next/link";
import { ArrowLeft, Hammer, Sparkles, Home, Bell } from "lucide-react";

export const metadata = {
  title: "Under Active Development | Docodo",
  description: "This advanced feature is currently being crafted by the Docodo engineering team.",
};

export default function InDevelopmentPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-[var(--lime)]/10 rounded-full blur-3xl pointer-events-none -top-20 -right-20 animate-pulse" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--lime-ghost)] border border-[var(--lime)]/30 text-[var(--lime)] text-xs font-black uppercase tracking-wider font-mono">
          <Sparkles size={14} /> Active Sprint · In Development
        </div>

        <div className="w-20 h-20 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center mx-auto text-[var(--lime)] shadow-2xl">
          <Hammer size={36} className="animate-bounce" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            We&apos;re crafting this feature right now!
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Our team is building this AI growth tool to help Indian local businesses automate their operations and multiply their revenue.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--lime)] text-[var(--bg-void)] font-black text-sm hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-sm)] active:scale-95"
          >
            <Home size={16} /> Return to Dashboard
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-white font-bold text-sm hover:border-[var(--lime)]/50 transition-all active:scale-95"
          >
            <Bell size={16} /> Request Early Access
          </Link>
        </div>
      </div>
    </div>
  );
}
