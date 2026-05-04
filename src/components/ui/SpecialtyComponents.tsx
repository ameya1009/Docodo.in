"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

interface ChatBubbleProps {
  direction: "in" | "out";
  typing?: boolean;
  children?: React.ReactNode;
  timestamp?: string;
}

export const ChatBubble = ({ direction, typing, children, timestamp = "11:47 PM" }: ChatBubbleProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    className={cn(
      "relative max-w-[80%] px-4 py-2 rounded-[var(--radius-md)] text-sm mb-4",
      direction === "in" 
        ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-tl-none self-start" 
        : "bg-[var(--lime)]/15 border border-[var(--lime)]/20 text-[var(--text-primary)] rounded-tr-none self-end ml-auto"
    )}
  >
    {typing ? (
      <div className="flex gap-1 py-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full"
          />
        ))}
      </div>
    ) : (
      <>
        <div className="mb-1">{children}</div>
        <div className={cn(
          "flex items-center justify-end gap-1 text-[10px]",
          direction === "in" ? "text-[var(--text-muted)]" : "text-[var(--lime)]/60"
        )}>
          {timestamp}
          {direction === "out" && <CheckCheck size={12} className="text-[var(--lime)]" />}
        </div>
      </>
    )}
  </motion.div>
);

interface PlanCardProps {
  tier: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  cta: string;
  accent?: string;
  popular?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export const PlanCard = ({ 
  tier, name, description, price, features, cta, accent, popular, selected, onSelect 
}: PlanCardProps) => (
  <motion.div
    whileHover={{ 
      rotateX: 4, 
      rotateY: -4, 
      translateZ: 10,
      scale: popular ? 1.05 : 1.02
    }}
    onClick={onSelect}
    className={cn(
      "relative flex flex-col p-8 rounded-[var(--radius-xl)] cursor-pointer transition-all duration-300",
      selected ? "lime-glow-border z-10" : "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
      popular && "scale-[1.04]"
    )}
    style={{ perspective: "1000px" }}
  >
    {popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--lime)] text-black text-[10px] font-black uppercase tracking-widest rounded-full">
        Most Popular
      </div>
    )}
    
    <div className="mb-6">
      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs border" style={{ borderColor: accent, color: accent }}>
        {tier}
      </span>
      <h3 className="text-2xl mt-4 mb-2">{name}</h3>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>

    <div className="mb-8">
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black">₹{price.toLocaleString()}</span>
        <span className="text-[var(--text-muted)] text-sm">/mo</span>
      </div>
    </div>

    <div className="flex-grow mb-8 space-y-3">
      {features.map((feature, i) => (
        <div key={i} className="flex gap-3 text-sm">
          <Check size={16} className="shrink-0 mt-0.5" style={{ color: accent || "var(--lime)" }} />
          <span className="text-[var(--text-secondary)]">{feature}</span>
        </div>
      ))}
    </div>

    <button className={cn(
      "w-full py-4 rounded-[var(--radius-sm)] font-bold text-sm uppercase tracking-widest transition-all",
      popular ? "bg-[var(--lime)] text-black hover:brightness-110" : "bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
    )}>
      {cta}
    </button>
  </motion.div>
);

export const ToolCard = ({ name, description, badge, stat, icon: Icon, href }: any) => (
  <motion.div
    whileHover={{ rotateX: 2, rotateY: -2, translateZ: 5 }}
    className="group relative p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] hover:border-[var(--lime)]/30 hover:shadow-[var(--lime-glow-sm)] transition-all"
    style={{ perspective: "1000px" }}
  >
    {badge && (
      <div className="absolute top-6 right-6 px-2 py-0.5 bg-[var(--bg-elevated)] border border-white/5 text-[10px] font-bold text-[var(--text-muted)] uppercase rounded-xs">
        {badge}
      </div>
    )}
    
    <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--lime-ghost)] text-[var(--lime)] group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>

    <h3 className="text-xl mb-3">{name}</h3>
    <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
      {description}
    </p>

    <div className="flex items-center justify-between pt-6 border-top border-[var(--border-subtle)]">
      <span className="text-xs font-bold text-[var(--lime)] uppercase tracking-widest">{stat}</span>
      <span className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
        Learn More →
      </span>
    </div>
  </motion.div>
);

interface TestimonialCardProps {
  name?: string;
  company: string;
  industry?: string;
  metric: string;
  quote: string;
  before: string;
  after: string;
  plan: string;
}

export const TestimonialCard = ({ company, industry, metric, quote, before, after, plan }: TestimonialCardProps) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div 
      className="relative w-full h-80 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 15 }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 w-full h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8 flex flex-col items-center justify-center text-center shadow-xl backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-[var(--lime)] text-4xl md:text-5xl font-black mb-4 leading-tight">
            {metric}
          </div>
          <div className="text-lg font-bold mb-1">{company}</div>
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">
            {industry}
          </div>
          <div className="mt-8 text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em]">
            Hover to see proof
          </div>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 w-full h-full bg-[var(--bg-elevated)] border border-[var(--lime)]/20 rounded-[var(--radius-xl)] p-8 flex flex-col shadow-2xl backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <p className="text-sm text-[var(--text-primary)] italic mb-6 leading-relaxed">
            "{quote}"
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Before</div>
              <div className="text-xs text-red-500 font-bold">{before}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">After</div>
              <div className="text-xs text-[var(--lime)] font-bold">{after}</div>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Plan</span>
            <span className="text-[10px] font-bold text-[var(--lime)] uppercase tracking-widest">{plan}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
