"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Palette, Brush, Sparkles } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";

const STEPS = [
  { id: 1, label: "Business Info", icon: Building2 },
  { id: 2, label: "Style", icon: Palette },
  { id: 3, label: "Theme", icon: Brush },
  { id: 4, label: "Generating", icon: Sparkles },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { step } = useOnboardingStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex flex-col">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-deep)] border-b border-[var(--border-subtle)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-black text-[var(--lime)] font-display">Docodo</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">Step {step} of 4</span>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isComplete = step > s.id;
              const isCurrent = step === s.id;
              return (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isComplete
                          ? "bg-[var(--lime)] text-[var(--bg-void)]"
                          : isCurrent
                          ? "bg-[var(--lime)]/20 border-2 border-[var(--lime)] text-[var(--lime)]"
                          : "bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)]"
                      }`}
                    >
                      {isComplete ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <Icon size={14} />
                      )}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block ${isCurrent ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px transition-colors duration-500 ${step > s.id ? "bg-[var(--lime)]" : "bg-[var(--border-subtle)]"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Overall progress bar */}
        <motion.div
          className="h-0.5 bg-[var(--lime)] origin-left"
          animate={{ scaleX: step / 4 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center pt-32 pb-16 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
