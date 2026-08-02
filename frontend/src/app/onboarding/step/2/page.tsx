"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";
import { saveBusinessStyle } from "@/lib/actions/onboarding";
import { cn } from "@/lib/utils";

const STYLES = [
  {
    id: "modern",
    label: "Modern",
    description: "Clean lines, bold typography, contemporary",
    preview: { bg: "#0F172A", accent: "#3B82F6", text: "#F8FAFC" },
  },
  {
    id: "luxury",
    label: "Luxury",
    description: "Elegant, dark, gold accents — premium feel",
    preview: { bg: "#1C1A14", accent: "#D4A84B", text: "#F5F0E8" },
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "White space, simplicity, zero clutter",
    preview: { bg: "#FFFFFF", accent: "#111111", text: "#333333" },
  },
  {
    id: "elegant",
    label: "Elegant",
    description: "Soft, feminine, warm tones, lifestyle feel",
    preview: { bg: "#FDF8F4", accent: "#C9857F", text: "#4A3728" },
  },
  {
    id: "premium",
    label: "Premium",
    description: "Dark navy, subtle gradients, sophisticated",
    preview: { bg: "#0A1628", accent: "#6C9FFF", text: "#E8EDF5" },
  },
  {
    id: "classic",
    label: "Classic",
    description: "Timeless, trusted, warm and professional",
    preview: { bg: "#F9F7F4", accent: "#2D6A2F", text: "#1A1A1A" },
  },
];

export default function OnboardingStep2() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [isPending, startTransition] = useTransition();

  const selectedStyle = store.style;

  const handleContinue = () => {
    if (!store.businessId) return;
    startTransition(async () => {
      await saveBusinessStyle(store.businessId!, selectedStyle);
      store.setStep(3);
      router.push("/onboarding/step/3");
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[var(--text-primary)] mb-2">Choose your style</h1>
        <p className="text-sm text-[var(--text-secondary)]">This sets the visual personality of your website. You can change it later.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STYLES.map((s) => {
          const isSelected = selectedStyle === s.id;
          return (
            <motion.button
              key={s.id}
              onClick={() => store.setField("style", s.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative text-left rounded-2xl overflow-hidden border-2 transition-all duration-200",
                isSelected
                  ? "border-[var(--lime)] shadow-[var(--lime-glow-sm)]"
                  : "border-[var(--border-default)] hover:border-[var(--border-strong)]"
              )}
            >
              {/* Preview swatch */}
              <div
                className="h-28 w-full flex flex-col p-4 gap-2"
                style={{ backgroundColor: s.preview.bg }}
              >
                <div className="flex gap-2">
                  <div className="h-2 w-16 rounded-full" style={{ backgroundColor: s.preview.accent }} />
                  <div className="h-2 w-8 rounded-full opacity-40" style={{ backgroundColor: s.preview.text }} />
                </div>
                <div className="h-3 w-full rounded-full opacity-20" style={{ backgroundColor: s.preview.text }} />
                <div className="h-3 w-3/4 rounded-full opacity-20" style={{ backgroundColor: s.preview.text }} />
                <div className="mt-auto">
                  <div className="h-6 w-20 rounded-lg" style={{ backgroundColor: s.preview.accent }} />
                </div>
              </div>

              {/* Label */}
              <div className="p-4 bg-[var(--bg-surface)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-[var(--text-primary)]">{s.label}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--lime)] flex items-center justify-center">
                      <svg className="w-3 h-3 text-[var(--bg-void)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)]">{s.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => { store.setStep(1); router.push("/onboarding/step/1"); }}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-all text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={handleContinue}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-all disabled:opacity-60 shadow-[var(--lime-glow-md)]"
        >
          {isPending ? (<><Loader2 size={16} className="animate-spin" /> Saving...</>) : (<>Continue to Theme <ArrowRight size={16} /></>)}
        </button>
      </div>
    </div>
  );
}
