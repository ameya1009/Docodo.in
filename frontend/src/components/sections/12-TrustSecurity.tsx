"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Server, Lock, CheckCircle2 } from "lucide-react";
import { TRUST_SECURITY } from "@/lib/constants";

export const TrustSecurity = () => {
  const iconMap: Record<string, any> = {
    ShieldCheck,
    Server,
    Lock,
    CheckCircle2,
  };

  return (
    <section className="py-20 bg-[var(--bg-void)] relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
            🛡️ Enterprise-Grade Foundation
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-[var(--text-primary)] tracking-tight mb-3">
            Your Business & Customer Data Stays 100% Protected
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            We only claim security measures and data protections that are actively implemented in our codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_SECURITY.map((item, idx) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center mb-4">
                    {Icon && <Icon className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-2 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--lime)]">
                  ✓ Verified Implementation
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
