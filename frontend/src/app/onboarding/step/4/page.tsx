"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Globe, Calendar, Users, Search, BarChart2, Sparkles, ArrowRight } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";
import { completeOnboarding } from "@/lib/actions/onboarding";

const GENERATION_STEPS = [
  { id: 1, label: "Creating your website", icon: Globe, duration: 1500 },
  { id: 2, label: "Setting up booking system", icon: Calendar, duration: 2000 },
  { id: 3, label: "Building your CRM", icon: Users, duration: 1500 },
  { id: 4, label: "Generating SEO metadata", icon: Search, duration: 1000 },
  { id: 5, label: "Writing AI content", icon: Sparkles, duration: 2500 },
  { id: 6, label: "Configuring analytics", icon: BarChart2, duration: 1000 },
];

export default function OnboardingStep4() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cumulativeDelay = 800;
    GENERATION_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setCurrentStep(i + 1);
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, step.id]);
          if (i === GENERATION_STEPS.length - 1) {
            setTimeout(() => setAllDone(true), 600);
          }
        }, step.duration);
      }, cumulativeDelay);
      cumulativeDelay += step.duration + 400;
    });
  }, []);

  const handleGoToDashboard = () => {
    if (!store.businessId) return;
    startTransition(async () => {
      try {
        await completeOnboarding(store.businessId!);
        store.reset();
        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="text-center">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--lime-ghost)] text-[var(--lime)] mb-6">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-3">
          {allDone ? "Your business is live! 🎉" : "Building your AI business..."}
        </h1>
        <p className="text-[var(--text-secondary)]">
          {allDone
            ? `${store.name} is ready to receive bookings.`
            : "AI is setting everything up. This takes about 15 seconds."}
        </p>
      </motion.div>

      {/* Steps */}
      <div className="glass rounded-2xl p-8 border border-[var(--border-default)] mb-8 text-left">
        <div className="space-y-4">
          {GENERATION_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isComplete = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id && !isComplete;
            const isPending = currentStep < step.id;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    isComplete
                      ? "bg-[var(--success)]/20 text-[var(--success)]"
                      : isCurrent
                      ? "bg-[var(--lime-ghost)] text-[var(--lime)]"
                      : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 size={18} />
                  ) : isCurrent ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>
                <span
                  className={`font-semibold text-sm transition-colors ${
                    isComplete
                      ? "text-[var(--success)]"
                      : isCurrent
                      ? "text-[var(--lime)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {step.label}
                </span>
                {isComplete && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto text-xs font-bold text-[var(--success)]"
                  >
                    ✓ Done
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--lime)] rounded-full"
            animate={{ width: `${(completedSteps.length / GENERATION_STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2 text-right">
          {completedSteps.length}/{GENERATION_STEPS.length} complete
        </p>
      </div>

      {/* Success CTA */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={handleGoToDashboard}
              disabled={isPending}
              className="w-full py-4 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-60 shadow-[var(--lime-glow-lg)]"
            >
              {isPending ? (
                <><Loader2 size={20} className="animate-spin" /> Opening Dashboard...</>
              ) : (
                <>Open My Dashboard <ArrowRight size={20} /></>
              )}
            </button>
            <p className="text-sm text-[var(--text-muted)] mt-4">
              Your booking page is live at{" "}
              <span className="text-[var(--lime)] font-mono">docodo.in/book/{store.slug || "your-business"}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
