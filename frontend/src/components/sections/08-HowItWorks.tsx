"use client";

import React from "react";
import { motion } from "framer-motion";
import { ClipboardList, Wrench, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionElements";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    title: "You fill out a 2-minute form",
    description: "Tell us your business type, goals, and WhatsApp number.",
    icon: ClipboardList,
    visual: "form",
  },
  {
    number: "02",
    title: "We build and configure in 48 hours",
    description: "Our team sets up your WhatsApp bot, SEO reports, and automation flows.",
    icon: Wrench,
    visual: "progress",
  },
  {
    number: "03",
    title: "You start getting leads while you sleep",
    description: "The system runs 24/7. You get a weekly report every Monday morning.",
    icon: TrendingUp,
    visual: "notification",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-[var(--bg-deep)] relative overflow-hidden">
      <div className="container">
        <SectionHeading
          eyebrow="The Process"
          headline="From sign-up to live in 48 hours."
          sub="Three steps. No technical knowledge needed."
          className="mb-20"
        />

        <div className="relative grid lg:grid-cols-3 gap-12">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent -translate-y-1/2 hidden lg:block" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* Step Number & Icon */}
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--lime)] shadow-xl group hover:border-[var(--lime)]/50 transition-colors">
                  <step.icon size={32} />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[var(--lime)] text-black font-display font-black text-xs flex items-center justify-center border-4 border-[var(--bg-deep)]">
                  {step.number}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {/* Visual Mockups */}
              <div className="mt-8 w-full max-w-[240px] aspect-video rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden relative p-4 shadow-2xl">
                {step.visual === "form" && (
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <motion.div
                        key={j}
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ delay: 0.5 + j * 0.2, duration: 0.8 }}
                        className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden"
                      >
                        <div className="h-full w-1/3 bg-[var(--lime)]/20" />
                      </motion.div>
                    ))}
                  </div>
                )}
                {step.visual === "progress" && (
                  <div className="flex flex-col h-full justify-center gap-4">
                    <div className="flex justify-between text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                      <span>Deployment</span>
                      <span>85%</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        transition={{ delay: 0.5, duration: 1.5 }}
                        className="h-full bg-[var(--lime)]"
                      />
                    </div>
                  </div>
                )}
                {step.visual === "notification" && (
                  <div className="flex flex-col gap-2">
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-[#1e2428] p-2 rounded-lg border border-white/5 flex gap-2 items-center"
                    >
                      <div className="w-4 h-4 rounded-full bg-[var(--lime)]" />
                      <div className="text-[8px] font-bold">New Lead: Viman Nagar</div>
                    </motion.div>
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-[#1e2428] p-2 rounded-lg border border-white/5 flex gap-2 items-center"
                    >
                      <div className="w-4 h-4 rounded-full bg-[var(--lime)]" />
                      <div className="text-[8px] font-bold">ROI Report: Monday</div>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
