"use client";

import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Card } from "@/components/ui/Card";
import { ChatBubble } from "@/components/ui/SpecialtyComponents";
import { PAIN_POINTS } from "@/lib/constants";

export const PainPoints = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1 = useRef<HTMLDivElement>(null);
  const section2 = useRef<HTMLDivElement>(null);
  const section3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = [section1.current, section2.current, section3.current];
      
      // Pin the main container
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1,
      });

      // Animate between sections
      sections.forEach((section, i) => {
        if (i === 0) return; // First section is visible by default

        gsap.fromTo(section, 
          { x: "100%", opacity: 0 },
          { 
            x: "0%", 
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: `${i * 100}% top`,
              end: `${(i + 1) * 100}% top`,
              scrub: true,
            }
          }
        );

        // Slide out the previous section
        gsap.to(sections[i - 1], {
          x: "-20%",
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: `${i * 100}% top`,
            end: `${(i + 1) * 100}% top`,
            scrub: true,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen bg-[var(--bg-void)] overflow-hidden">
      {/* Scene 1: The Missed Lead */}
      <div ref={section1} className="absolute inset-0 flex items-center justify-center">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 flex flex-col gap-8">
            <div className="p-6 bg-[#0B0E11] rounded-[var(--radius-xl)] border border-white/5 shadow-2xl max-w-sm mx-auto md:mx-0">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-[var(--text-muted)]">WhatsApp</span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">11:47 PM</span>
              </div>
              <ChatBubble direction="in">Hi, is appointment available tomorrow?</ChatBubble>
              <ChatBubble direction="in">Anyone there?</ChatBubble>
              <ChatBubble direction="in">Never mind, going to XYZ clinic</ChatBubble>
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-6 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full text-center"
              >
                Lead Lost
              </motion.div>
            </div>
          </div>
          <div className="order-1 md:order-2 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl mb-6">{PAIN_POINTS[0].headline}</h2>
            <p className="text-[var(--text-secondary)] text-lg">{PAIN_POINTS[0].sub}</p>
          </div>
        </div>
      </div>

      {/* Scene 2: The Excel Chaos */}
      <div ref={section2} className="absolute inset-0 flex items-center justify-center">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl mb-6">{PAIN_POINTS[1].headline}</h2>
            <p className="text-[var(--text-secondary)] text-lg">{PAIN_POINTS[1].sub}</p>
          </div>
          <div className="flex flex-col gap-8">
            <Card variant="elevated" className="p-0 overflow-hidden border border-white/5">
              <div className="bg-[var(--bg-surface)] p-4 border-b border-[var(--border-subtle)] flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <div className="p-4 font-mono text-[10px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[var(--text-muted)]">
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--text-secondary)]">
                    <tr className="border-t border-white/5">
                      <td className="py-3">Rahul S.</td>
                      <td><span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded">Lost</span></td>
                      <td className="line-through">Forgot to call back</td>
                    </tr>
                    <tr className="border-t border-white/5">
                      <td className="py-3">Priya K.</td>
                      <td><span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded">Cold</span></td>
                      <td>Wait... who is this?</td>
                    </tr>
                    <tr className="border-t border-white/5">
                      <td className="py-3">Amit M.</td>
                      <td><span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded">Missed</span></td>
                      <td className="line-through">Call not picked up</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Scene 3: The 4-Job Burnout */}
      <div ref={section3} className="absolute inset-0 flex items-center justify-center">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative h-80 flex items-center justify-center">
            {/* Person Icon */}
            <div className="absolute w-20 h-20 bg-[var(--bg-elevated)] rounded-full flex items-center justify-center text-[var(--text-muted)]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            {/* Drifting Jobs */}
            {['Sales', 'Support', 'Marketing', 'Billing'].map((job, i) => (
              <motion.div
                key={job}
                animate={{ 
                  y: [0, -40, 0], 
                  rotate: [0, i % 2 === 0 ? 5 : -5, 0],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: i * 0.5 
                }}
                className={cn(
                  "absolute px-6 py-3 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-[var(--radius-md)] text-xs font-bold uppercase tracking-widest shadow-xl",
                  i === 0 && "-top-10 left-0",
                  i === 1 && "top-0 -right-10",
                  i === 2 && "bottom-0 -left-10",
                  i === 3 && "-bottom-10 right-0"
                )}
              >
                <div className="flex items-center gap-2">
                  <motion.span 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border-2 border-[var(--lime)] border-t-transparent rounded-full"
                  />
                  {job}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="order-1 md:order-2 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl mb-6">{PAIN_POINTS[2].headline}</h2>
            <p className="text-[var(--text-secondary)] text-lg">{PAIN_POINTS[2].sub}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
