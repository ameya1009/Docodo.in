"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HERO_CONTENT, WHATSAPP_LINK } from "@/lib/constants";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden bg-radial-gradient">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[var(--lime)]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow & Pilot Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--lime)]/30 text-xs font-semibold mb-6 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-[var(--lime)] animate-pulse" />
            <span className="text-[var(--lime)] font-bold">{HERO_CONTENT.pilotBadge}</span>
            <span className="text-[var(--border-default)]">•</span>
            <span className="text-[var(--text-secondary)]">Zero Complexity</span>
          </motion.div>

          {/* Primary Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-[1.08] mb-6"
          >
            {HERO_CONTENT.headline.line1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--lime)] via-lime-300 to-emerald-400">
              {HERO_CONTENT.headline.line2}
            </span>
          </motion.h1>

          {/* Supporting Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-8"
          >
            {HERO_CONTENT.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
          >
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-[var(--lime-glow-md)] text-base font-bold">
                {HERO_CONTENT.primaryCTA} <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                <Play size={16} className="mr-2 text-[var(--lime)]" /> {HERO_CONTENT.secondaryCTA}
              </Button>
            </Link>
          </motion.div>

          {/* Value Micro-Points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-6 text-xs text-[var(--text-muted)] font-medium"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[var(--lime)]" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-[var(--lime)]" /> 15-Minute Instant Setup
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[var(--lime)]" /> Self-Hosted Indian Server
            </span>
          </motion.div>
        </div>

        {/* Live Interactive Preview Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 max-w-4xl mx-auto p-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl shadow-2xl relative group"
        >
          <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] rounded-t-2xl text-xs text-[var(--text-muted)] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-[var(--text-secondary)] font-bold">docodo.in/book/baner-luxury-salon</span>
            </div>
            <span className="hidden sm:inline text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px] font-bold">
              ● Live Storefront
            </span>
          </div>

          <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-6 bg-[var(--bg-void)]/60 rounded-b-2xl">
            {/* Step A: Store Profile */}
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[var(--lime-ghost)] border border-[var(--lime)]/30 flex items-center justify-center text-lg mb-3">
                  💇
                </div>
                <h3 className="font-bold text-sm text-[var(--text-primary)]">Baner Luxury Salon</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Baner, Pune • Open 10 AM – 8 PM</p>
                <div className="mt-3 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--lime-ghost)] text-[var(--lime)]">
                  ★ 4.9 (120+ verified bookings)
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-4 border-t border-[var(--border-subtle)] pt-2">
                ⚡ Instant WhatsApp & UPI booking enabled
              </p>
            </div>

            {/* Step B: Service Selection */}
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-[var(--text-primary)]">
                  <span>Select Service</span>
                  <span className="text-[var(--lime)] font-mono">1/3</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--lime-ghost)] border border-[var(--lime)]/40 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">Haircut & Deep Spa</p>
                    <p className="text-[10px] text-[var(--text-muted)]">45 mins</p>
                  </div>
                  <span className="text-xs font-black text-[var(--lime)] font-mono">₹500</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-transparent opacity-60 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">Keratin Treatment</p>
                    <p className="text-[10px] text-[var(--text-muted)]">90 mins</p>
                  </div>
                  <span className="text-xs font-mono">₹2,500</span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] mt-2">
                📅 Slot selected: Tomorrow, 03:30 PM
              </div>
            </div>

            {/* Step C: Merchant Live Notification */}
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-emerald-400">Dashboard Live Alert</span>
                </div>
                <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl space-y-1 text-left">
                  <p className="text-xs font-bold text-[var(--text-primary)]">✅ New Booking Confirmed</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">Client: Rahul S. (+91 98230...)</p>
                  <p className="text-[10px] font-mono text-[var(--lime)]">Slot: Tomorrow, 3:30 PM (₹500 Paid)</p>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                <span>WhatsApp reminder scheduled</span>
                <span className="font-bold text-[var(--lime)]">Auto</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
