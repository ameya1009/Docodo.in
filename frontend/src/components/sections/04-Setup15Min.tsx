"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Clock, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SETUP_STEPS } from "@/lib/constants";

export const Setup15Min = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[var(--bg-void)] relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[var(--lime)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
            ⚡ Ultra-Fast Deployment
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight mb-4">
            The 15-Minute Setup Promise
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            No technical skills, no agency fees, and no waiting weeks. Go live today in 5 simple steps.
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-16">
          {SETUP_STEPS.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--lime)]/40 rounded-2xl flex flex-col justify-between relative group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-[var(--lime)]">
                    {s.step}
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {s.time}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[var(--text-primary)] mb-2 font-display">
                  {s.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-1 text-[11px] text-[var(--lime)] font-mono">
                <Check size={14} /> Ready in minutes
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="max-w-3xl mx-auto p-8 bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-3xl text-center shadow-[var(--lime-glow-sm)]">
          <h3 className="text-2xl font-black text-[var(--text-primary)] font-display mb-2">
            Ready to accept bookings online today?
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-xl mx-auto">
            Create your business profile, add your services, and receive your live booking link in under 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="shadow-[var(--lime-glow-md)] font-bold text-base">
                Get My Business Online <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary" size="lg">
                Try Interactive Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
