"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Globe, 
  ListOrdered, 
  CalendarCheck, 
  Users, 
  GitBranch, 
  MessageSquare, 
  Clock, 
  CreditCard, 
  BarChart3, 
  Check, 
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { FEATURES } from "@/lib/constants";

export const FeatureMatrix = () => {
  const iconMap: Record<string, any> = {
    "booking-page": Globe,
    "service-catalogue": ListOrdered,
    "booking-management": CalendarCheck,
    "crm-database": Users,
    "enquiry-pipeline": GitBranch,
    "whatsapp-engine": MessageSquare,
    "followup-automation": Clock,
    "payments-cod": CreditCard,
    "growth-analytics": BarChart3,
  };

  return (
    <section id="features" className="py-24 bg-[var(--bg-void)] relative overflow-hidden">
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
            🛠️ Product Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight mb-4">
            Everything You Need to Run Your Service Business
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            Built ground-up for Indian clinics, salons, gyms, tutors, and local service professionals.
          </p>
        </div>

        {/* 9 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {FEATURES.map((f, idx) => {
            const Icon = iconMap[f.id] || Globe;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--lime)]/40 rounded-3xl flex flex-col justify-between group transition-all shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {Icon && <Icon className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {f.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-[var(--lime)] uppercase font-bold tracking-wider block mb-1">
                    {f.category}
                  </span>
                  <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2 font-display">
                    {f.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    {f.desc}
                  </p>

                  {f.urlExample && (
                    <div className="p-2 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-muted)] mb-4 flex items-center justify-between">
                      <span className="truncate">{f.urlExample}</span>
                      <ExternalLink size={12} className="text-[var(--lime)] shrink-0" />
                    </div>
                  )}

                  {f.pipeline && (
                    <div className="flex items-center gap-1.5 p-2 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] mb-4 overflow-x-auto">
                      {f.pipeline.map((p, pIdx) => (
                        <React.Fragment key={p}>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            p === "BOOKED" ? "bg-emerald-500/20 text-emerald-400" : "text-[var(--text-secondary)]"
                          }`}>
                            {p}
                          </span>
                          {pIdx < f.pipeline.length - 1 && <span className="text-[10px] text-[var(--text-muted)]">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-1.5">
                  {f.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <Check size={13} className="text-[var(--lime)] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
