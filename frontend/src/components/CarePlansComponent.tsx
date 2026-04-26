"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button, Badge } from './ui/core';
import { Check } from 'lucide-react';

export const CarePlansComponent = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="py-24 bg-[var(--color-bg-secondary)] relative" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent-primary)]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-cabinet mb-4">Docodo Care Plans</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">Self-hosted AI solutions that pay for themselves.</p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-[var(--color-text-secondary)]'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-16 h-8 bg-[var(--color-bg-tertiary)] rounded-full p-1 border border-[var(--color-border)] relative cursor-pointer"
            >
              <motion.div 
                className="w-6 h-6 bg-[var(--color-accent-primary)] rounded-full shadow-[var(--shadow-glow-accent)]"
                animate={{ x: isAnnual ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-[var(--color-text-secondary)]'}`}>
              Annual <span className="text-[var(--color-accent-primary)] text-xs ml-1 font-bold">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Starter */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GlassCard className="p-8 border-[var(--color-border)]">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-cabinet font-bold text-white">₹{isAnnual ? '1,999' : '2,499'}</span>
                <span className="text-sm text-[var(--color-text-secondary)]">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['WhatsApp AI Setup', '100 AI Replies/mo', 'Email Support', 'Shared Hosting'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                    <Check size={16} className="text-[var(--color-accent-primary)]" /> {feature}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full">Get Started</Button>
            </GlassCard>
          </motion.div>

          {/* Growth */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative z-10">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-[var(--color-accent-primary)] to-transparent rounded-2xl blur-sm opacity-50" />
            <GlassCard className="p-8 border-[var(--color-accent-primary)] transform md:-translate-y-4 shadow-[var(--shadow-glow-card)] bg-[var(--color-bg-tertiary)]">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-accent-primary)] text-black border-none font-bold shadow-[var(--shadow-glow-accent)]">Most Popular</Badge>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-accent-primary)]">Growth</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-cabinet font-bold text-white">₹{isAnnual ? '3,999' : '4,999'}</span>
                <span className="text-sm text-[var(--color-text-secondary)]">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Advanced AI Prompts', '500 AI Replies/mo', 'Content Repurposer (5x/mo)', 'Priority Support', 'Dedicated Instance'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white">
                    <Check size={16} className="text-[var(--color-accent-primary)]" /> {feature}
                  </li>
                ))}
              </ul>
              <Button variant="primary" className="w-full shadow-[var(--shadow-glow-button)]">Get Started</Button>
            </GlassCard>
          </motion.div>

          {/* Pro */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <GlassCard className="p-8 border-[var(--color-border)]">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-cabinet font-bold text-white">₹{isAnnual ? '7,999' : '9,999'}</span>
                <span className="text-sm text-[var(--color-text-secondary)]">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Custom AI Agents', 'Unlimited AI Replies', 'Unlimited Repurposing', '24/7 Phone Support', 'Self-Hosted (AWS)'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                    <Check size={16} className="text-[var(--color-accent-primary)]" /> {feature}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full">Get Started</Button>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
