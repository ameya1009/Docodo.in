"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BrainCircuit, UserCheck, Banknote, Timer, PhoneForwarded } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

const differentiators = [
  {
    title: "Data Never Leaves India",
    description: "Self-hosted on Indian servers. DPDP Act 2023 compliant. Your clients' data is yours, not ours.",
    icon: ShieldCheck
  },
  {
    title: "Claude AI (Not Rule-Based)",
    description: "Powered by Anthropic Claude — enterprise-grade intelligence that actually understands your clients.",
    icon: BrainCircuit
  },
  {
    title: "Founder Uses It Daily",
    description: "Docodo.in runs on these exact tools. Every case study = our own live proof of concept.",
    icon: UserCheck
  },
  {
    title: "95% Margin Stack",
    description: "Our tech stack costs ~₹200/client. You keep ₹800+ per ₹999 plan. Maximum efficiency.",
    icon: Banknote
  },
  {
    title: "48-Hour Setup",
    description: "From payment to live bot: 48 hours. No weeks of setup or endless kickoff calls.",
    icon: Timer
  },
  {
    title: "WhatsApp-First Support",
    description: "Your account manager is on WhatsApp. No ticket systems. Just direct, fast communication.",
    icon: PhoneForwarded
  }
];

export const WhyDocodo = () => {
  return (
    <section className="bg-bg-deep py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6">Why <span className="text-gradient-lime">Docodo</span>?</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We don't just sell software. We provide the infrastructure for sustainable, automated growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="h-full p-8 group">
                <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center text-lime mb-8 group-hover:bg-lime group-hover:text-bg-deep transition-all duration-500">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
