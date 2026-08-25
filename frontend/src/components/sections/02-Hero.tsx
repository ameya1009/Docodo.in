"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionElements";
import { HERO_CONTENT } from "@/lib/constants";
import { HeroScene } from "@/components/3d/HeroScene";

export const Hero = () => {
  const { eyebrow, headline, subheadline, trustTicker } = HERO_CONTENT;

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section className="relative min-h-[90vh] md:h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center pt-24 pb-12">
      {/* Layer 1: 3D Background */}
      <HeroScene />

      {/* Layer 2: Content Overlay */}
      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <SectionLabel dot>{eyebrow}</SectionLabel>
        </motion.div>

        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] tracking-tight mb-6 max-w-5xl">
          <span className="block text-[var(--text-primary)]">
            {headline.line1.split(" ").map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
                className="inline-block mr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block text-lime-gradient">
            {headline.line2.split(" ").map((word, i) => (
              <motion.span
                key={i}
                custom={i + 3}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
                className="inline-block mr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-[var(--text-secondary)] text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" className="shadow-[var(--lime-glow-md)]">
              Launch in 15 Minutes <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
          <Link href="/book/docodo-wellness-mumbai" target="_blank">
            <Button variant="secondary" size="lg">
              <Calendar size={18} className="mr-2 text-[var(--lime)]" /> View Live Booking Demo <ExternalLink size={14} className="ml-1 opacity-70" />
            </Button>
          </Link>
          <Link href="/care-plans">
            <Button variant="ghost" size="lg">
              Pricing Plans
            </Button>
          </Link>
        </motion.div>

        {/* Trust Marquee */}
        <div className="w-full overflow-hidden border-y border-[var(--border-subtle)] py-3.5">
          <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-12 items-center hover:[animation-play-state:paused] cursor-default">
            {[...trustTicker, ...trustTicker].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-[10px] md:text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                <span>{item}</span>
                <span className="text-[var(--lime)]">◇</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
      >
        <div className="w-[1px] h-8 bg-[var(--lime)] opacity-40"></div>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[var(--lime)]"
        >
          <ArrowRight size={14} className="rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  );
};
