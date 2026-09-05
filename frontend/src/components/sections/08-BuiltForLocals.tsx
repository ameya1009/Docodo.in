"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Scissors, 
  Sparkles, 
  Stethoscope, 
  Dumbbell, 
  Trophy, 
  GraduationCap, 
  HeartHandshake, 
  Wrench,
  ArrowRight,
  Check
} from "lucide-react";
import { VERTICALS } from "@/lib/constants";

export const BuiltForLocals = () => {
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

  return (
    <section id="solutions" className="py-24 bg-[var(--bg-void)] relative overflow-hidden">
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
            🎯 Tailored Workflows
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight mb-4">
            Built Specifically for Local Service Businesses
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            Because a pitch to a hair salon should not be identical to a dental clinic.
          </p>
        </div>

        {/* Vertical Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {VERTICALS.map((v, idx) => {
            const Icon = iconMap[v.icon] || Scissors;
            return (
              <motion.div
                key={v.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--lime)]/40 rounded-3xl flex flex-col justify-between group transition-all shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)] mb-1 font-display">
                    {v.name}
                  </h3>
                  <p className="text-xs font-mono text-[var(--lime)] mb-3">
                    {v.tagline}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    {v.desc}
                  </p>

                  <div className="space-y-1 mb-4">
                    {v.popularServices.map((srv, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                        <Check size={12} className="text-[var(--lime)] shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <Link
                    href={`/for/${v.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--lime)] hover:underline group-hover:translate-x-1 transition-transform"
                  >
                    View {v.name} Solutions <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
