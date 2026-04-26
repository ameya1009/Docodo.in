"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ProblemSolution = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !leftPanelRef.current || !rightPanelRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        scrub: 1,
        pin: true,
      }
    });

    // Phase 1: Problem
    tl.to(".problem-text", { opacity: 0, y: -50, duration: 1, delay: 1 })
      .to(".chaos-icon", { scale: 0, rotation: 360, opacity: 0, duration: 1 }, "<")
      
    // Phase 2: Transition
      .to(".solution-text", { opacity: 1, y: 0, duration: 1 })
      .to(".order-icon", { scale: 1, rotation: 0, opacity: 1, duration: 1 }, "<");

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="h-screen w-full bg-[var(--color-bg-primary)] flex items-center justify-center overflow-hidden relative border-t border-[var(--color-border)]">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-accent-primary)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Panel - Text content */}
        <div ref={leftPanelRef} className="relative h-[300px]">
          {/* Problem Text */}
          <div className="problem-text absolute inset-0 flex flex-col justify-center">
            <h2 className="text-h2 font-cabinet text-[var(--color-danger)] mb-4">The 2026 SMB Trap</h2>
            <p className="text-body text-[var(--color-text-secondary)]">
              47% of WhatsApp inquiries go unanswered after 5 mins.
              Manual follow-up. Manual reports. Manual content. You&apos;re the bottleneck.
            </p>
          </div>

          {/* Solution Text */}
          <div className="solution-text absolute inset-0 flex flex-col justify-center opacity-0 translate-y-[50px]">
            <h2 className="text-h2 font-cabinet text-[var(--color-accent-primary)] mb-4">The AI Growth OS</h2>
            <p className="text-body text-[var(--color-text-secondary)] mb-6">
              Docodo replaces the bottleneck with an AI Growth OS.
              WhatsApp replies in {"<"}5 seconds. Content repurposed automatically.
              Reports sent before clients ask. While you sleep.
            </p>
            <div className="flex gap-4">
              <div className="bg-[var(--color-bg-glass)] p-3 rounded-lg border border-[var(--color-border)]">
                <span className="block text-[var(--color-accent-primary)] font-bold text-xl">5s</span>
                <span className="text-xs text-[var(--color-text-secondary)]">Response Time</span>
              </div>
              <div className="bg-[var(--color-bg-glass)] p-3 rounded-lg border border-[var(--color-border)]">
                <span className="block text-[var(--color-accent-primary)] font-bold text-xl">30+</span>
                <span className="text-xs text-[var(--color-text-secondary)]">Assets / Video</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Visuals */}
        <div ref={rightPanelRef} className="relative h-[400px] flex items-center justify-center">
          {/* Problem Visuals */}
          <div className="chaos-icon absolute flex flex-col gap-4 items-center">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-24 h-24 bg-[var(--color-bg-tertiary)] rounded-2xl border-2 border-[var(--color-danger)] flex items-center justify-center shadow-[0_0_30px_rgba(255,59,59,0.3)]">
              <XCircle size={48} className="text-[var(--color-danger)]" />
            </motion.div>
            <span className="text-[var(--color-danger)] font-mono text-sm border border-[var(--color-danger)] px-3 py-1 rounded-full">Lost Lead - ₹5,000</span>
          </div>

          {/* Solution Visuals */}
          <div className="order-icon absolute scale-0 opacity-0 flex flex-col gap-4 items-center">
            <div className="w-32 h-32 bg-[var(--color-bg-glass)] rounded-full border border-[var(--color-accent-primary)] flex items-center justify-center shadow-[var(--shadow-glow-accent)] relative">
              <Zap size={48} className="text-[var(--color-accent-primary)]" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 border border-[var(--color-accent-primary)] rounded-full"
              />
            </div>
            <span className="text-[var(--color-accent-primary)] font-mono text-sm border border-[var(--color-accent-primary)] px-3 py-1 rounded-full flex items-center gap-2">
              <CheckCircle size={14} /> Auto-Converted - ₹24,999
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
