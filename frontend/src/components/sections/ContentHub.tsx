"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, FileText, Music, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

const contentItems = [
  {
    type: "YouTube",
    icon: Youtube,
    title: "How to set up your first AI WhatsApp Bot in 10 minutes",
    date: "April 20, 2026",
    link: "#"
  },
  {
    type: "Medium",
    icon: FileText,
    title: "The Future of SMB Automation in Pune's growing economy",
    date: "April 18, 2026",
    link: "#"
  },
  {
    type: "Spotify",
    icon: Music,
    title: "Docodo Podcast: Scaling from ₹1L to ₹10L MRR",
    date: "April 15, 2026",
    link: "#"
  }
];

export const ContentHub = () => {
  return (
    <section className="bg-bg-surface py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6">Content <span className="text-gradient-lime">Hub</span></h2>
            <p className="text-gray-400 text-lg">
              Learn how to scale your business with AI from our latest guides and podcasts.
            </p>
          </div>
          <button className="px-8 py-3 rounded-full border border-white/10 hover:border-lime hover:text-lime transition-all flex items-center gap-2 font-bold text-sm">
            View All Resources <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contentItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="group cursor-pointer h-full">
                <div className="aspect-video bg-bg-deep rounded-xl mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <item.icon size={64} />
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-black/50 backdrop-blur text-[10px] font-bold uppercase tracking-widest text-white">
                    {item.type}
                  </div>
                </div>
                <h3 className="text-lg font-display font-bold mb-4 group-hover:text-lime transition-colors">
                  {item.title}
                </h3>
                <div className="flex justify-between items-center mt-auto text-xs text-gray-500">
                  <span>{item.date}</span>
                  <span className="flex items-center gap-1 group-hover:gap-2 transition-all text-lime opacity-0 group-hover:opacity-100">
                    Read More <ArrowRight size={14} />
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
