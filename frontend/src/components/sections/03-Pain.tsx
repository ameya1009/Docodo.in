"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  MessageSquareOff, 
  CalendarX, 
  HelpCircle, 
  Database, 
  BellOff, 
  Link2Off,
  ArrowRight,
  Clock,
  UserX,
  MessageSquare,
  Instagram
} from "lucide-react";
import { PROBLEM_SECTION } from "@/lib/constants";

export const PainPoints = () => {
  const iconMap: Record<string, any> = {
    MessageSquareOff,
    CalendarX,
    HelpCircle,
    Database,
    BellOff,
    Link2Off,
    Instagram,
    MessageSquare,
    Clock,
    UserX,
  };

  return (
    <section className="py-24 bg-[var(--bg-elevated)]/40 border-y border-[var(--border-subtle)] relative overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 mb-3 inline-block">
            The Cost of Inaction
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight mb-4">
            {PROBLEM_SECTION.headline}
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            {PROBLEM_SECTION.subheadline}
          </p>
        </div>

        {/* The Current Reality: 4-Step Lost Customer Flow */}
        <div className="max-w-4xl mx-auto mb-16 p-6 sm:p-8 bg-[var(--bg-surface)] border border-red-500/20 rounded-3xl shadow-xl">
          <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-6 text-center font-mono">
            ⚠️ The Anatomy of a Lost Customer
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
            {PROBLEM_SECTION.flow.map((step, idx) => {
              const Icon = iconMap[step.icon] || MessageSquare;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] relative group hover:border-red-500/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
                    {Icon && <Icon className="w-5 h-5" />}
                  </div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)] mb-1">{step.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-snug">{step.desc}</p>

                  {idx < PROBLEM_SECTION.flow.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-[var(--border-default)] z-10">
                      <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6 Problem Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEM_SECTION.painPoints.map((item, idx) => {
            const Icon = iconMap[item.icon] || MessageSquareOff;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-red-500/40 rounded-2xl flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {Icon && <Icon className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2 font-display">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-red-400/80 font-mono">
                  <span>Revenue Leakage</span>
                  <span>❌ Lost Booking</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
