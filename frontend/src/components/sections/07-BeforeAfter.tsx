"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { BEFORE_AFTER } from "@/lib/constants";

export const BeforeAfter = () => {
  return (
    <section className="py-24 bg-[var(--bg-elevated)]/30 border-y border-[var(--border-subtle)] relative overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
            ⚖️ Transformation Matrix
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight mb-4">
            Before vs After Docodo
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            How your daily workflow changes the moment you launch your live booking storefront.
          </p>
        </div>

        {/* Comparison Columns Grid */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Left: BEFORE DOCODO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 bg-[var(--bg-surface)] border border-red-500/30 rounded-3xl space-y-6 relative shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
              <span className="font-display font-black text-xl text-red-400">
                ❌ BEFORE DOCODO
              </span>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                Manual Chaos
              </span>
            </div>

            <div className="space-y-4">
              {BEFORE_AFTER.before.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 shrink-0 mt-0.5">
                    <X size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{item.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-xs text-red-400 font-mono">
              Result: 10+ hours wasted weekly & 40% lost leads
            </div>
          </motion.div>

          {/* Right: AFTER DOCODO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 bg-[var(--bg-surface)] border border-[var(--lime)]/50 rounded-3xl space-y-6 relative shadow-[var(--lime-glow-sm)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--lime)]/30 pb-4">
              <span className="font-display font-black text-xl text-[var(--lime)]">
                ✅ AFTER DOCODO
              </span>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30">
                Automated Growth
              </span>
            </div>

            <div className="space-y-4">
              {BEFORE_AFTER.after.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--lime-ghost)] border border-[var(--lime)]/20">
                  <div className="p-1.5 rounded-lg bg-[var(--lime)] text-black shrink-0 mt-0.5 font-bold">
                    <Check size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{item.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-xs text-[var(--lime)] font-mono font-bold">
              Result: 100% automated booking capture & organized CRM
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
