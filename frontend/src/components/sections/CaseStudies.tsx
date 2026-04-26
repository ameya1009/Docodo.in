"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { ExternalLink, TrendingUp } from 'lucide-react';

const cases = [
  {
    business: "BIOgram Health",
    metric: "40% reduction",
    detail: "in missed leads",
    description: "Before Docodo, BIOgram was losing 4 out of 10 leads due to slow WhatsApp response times at night. Our AI bot now handles 100% of night-time queries.",
    plan: "Growth Plan"
  },
  {
    business: "Dr. Patangankar Clinic",
    metric: "30% reduction",
    detail: "in no-shows",
    description: "Automated WhatsApp reminders and easy rescheduling reduced no-shows significantly for this premium Pune clinic.",
    plan: "Starter Plan"
  },
  {
    business: "Viman Nagar Cafe",
    metric: "60 bookings",
    detail: "from one broadcast",
    description: "Used our Content Repurposer to create a viral Reel, then converted viewers via a single automated WhatsApp broadcast.",
    plan: "Pro Plan"
  },
  {
    business: "Baner Salon",
    metric: "2x reviews",
    detail: "in 30 days",
    description: "The Auto Review Requester tool helped them double their Google Map reviews by automatically asking happy clients after their visit.",
    plan: "Growth Plan"
  }
];

export const CaseStudies = () => {
  return (
    <section className="bg-bg-surface py-32 px-4" id="cases">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6">Proven <span className="text-gradient-lime">Results</span></h2>
            <p className="text-gray-400 text-lg">
              Real metrics from real Pune businesses. No vanity numbers, just growth.
            </p>
          </div>
          <button className="flex items-center gap-2 text-lime font-bold uppercase tracking-widest text-sm hover:translate-x-2 transition-transform">
            View All Case Studies <ExternalLink size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((c, i) => (
            <motion.div
              key={c.business}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-10 group relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-2 text-lime font-bold text-xs uppercase tracking-[0.2em]">
                      <TrendingUp size={14} /> {c.plan}
                    </div>
                    <h3 className="text-3xl font-display font-black text-white">{c.business}</h3>
                    <p className="text-gray-400 leading-relaxed">{c.description}</p>
                  </div>
                  
                  <div className="w-full md:w-auto bg-lime/10 border border-lime/20 rounded-2xl p-8 text-center min-w-[200px]">
                    <div className="text-4xl font-display font-black text-lime mb-1">{c.metric}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{c.detail}</div>
                  </div>
                </div>
                
                {/* Decorative background number */}
                <span className="absolute -bottom-4 -right-4 text-9xl font-black text-white/[0.02] pointer-events-none">
                  0{i + 1}
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
