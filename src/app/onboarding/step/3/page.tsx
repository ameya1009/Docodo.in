"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";
import { saveBusinessTheme } from "@/lib/actions/onboarding";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  { label: "Ocean Blue", primary: "#2563EB", accent: "#06B6D4" },
  { label: "Emerald", primary: "#059669", accent: "#10B981" },
  { label: "Purple", primary: "#7C3AED", accent: "#A78BFA" },
  { label: "Rose", primary: "#E11D48", accent: "#FB7185" },
  { label: "Amber", primary: "#D97706", accent: "#FCD34D" },
  { label: "Slate", primary: "#334155", accent: "#64748B" },
];

const FONT_PAIRS = [
  { label: "Inter + Inter", heading: "Inter", body: "Inter", preview: "Aa" },
  { label: "Playfair + Lato", heading: "Playfair Display", body: "Lato", preview: "Aa" },
  { label: "Poppins + Open Sans", heading: "Poppins", body: "Open Sans", preview: "Aa" },
  { label: "Montserrat + Nunito", heading: "Montserrat", body: "Nunito", preview: "Aa" },
];

export default function OnboardingStep3() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [isPending, startTransition] = useTransition();

  const handleContinue = () => {
    if (!store.businessId) return;
    startTransition(async () => {
      await saveBusinessTheme(store.businessId!, {
        primaryColor: store.primaryColor,
        accentColor: store.accentColor,
        fontHeading: store.fontHeading,
        fontBody: store.fontBody,
        darkMode: store.darkMode,
      });
      store.setStep(4);
      router.push("/onboarding/step/4");
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[var(--text-primary)] mb-2">Customise your theme</h1>
        <p className="text-sm text-[var(--text-secondary)]">Choose colours and fonts that match your brand identity.</p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Color Presets */}
        <div className="glass rounded-2xl p-6 border border-[var(--border-default)]">
          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Brand Colors</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
            {PRESET_COLORS.map((c) => {
              const isSelected = store.primaryColor === c.primary;
              return (
                <button
                  key={c.label}
                  onClick={() => { store.setField("primaryColor", c.primary); store.setField("accentColor", c.accent); }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all",
                    isSelected ? "border-[var(--lime)]" : "border-transparent hover:border-[var(--border-strong)]"
                  )}
                >
                  <div className="flex gap-1">
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: c.primary }} />
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: c.accent }} />
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] text-center leading-tight">{c.label}</span>
                </button>
              );
            })}
          </div>
          {/* Custom colour input */}
          <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Custom Primary</label>
              <input
                type="color"
                value={store.primaryColor}
                onChange={(e) => store.setField("primaryColor", e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-[var(--border-default)] bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Accent</label>
              <input
                type="color"
                value={store.accentColor}
                onChange={(e) => store.setField("accentColor", e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-[var(--border-default)] bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Font Pairs */}
        <div className="glass rounded-2xl p-6 border border-[var(--border-default)]">
          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Typography</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {FONT_PAIRS.map((f) => {
              const isSelected = store.fontHeading === f.heading;
              return (
                <button
                  key={f.label}
                  onClick={() => { store.setField("fontHeading", f.heading); store.setField("fontBody", f.body); }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                    isSelected ? "border-[var(--lime)] bg-[var(--lime-ghost)]" : "border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[var(--bg-elevated)]"
                  )}
                >
                  <span className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: f.heading }}>Aa</span>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]" style={{ fontFamily: f.heading }}>{f.heading}</p>
                    <p className="text-xs text-[var(--text-muted)]" style={{ fontFamily: f.body }}>Body: {f.body}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview */}
        <div className="glass rounded-2xl p-6 border border-[var(--border-default)]">
          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Preview</h3>
          <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-white">
            <div className="p-6" style={{ backgroundColor: store.darkMode ? "#0F172A" : "#FFFFFF" }}>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-sm" style={{ color: store.primaryColor, fontFamily: store.fontHeading }}>
                  {store.name || "Your Business"}
                </span>
                <div className="flex gap-2">
                  <div className="h-2 w-12 rounded-full opacity-30 bg-gray-400" />
                  <div className="h-2 w-12 rounded-full opacity-30 bg-gray-400" />
                  <div className="h-6 w-20 rounded-lg text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: store.primaryColor }}>Book Now</div>
                </div>
              </div>
              <h2 className="text-xl font-black mb-2" style={{ color: store.darkMode ? "#F8FAFC" : "#111827", fontFamily: store.fontHeading }}>
                Professional {store.industry || "Services"} in {store.city || "Your City"}
              </h2>
              <p className="text-xs opacity-60 mb-4" style={{ color: store.darkMode ? "#F8FAFC" : "#374151", fontFamily: store.fontBody }}>
                Expert care, affordable prices, convenient booking online
              </p>
              <div className="h-8 w-32 rounded-lg text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: store.primaryColor }}>
                Book Appointment
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={() => { store.setStep(2); router.push("/onboarding/step/2"); }} className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-all text-sm font-semibold">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={handleContinue} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-all disabled:opacity-60 shadow-[var(--lime-glow-md)]">
          {isPending ? (<><Loader2 size={16} className="animate-spin" /> Saving...</>) : (<>Generate My Business <ArrowRight size={16} /></>)}
        </button>
      </div>
    </div>
  );
}
