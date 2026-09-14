import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { Footer } from "@/components/sections/13-Footer";
import { DOCODO_INTEGRATIONS_REGISTRY } from "@/lib/integrations/connector-sdk";
import { ArrowRight, CheckCircle2, Cable, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations & Connectors | Docodo Business OS",
  description: "Connect Docodo with WhatsApp, Razorpay, Google Calendar, Google Reviews, and Resend Email.",
};

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-void)] text-white">
      <Nav />

      {/* Hero */}
      <div className="pt-32 pb-12 text-center container max-w-4xl mx-auto px-4">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          🔌 Seamless Ecosystem
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white mb-4">
          Connect Your Favorite Tools
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          High-value, verified connectors for WhatsApp, Razorpay, Google Workspace, and AI models. Standardized connector SDK with zero bloat.
        </p>
      </div>

      {/* Connectors Grid */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOCODO_INTEGRATIONS_REGISTRY.map((conn) => (
            <div
              key={conn.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--lime)]/50 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all group shadow-xl"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {conn.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {conn.status}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-white font-display mt-3 flex items-center gap-2">
                  <Cable size={18} className="text-[var(--lime)]" /> {conn.name}
                </h3>

                {/* Triggers & Actions */}
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
                      Supported Triggers:
                    </span>
                    <div className="mt-1 space-y-1">
                      {conn.triggers.map((t) => (
                        <div key={t.id} className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)]" />
                          <strong className="text-white">{t.name}:</strong> {t.description}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
                      Supported Actions:
                    </span>
                    <div className="mt-1 space-y-1">
                      {conn.actions.map((a) => (
                        <div key={a.id} className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <strong className="text-white">{a.name}:</strong> {a.description}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Auth: {conn.authType}
                </span>
                <Link
                  href={conn.docUrl}
                  className="text-xs font-bold text-[var(--lime)] group-hover:underline flex items-center gap-1"
                >
                  Manage Connector <ArrowRight size={12} />
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
