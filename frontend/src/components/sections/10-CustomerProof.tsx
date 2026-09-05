"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Sparkles, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SOCIAL_PROOF, WHATSAPP_LINK } from "@/lib/constants";

export const CustomerProof = () => {
  return (
    <section className="py-20 bg-[var(--bg-void)] relative overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto p-8 sm:p-12 bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-3xl relative shadow-xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 text-xs font-bold mb-4">
            <Sparkles size={14} /> {SOCIAL_PROOF.badge}
          </div>

          <h2 className="text-2xl sm:text-4xl font-display font-black text-[var(--text-primary)] tracking-tight mb-4">
            {SOCIAL_PROOF.headline}
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-8">
            {SOCIAL_PROOF.disclaimer}
          </p>

          {/* Pilot Perks Grid */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
            {SOCIAL_PROOF.pilotBenefits.map((benefit, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
                <div className="w-2 h-2 rounded-full bg-[var(--lime)] mb-2" />
                <p className="text-xs font-bold text-[var(--text-primary)] leading-snug">
                  {benefit}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="shadow-[var(--lime-glow-sm)] font-bold">
                Become a Pilot Customer <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
            <Link href={WHATSAPP_LINK("Hi! I'd like to apply for the Docodo pilot program.")}>
              <Button variant="secondary" size="lg">
                Chat with Founder
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
