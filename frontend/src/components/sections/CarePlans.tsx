"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Rocket, Crown } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { cn } from '@/lib/utils';

const plans = [
  {
    tier: "Starter",
    icon: Zap,
    monthlyPrice: 2499,
    annualPrice: 23990,
    description: "Perfect for single-location clinics and salons.",
    features: [
      "WhatsApp AI Nurturer (500 msgs)",
      "Lead Capture System",
      "Monthly Growth Report",
      "WhatsApp Support",
      "48-Hour Setup"
    ],
    buttonText: "Start Growth",
    popular: false
  },
  {
    tier: "Growth",
    icon: Rocket,
    monthlyPrice: 4999,
    annualPrice: 47990,
    description: "Scale your business with automated marketing.",
    features: [
      "Everything in Starter",
      "Unlimited AI Messages",
      "4 Social Media Posts/mo",
      "GBP Optimization",
      "Email Nurture Sequences",
      "Weekly ROI Dashboard"
    ],
    buttonText: "Scale Faster",
    popular: true
  },
  {
    tier: "Pro",
    icon: Crown,
    monthlyPrice: 9999,
    annualPrice: 95990,
    description: "Full-service AI transformation for founders.",
    features: [
      "Everything in Growth",
      "12 Blog Posts/mo",
      "8 Reels/mo (Scripts + Edit)",
      "Google Ads Management",
      "Dedicated Account Manager",
      "Monthly Strategy Call"
    ],
    buttonText: "Go Pro",
    popular: false
  }
];

export const CarePlans = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section className="bg-bg-surface py-32 px-4" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6">Transparent Pricing</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              Pick the plan that fits your current stage. Upgrade as you scale.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm", billingCycle === 'monthly' ? "text-white font-bold" : "text-gray-500")}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-7 rounded-full bg-white/10 p-1 flex items-center transition-all duration-300"
            >
              <div className={cn(
                "w-5 h-5 rounded-full bg-lime transition-all duration-300",
                billingCycle === 'annual' ? "translate-x-7" : "translate-x-0"
              )} />
            </button>
            <span className={cn("text-sm", billingCycle === 'annual' ? "text-white font-bold" : "text-gray-500")}>
              Annual <span className="text-lime text-[10px] bg-lime/10 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard 
                className={cn(
                  "h-full flex flex-col relative",
                  plan.popular && "border-lime shadow-lime/20 bg-lime/[0.02]"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-lime text-bg-deep text-[10px] font-black uppercase tracking-widest rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-lime mb-6">
                    <plan.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">{plan.tier}</h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-black">
                      ₹{billingCycle === 'monthly' ? plan.monthlyPrice.toLocaleString() : (plan.annualPrice / 12).toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">/mo</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-[10px] text-lime font-bold uppercase tracking-wider mt-1">
                      Billed ₹{plan.annualPrice.toLocaleString()} yearly
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-lime/10 flex items-center justify-center text-lime shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <NeonButton 
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {plan.buttonText}
                </NeonButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* ROI Footnote */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-gray-500 text-sm mt-16 max-w-xl mx-auto italic"
        >
          "If our WhatsApp bot captures just 2 extra leads/month at ₹5,000 average sale = ₹10,000 new revenue. Plan costs ₹2,499. ROI: 4x."
        </motion.p>
      </div>
    </section>
  );
};
