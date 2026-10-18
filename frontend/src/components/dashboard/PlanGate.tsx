"use client";

import React from "react";
import Link from "next/link";
import { Lock, Crown, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

interface PlanGateProps {
  plan?: string;
  requiredPlan?: "STARTER" | "GROWTH" | "CONCIERGE";
  featureName: string;
  featureDescription?: string;
  roiMessage?: string;
  children: React.ReactNode;
}

const PLAN_HIERARCHY: Record<string, number> = {
  PILOT: 1,
  COMMUNITY: 1,
  STARTER: 2,
  GROWTH: 3,
  PRO: 3,
  CONCIERGE: 4,
  SETUP: 4,
};

export function PlanGate({
  plan = "PILOT",
  requiredPlan = "GROWTH",
  featureName,
  featureDescription,
  roiMessage = "Recovers 12+ lost doctor consultation hours every month with zero aggregators.",
  children,
}: PlanGateProps) {
  const currentLevel = PLAN_HIERARCHY[String(plan).toUpperCase()] || 1;
  const requiredLevel = PLAN_HIERARCHY[requiredPlan] || 3;

  // Unlocked: Render the full feature
  if (currentLevel >= requiredLevel) {
    return <>{children}</>;
  }

  // Locked: Render luxury clinical upgrade gate
  const targetPlanHref = requiredPlan === "STARTER" ? "/checkout?plan=starter" : "/checkout?plan=growth";
  const targetPlanName = requiredPlan === "STARTER" ? "Starter Practice OS" : "Growth Clinical Enterprise";
  const targetPlanPrice = requiredPlan === "STARTER" ? "₹999/mo" : "₹2,499/mo";

  return (
    <div className="space-y-6">
      <div className="p-8 sm:p-10 bg-[#09090B] border border-white/20 rounded-3xl shadow-2xl relative overflow-hidden text-center max-w-3xl mx-auto">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-mono font-bold uppercase tracking-wider">
            <Lock size={13} className="text-white" /> Feature Locked on {plan.toUpperCase()} Tier
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Unlock the {featureName}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              {featureDescription ||
                `The ${featureName} is reserved exclusively for ${targetPlanName} practices to maintain high-capacity automation and clinical privacy.`}
            </p>
          </div>

          {/* ROI Metric Callout */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 max-w-lg mx-auto flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-[0_0_15px_#ffffff]">
              <Crown size={20} />
            </div>
            <div>
              <p className="text-[11px] font-mono text-zinc-400 uppercase">Measured Practice Impact</p>
              <p className="text-xs text-white font-semibold mt-0.5">{roiMessage}</p>
            </div>
          </div>

          {/* What is unlocked */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs max-w-lg mx-auto">
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 size={15} className="text-white shrink-0" /> Multi-doctor &amp; specialty scheduling
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 size={15} className="text-white shrink-0" /> Automated 24h WhatsApp reminders
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 size={15} className="text-white shrink-0" /> Automated 5★ Google Review marketing
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 size={15} className="text-white shrink-0" /> Hindu Festival &amp; Birthday greetings
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={targetPlanHref}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-black font-black text-xs hover:brightness-110 shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all flex items-center justify-center gap-2"
            >
              Upgrade to {targetPlanName} ({targetPlanPrice}) <ArrowRight size={15} />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-1.5"
            >
              Compare All Plans
            </Link>
          </div>

          {/* Guarantee */}
          <p className="text-[11px] text-zinc-500 font-mono">
            ● DPDP Act 2023 Encrypted · Instant Plan Activation · 0% Aggregator Commission
          </p>
        </div>
      </div>
    </div>
  );
}
