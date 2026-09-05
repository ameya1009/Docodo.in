"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PRICING_PLANS } from "@/lib/constants";

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-[var(--bg-elevated)]/30 border-y border-[var(--border-subtle)] relative overflow-hidden">
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
            💎 Simple & Transparent
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
          {PRICING_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`p-6 bg-[var(--bg-surface)] rounded-3xl flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? "border-2 border-[var(--lime)] shadow-[var(--lime-glow-md)]"
                  : "border border-[var(--border-default)] hover:border-[var(--lime)]/40"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--lime)] text-black text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                  Most Popular
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
                  <p className="text-xs text-[var(--text-secondary)] mt-1 min-h-[36px]">
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
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <Check size={14} className="text-[var(--lime)] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link href={plan.ctaHref}>
                  <Button
                    variant={plan.popular ? "primary" : "secondary"}
                    size="md"
                    className="w-full font-bold"
                  >
                    {plan.cta} <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Note */}
        <div className="text-center text-xs text-[var(--text-muted)] font-mono">
          ✓ No hidden setup fees • ✓ Cancel or upgrade anytime • ✓ Zero long-term lock-in
        </div>
      </div>
    </section>
  );
};
