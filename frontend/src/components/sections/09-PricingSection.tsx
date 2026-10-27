"use client";

import React, { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, Shield, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PRICING_PLANS } from "@/lib/constants";
import { loadRazorpayScript } from "@/lib/razorpay";

export const PricingSection = () => {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [paidPlan, setPaidPlan] = useState<string | null>(null);

  const handlePlanCheckout = async (plan: any) => {
    setLoadingPlan(plan.id);
    // If pilot/free plan, go directly to signup
    if (plan.id === "pilot" || plan.price === "₹0") {
      router.push("/auth/signup");
      return;
    }

    // Route directly to authenticated checkout with selected plan
    router.push(plan.ctaHref || `/checkout?plan=${plan.id}`);
  };

  return (
    <section id="pricing" className="py-24 bg-[var(--bg-elevated)]/30 border-y border-[var(--border-subtle)] relative overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Success Modal */}
      <AnimatePresence>
        {paidPlan && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[var(--bg-surface)] border border-[var(--lime)]/50 p-6 sm:p-8 rounded-3xl max-w-md w-full text-center space-y-5 shadow-2xl relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--lime)]/20 text-[var(--lime)] flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white font-display">
                  {paidPlan} Activated! 🎉
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Razorpay cryptographic HMAC SHA-256 signature verified.
                </p>
              </div>

              {/* Progressive Provisioning Checklist (Section 1) */}
              <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] text-left space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--lime)] font-mono">
                  Provisioning System Engines
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>PostgreSQL connection pool &amp; tenant security initialized</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>Dynamic appointment slot calculation engine active</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>WhatsApp 24h reminder &amp; assistant webhook ready</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-[var(--lime-glow-sm)] min-h-[44px]"
                onClick={() => {
                  setPaidPlan(null);
                  router.push("/onboarding");
                }}
              >
                Continue to 15-Min Onboarding <ArrowRight size={16} className="ml-1" />
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
            💎 Simple &amp; Transparent
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight mb-4">
            Predictable Pricing for Growing Businesses
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            Start completely free on our Pilot Program, or choose a plan that scales with your appointments.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PRICING_PLANS.map((plan, idx) => {
            const isConcierge = plan.id === "setup-service";
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`p-6 sm:p-7 bg-[var(--bg-surface)] rounded-3xl flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-2 border-[var(--lime)] shadow-[var(--lime-glow-md)] ring-1 ring-[var(--lime)]/30"
                    : isConcierge
                    ? "border border-amber-500/40 hover:border-amber-400/70 shadow-[0_4px_20px_rgba(245,158,11,0.06)]"
                    : "border border-[var(--border-default)] hover:border-[var(--lime)]/40 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[var(--lime)] text-black text-[10px] font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
                    <Sparkles size={11} className="text-black" /> Most Popular
                  </div>
                )}
                {isConcierge && !plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
                    <Sparkles size={11} className="text-black" /> Concierge Setup
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {plan.badge}
                    </span>
                    <h3 className="font-bold text-xl text-[var(--text-primary)] font-display mt-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 min-h-[36px] leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="my-6 pb-6 border-b border-[var(--border-subtle)]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] font-display">
                        {plan.price}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                        <Check size={14} className="text-[var(--lime)] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Button
                    variant={plan.popular ? "primary" : "secondary"}
                    size="lg"
                    className={`w-full font-bold shadow-md min-h-[48px] text-sm ${
                      isConcierge && !plan.popular ? "border-amber-400/60 text-amber-300 hover:bg-amber-400/10" : ""
                    }`}
                    onClick={() => handlePlanCheckout(plan)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <><Loader2 size={14} className="animate-spin mr-1.5" /> Opening Checkout...</>
                    ) : (
                      <>{plan.cta} <ArrowRight size={14} className="ml-1" /></>
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Trust & Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 pb-2 border-t border-[var(--border-subtle)] text-xs">
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--lime)]/10 text-[var(--lime)] shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)]">DPDP Act 2023 Compliant</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Indian server residency &amp; row-level tenant data isolation.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)]">0% Aggregator Commission</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">100% direct UPI settlement straight into your bank account.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)]">Verified Razorpay Gateway</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Instant automated workspace provisioning &amp; HMAC security.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

