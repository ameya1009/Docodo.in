"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Globe, Calendar, Users, Search, BarChart2, Sparkles, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";

const GENERATION_STEPS = [
  { id: 1, label: "Initializing persistent website configuration", icon: Globe },
  { id: 2, label: "Seeding service catalog & time slots in DB", icon: Calendar },
  { id: 3, label: "Registering CRM owner profile & lead engine", icon: Users },
  { id: 4, label: "Optimizing regional search SEO metadata", icon: Search },
  { id: 5, label: "Synthesizing AI marketing copywriting", icon: Sparkles },
  { id: 6, label: "Finalizing live production deployment", icon: BarChart2 },
];

export default function OnboardingStep4() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runRealLaunchSequence = async (isCancelled: () => boolean) => {
    if (!store.businessId) {
      setError("Missing active business record. Please complete step 1.");
      return;
    }

    setError(null);
    setCompletedSteps([]);
    setAllDone(false);

    try {
      const {
        launchStep1_Website,
        launchStep2_BookingSystem,
        launchStep3_CRM,
        launchStep4_SEOMetadata,
        launchStep5_AIContent,
        launchStep6_Analytics,
      } = await import("@/lib/actions/onboarding");

      // Execute Step 1: Website Config
      setCurrentStep(1);
      await launchStep1_Website(store.businessId);
      if (isCancelled()) return;
      setCompletedSteps((prev) => [...prev, 1]);

      // Execute Step 2: Booking System & Services Seeder
      setCurrentStep(2);
      await launchStep2_BookingSystem(store.businessId);
      if (isCancelled()) return;
      setCompletedSteps((prev) => [...prev, 2]);

      // Execute Step 3: CRM Engine Initialization
      setCurrentStep(3);
      await launchStep3_CRM(store.businessId);
      if (isCancelled()) return;
      setCompletedSteps((prev) => [...prev, 3]);

      // Execute Step 4: SEO Metadata Creation
      setCurrentStep(4);
      await launchStep4_SEOMetadata(store.businessId);
      if (isCancelled()) return;
      setCompletedSteps((prev) => [...prev, 4]);

      // Execute Step 5: AI Marketing Synthesis
      setCurrentStep(5);
      await launchStep5_AIContent(store.businessId);
      if (isCancelled()) return;
      setCompletedSteps((prev) => [...prev, 5]);

      // Execute Step 6: Finalize & Publish
      setCurrentStep(6);
      await launchStep6_Analytics(store.businessId);
      if (isCancelled()) return;
      setCompletedSteps((prev) => [...prev, 6]);

      setAllDone(true);
    } catch (err: any) {
      if (isCancelled()) return;
      console.error("Real launch sequence failure:", err);
      setError(err.message || "An error occurred while configuring your business in the database.");
    }
  };

  useEffect(() => {
    let cancelled = false;
    runRealLaunchSequence(() => cancelled);
    return () => { cancelled = true; };
  }, [store.businessId]);

  const handleGoToDashboard = () => {
    startTransition(() => {
      store.reset();
      router.push("/dashboard");
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
          {allDone ? "Your business is live! 🎉" : error ? "Launch Interrupted" : "Executing Real-Time Business Launch..."}
        </h1>
        <p className="text-[var(--text-secondary)]">
          {allDone
            ? `${store.name || "Your business"} is ready to receive real bookings online.`
            : error
            ? "We encountered a database error during configuration."
            : "Communicating with PostgreSQL database and Gemini AI hub in real-time..."}
        </p>
      </motion.div>

      {/* Real-Time Database Progression Box */}
      <div className="glass rounded-2xl p-8 border border-[var(--border-default)] mb-8 text-left">
        {error && (
          <div className="p-4 bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-xl mb-6 text-[var(--danger)] text-sm flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Configuration Failed</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{error}</p>
              <button
                onClick={() => runRealLaunchSequence(() => false)}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--danger)] text-[var(--bg-void)] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                <RefreshCw size={13} /> Retry Real Sequence
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {GENERATION_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isComplete = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id && !isComplete && !error;
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
                    ✓ Verified DB
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Real Progress Bar */}
        <div className="mt-8 h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--lime)] rounded-full"
            animate={{ width: `${(completedSteps.length / GENERATION_STEPS.length) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2 text-right">
          {completedSteps.length}/{GENERATION_STEPS.length} DB steps confirmed
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
              Your live production booking engine is verified at{" "}
              <span className="text-[var(--lime)] font-mono">docodo.in/book/{store.slug || "your-business"}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
