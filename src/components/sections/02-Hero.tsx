"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionElements";
import { HERO_CONTENT, WHATSAPP_LINK } from "@/lib/constants";
import { HeroScene } from "@/components/3d/HeroScene";

export const Hero = () => {
  const { eyebrow, headline, subheadline, trustTicker } = HERO_CONTENT;

  const wordVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className="relative h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center pt-20">
      {/* Layer 1: 3D Background */}
      <HeroScene />

      {/* Layer 2: Content Overlay */}
      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <SectionLabel dot>{eyebrow}</SectionLabel>
        </motion.div>

        <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-8 max-w-5xl">
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
          transition={{ delay: 1, duration: 0.8 }}
          className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-20"
        >
          <Button variant="primary" size="lg" className="shadow-[var(--lime-glow-md)]">
            Claim 50 Free Credits <ArrowRight size={18} className="ml-2" />
          </Button>
          <Button variant="secondary" size="lg">
            <Play size={18} className="mr-2 fill-current" /> Watch 43-sec Demo
          </Button>
          <Button variant="ghost" size="lg" onClick={() => {
            document.querySelector("#care-plans")?.scrollIntoView({ behavior: "smooth" });
          }}>
            See Plans
          </Button>
        </motion.div>

        {/* Trust Marquee */}
        <div className="w-full overflow-hidden border-y border-[var(--border-subtle)] py-4">
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
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-10 bg-[var(--lime)] opacity-40"></div>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[var(--lime)]"
        >
          <ArrowRight size={16} className="rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  );
};
