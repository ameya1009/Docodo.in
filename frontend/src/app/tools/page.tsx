"use client";

import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { Footer } from "@/components/sections/13-Footer";
import { SectionHeading } from "@/components/ui/SectionElements";
import { Badge } from "@/components/ui/FeedbackElements";
import { MessageSquare, Video, ShieldCheck, Sparkles, ArrowRight, Zap, Calculator, Smartphone } from "lucide-react";

export default function ToolsPage() {
  const tools = [
    {
      id: "whatsapp-nurturer",
      title: "WhatsApp AI Speed-to-Lead Nurturer",
      badge: "Free Interactive Demo",
      description: "Replies to customer enquiries in 60 seconds 24/7. Handles pricing questions, slot bookings, and FAQs in English, Hindi, and Marathi.",
      icon: MessageSquare,
      stat: "40% fewer missed enquiries",
      href: "/tools/whatsapp-nurturer",
      cta: "Launch WhatsApp Bot Demo",
    },
    {
      id: "content-repurposer",
      title: "AI Video & Social Content Repurposer",
      badge: "Multi-Platform AI",
      description: "Transforms a single YouTube video or reel transcript into 13 high-engagement formats: LinkedIn posts, Instagram carousels, newsletters, and blogs.",
      icon: Video,
      stat: "12+ hours saved weekly",
      href: "/tools/content-repurposer",
      cta: "Try Content Repurposer",
    },
    {
      id: "business-audit",
      title: "Instant Business Website & Booking Diagnostic",
      badge: "Free Diagnostic",
      description: "Analyzes your Google Maps listing, website speed, WhatsApp friction, and review score to generate an instant growth audit report.",
      icon: ShieldCheck,
      stat: "10-second instant audit",
      href: "/audit",
      cta: "Run Business Audit",
    },
    {
      id: "live-demo",
      title: "Interactive Sandbox & Booking Flow",
      badge: "Full Sandbox",
      description: "Experience the complete merchant and customer workflow: appointment selection, slot reservation, and real-time dashboard notifications.",
      icon: Smartphone,
      stat: "15-minute setup verified",
      href: "/demo",
      cta: "Explore Interactive Demo",
    },
  ];

  return (
    <main className="pt-20 bg-[var(--bg-void)] min-h-screen text-white">
      <Nav />
      <div className="py-24">
        <div className="container">
          <Badge variant="lime" className="mb-6">The Docodo Growth Suite</Badge>
          <SectionHeading
            headline="Powerful growth tools for local service businesses."
            sub="Turn inquiries into bookings, automate customer follow-ups, and eliminate repetitive admin work without agency retainers."
            align="left"
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--lime)]/50 transition-all shadow-xl flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center border border-[var(--lime)]/30">
                        <Icon size={24} />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/20">
                        {tool.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-white group-hover:text-[var(--lime)] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                      <Sparkles size={12} /> {tool.stat}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[var(--border-subtle)]">
                    <Link
                      href={tool.href}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-elevated)] group-hover:bg-[var(--lime)] group-hover:text-black text-white font-bold text-xs transition-all border border-[var(--border-subtle)] group-hover:border-[var(--lime)]"
                    >
                      <span>{tool.cta}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
