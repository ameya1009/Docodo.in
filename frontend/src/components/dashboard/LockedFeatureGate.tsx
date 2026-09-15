"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LockedFeatureGateProps {
  featureName: string;
  requiredPlan: "Starter" | "Growth";
  description: string;
  capabilities: string[];
  upgradeHref?: string;
}

export function LockedFeatureGate({
  featureName,
  requiredPlan,
  description,
  capabilities,
  upgradeHref = requiredPlan === "Starter" ? "/checkout?plan=starter" : "/checkout?plan=growth",
}: LockedFeatureGateProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xl space-y-6 my-6">
      <div className="w-16 h-16 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 flex items-center justify-center mx-auto shadow-inner">
        <Lock size={28} />
      </div>

      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 inline-block mb-3">
          Available on {requiredPlan} Plan
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
          {featureName}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto">
          {description}
        </p>
      </div>

      <div className="p-5 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] text-left max-w-md mx-auto space-y-2.5">
        <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Includes with {requiredPlan}:
        </p>
        <div className="space-y-2 text-xs text-[var(--text-secondary)]">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Check size={14} className="text-[var(--lime)] shrink-0" />
              <span>{cap}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={upgradeHref}>
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto font-bold shadow-[var(--lime-glow-sm)]"
          >
            Upgrade to {requiredPlan} <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </Link>
        <Link href="/pricing">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Compare All Plans
          </Button>
        </Link>
      </div>
    </div>
  );
}
