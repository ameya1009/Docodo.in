"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Sparkles, 
  UserCheck, 
  Headphones,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { 
  CONCIERGE_ONBOARDING_STEPS,
  CommercialPlan 
} from "@/lib/plans-config";

interface UsageClientProps {
  business: any;
  subscription: any;
  usage: {
    count: number;
    limit: number | "UNLIMITED";
    remaining: number;
    percentUsed: number;
    periodStart: Date;
    periodEnd: Date;
  };
  plan: CommercialPlan;
  conciergeOrder?: any;
}

export default function UsageClient({
  business,
  subscription,
  usage,
  plan,
  conciergeOrder,
}: UsageClientProps) {
  const isPilot = plan.id === "pilot";
  const count = usage.count;
  const limit = usage.limit;
  const isApproaching = isPilot && count >= 40 && count < 45;
  const isUrgent = isPilot && count >= 45 && count < 50;
  const isLimitReached = isPilot && count >= 50;

  const formatDate = (d: any) => {
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Current Cycle";
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title & Plan Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-0.5 rounded-full border border-[var(--lime)]/30 inline-block">
              {subscription.status}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Cycle: {formatDate(usage.periodStart)} – {formatDate(usage.periodEnd)}
            </span>
          </div>
          <h1 className="text-3xl font-display font-black text-white">
            Plan &amp; Usage Telemetry
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Real-time server-side entitlement limits and active billing period consumption for {business.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isPilot ? (
            <Link href="/checkout?plan=starter">
              <Button variant="primary" size="md" className="font-bold shadow-[var(--lime-glow-sm)]">
                Upgrade to Starter (₹999/mo) <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </Link>
          ) : plan.id === "starter" ? (
            <Link href="/checkout?plan=growth">
              <Button variant="primary" size="md" className="font-bold shadow-[var(--lime-glow-sm)]">
                Upgrade to Growth (₹2,499/mo) <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </Link>
          ) : (
            <span className="text-xs font-bold text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-2 rounded-xl border border-[var(--lime)]/30 flex items-center gap-1.5">
              <Sparkles size={14} /> Full Growth Plan Active
            </span>
          )}
        </div>
      </div>

      {/* Concierge Onboarding Tracker (if purchased) */}
      {conciergeOrder && (
        <div className="bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--lime)]/20 text-[var(--lime)] flex items-center justify-center">
                <UserCheck size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-2.5 py-0.5 rounded-full border border-[var(--lime)]/30 inline-block mb-1">
                  Done-For-You Onboarding Active
                </span>
                <h2 className="text-xl font-bold text-white">
                  Your setup specialist is handling your launch.
                </h2>
              </div>
            </div>
            <div className="text-xs text-[var(--text-secondary)] sm:text-right">
              <p className="font-bold text-white">Specialist: {conciergeOrder.assignedSpecialist || "Ameya Kshirsagar"}</p>
              <a
                href="https://wa.me/919284310604?text=Hi%20Ameya,%20checking%20in%20on%20my%20Done-For-You%20Setup"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--lime)] hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                <Headphones size={12} /> WhatsApp Specialist (+91 9284310604)
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Launch Workflow Pipeline:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {CONCIERGE_ONBOARDING_STEPS.slice(0, 6).map((st, i) => (
                <div 
                  key={st.id} 
                  className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                    <span>STEP {i + 1}</span>
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  </div>
                  <p className="font-bold text-white text-[11px] leading-tight">{st.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Bookings Limit UX */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-[var(--lime)]" /> Monthly Booking Usage
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Reset naturally at the start of each billing month. Historical booking data is never deleted.
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-mono font-black text-white">
              {count}
            </span>
            <span className="text-sm font-mono text-[var(--text-muted)]">
              {" "}/ {limit === "UNLIMITED" ? "∞ (Unlimited)" : limit}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        {isPilot && (
          <div className="space-y-2">
            <div className="w-full h-3.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden p-0.5 border border-[var(--border-subtle)]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isLimitReached
                    ? "bg-red-500"
                    : isUrgent
                    ? "bg-amber-400"
                    : isApproaching
                    ? "bg-yellow-400"
                    : "bg-[var(--lime)]"
                }`}
                style={{ width: `${Math.min(100, (count / 50) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>0 bookings</span>
              <span>{Math.max(0, 50 - count)} bookings remaining</span>
              <span>50 / month</span>
            </div>
          </div>
        )}

        {/* Warning Banners */}
        {isLimitReached && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-red-400">
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Pilot booking limit reached.</p>
                <p className="text-xs mt-0.5 text-red-300">
                  Your business has reached its 50 monthly Pilot bookings. Public online booking is temporarily paused until next cycle or Starter upgrade.
                </p>
              </div>
            </div>
            <Link href="/checkout?plan=starter">
              <Button variant="primary" size="sm" className="font-bold shrink-0 shadow-lg">
                Upgrade to Starter Now →
              </Button>
            </Link>
          </div>
        )}

        {isUrgent && !isLimitReached && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-300">
            <div className="flex items-center gap-3">
              <Clock size={24} className="shrink-0 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-white">Only {50 - count} Pilot bookings remaining.</p>
                <p className="text-xs mt-0.5 text-amber-200">
                  You have processed {count} of your 50 free monthly appointments. Upgrade to Starter for unlimited bookings.
                </p>
              </div>
            </div>
            <Link href="/checkout?plan=starter">
              <Button variant="primary" size="sm" className="font-bold shrink-0">
                Unlock Unlimited Bookings →
              </Button>
            </Link>
          </div>
        )}

        {isApproaching && !isUrgent && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-yellow-300">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="shrink-0 text-yellow-400" />
              <div>
                <p className="text-xs font-bold text-white">You&apos;re approaching your Pilot booking limit.</p>
                <p className="text-xs mt-0.5 text-yellow-200">
                  Your business is gaining traction with {count} bookings. Starter removes the 50-booking cap.
                </p>
              </div>
            </div>
            <Link href="/checkout?plan=starter">
              <Button variant="secondary" size="sm" className="font-bold shrink-0">
                View Starter Plan →
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Plan Entitlements Matrix */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-[var(--lime)]" /> Active Commercial Entitlements
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Features currently enabled on your active plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {plan.features.map((feat, idx) => (
            <div 
              key={idx}
              className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] flex items-start gap-2.5 text-xs"
            >
              <CheckCircle2 size={16} className="text-[var(--lime)] shrink-0 mt-0.5" />
              <span className="text-[var(--text-primary)] font-medium">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Locked Features on Pilot */}
      {isPilot && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-2.5 py-0.5 rounded-full border border-[var(--lime)]/30 inline-block mb-1">
                Available on Starter &amp; Growth
              </span>
              <h2 className="text-lg font-bold text-white">
                Unlock Premium Automation
              </h2>
            </div>
            <Link href="/checkout?plan=starter">
              <Button variant="primary" size="sm" className="font-bold">
                Upgrade Now
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-2 opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Automated WhatsApp Alerts</span>
                <Lock size={14} className="text-[var(--text-muted)]" />
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Instant confirmation messages, 24h pre-visit reminders, and Google review request links.
              </p>
            </div>

            <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-2 opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Online UPI &amp; Razorpay</span>
                <Lock size={14} className="text-[var(--text-muted)]" />
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Collect upfront appointment fees via GPay, PhonePe, Paytm, and NetBanking.
              </p>
            </div>

            <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-2 opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Multi-Staff &amp; AI Marketing</span>
                <Lock size={14} className="text-[var(--text-muted)]" />
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Manage stylist &amp; doctor rosters, room assignment, and generate viral Instagram reel scripts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
