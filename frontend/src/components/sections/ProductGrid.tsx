"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Video, Star, BarChart3, FileText, Zap } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

const products = [
  {
    name: "WhatsApp AI Nurturer",
    description: "Replies at 3am so you don't have to.",
    price: "Free tier available",
    icon: MessageSquare,
    badge: "Popular"
  },
  {
    name: "Content Repurposer",
    description: "1 video → 30 assets automatically.",
    price: "Free to start",
    icon: Video,
    badge: "Free"
  },
  {
    name: "Auto Review Requester",
    description: "Happy clients become your marketing team.",
    price: "₹499/mo",
    icon: Star,
    badge: "Growth"
  },
  {
    name: "Weekly ROI Reporter",
    description: "Monday morning report, zero effort.",
    price: "₹999/mo",
    icon: BarChart3,
    badge: "Pro"
  },
  {
    name: "AI Proposal Generator",
    description: "30-second proposals that close clients.",
    price: "₹799/mo",
    icon: FileText,
    badge: "Tool"
  },
  {
    name: "Docodo Care Plans",
    description: "The complete growth stack, done-for-you.",
    price: "From ₹2,499/mo",
    icon: Zap,
    badge: "Recommended"
  }
];

export const ProductGrid = () => {
  return (
    <section className="bg-bg-surface py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6">The Growth Engine</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A suite of AI-powered tools designed to automate every aspect of your business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="h-full group hover:border-lime/30">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center text-lime group-hover:bg-lime group-hover:text-bg-deep transition-all duration-300">
                    <product.icon size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-gray-400">
                    {product.badge}
                  </span>
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-3">{product.name}</h3>
                <p className="text-gray-400 mb-8">{product.description}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-bold text-white/80">{product.price}</span>
                  <NeonButton variant="secondary" className="px-4 py-2 text-xs">
                    Try Now
                  </NeonButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
