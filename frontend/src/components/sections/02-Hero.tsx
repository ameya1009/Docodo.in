"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowRight, Play, CheckCircle2, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HERO_CONTENT, WHATSAPP_LINK } from "@/lib/constants";
import { HeroInteractiveShowcase } from "./HeroInteractiveShowcase";

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

        {/* Real Interactive 3D Product Engine & Live Composition */}
        <HeroInteractiveShowcase />
      </div>
    </section>
  );
};
