import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Calendar, Compass, Sparkles } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | Docodo",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute w-96 h-96 bg-[var(--lime)]/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--lime-ghost)] border border-[var(--lime)]/30 text-[var(--lime)] text-xs font-black uppercase tracking-wider font-mono">
          <Sparkles size={14} /> Error 404 · Destination Lost
        </div>

        <h1 className="text-8xl sm:text-9xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-[var(--text-muted)] tracking-tighter">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white font-display">
            Looks like this appointment got cancelled!
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The page you are looking for might have been moved, renamed, or never existed in the first place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--lime)] text-[var(--bg-void)] font-black text-sm hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-sm)] active:scale-95"
          >
            <Home size={16} /> Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-white font-bold text-sm hover:border-[var(--lime)]/50 transition-all active:scale-95"
          >
            <Calendar size={16} /> Open Dashboard
          </Link>
        </div>

        {/* Explore Links */}
        <div className="pt-8 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)] space-y-2">
          <p className="font-semibold text-[var(--text-secondary)]">Helpful destinations:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/book/docodo-wellness-mumbai" className="hover:text-[var(--lime)] underline transition-colors">Sample Booking Page</Link>
            <span>·</span>
            <Link href="/tools" className="hover:text-[var(--lime)] underline transition-colors">Free AI Growth Tools</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-[var(--lime)] underline transition-colors">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
