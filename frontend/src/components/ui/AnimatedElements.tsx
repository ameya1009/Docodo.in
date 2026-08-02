"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";

export const StatsCounter = ({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="text-4xl md:text-5xl font-mono font-bold text-[var(--lime)] mb-2">
        {count}{suffix}
      </div>
      <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
};

export const WaveformBar = () => (
  <div className="flex items-end gap-1 h-6">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.span
        key={i}
        animate={{ height: [8, 24, 8] }}
        transition={{ 
          duration: 0.5 + Math.random() * 0.5, 
          repeat: Infinity, 
          delay: Math.random() 
        }}
        className="w-1 bg-[var(--lime)] rounded-full"
      />
    ))}
  </div>
);

export const CreditBar = ({ value, max = 50 }: { value: number; max?: number }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-2">
      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Free Credits</span>
      <span className="text-[10px] font-bold text-[var(--lime)]">{value}/{max}</span>
    </div>
    <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-[var(--lime)] shadow-[var(--lime-glow-sm)]"
      />
    </div>
  </div>
);
