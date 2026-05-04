"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "lime" | "ghost" | "success" | "warning" | "outline";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export const Badge = ({
  variant = "lime",
  size = "md",
  className,
  children,
}: BadgeProps) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold uppercase tracking-wider rounded-[var(--radius-xs)] transition-colors duration-180";
  
  const variants = {
    lime: "bg-[var(--lime-ghost)] border border-[var(--lime)]/20 text-[var(--lime)]",
    ghost: "bg-[var(--bg-elevated)] text-[var(--text-muted)]",
    success: "bg-green-500/10 border border-green-500/20 text-[var(--success)]",
    warning: "bg-yellow-500/10 border border-yellow-500/20 text-[var(--warning)]",
    outline: "border border-[var(--border-strong)] text-[var(--text-secondary)]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

export const Tag = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span className={cn("inline-flex items-center px-3 py-1 bg-[var(--bg-elevated)] text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-bold rounded-full border border-white/5", className)}>
    {children}
  </span>
);

export const GlowOrb = ({ 
  size = "md", 
  color = "lime", 
  className,
  animate = true
}: { 
  size?: "sm" | "md" | "lg"; 
  color?: "lime" | "teal"; 
  className?: string;
  animate?: boolean;
}) => {
  const sizes = {
    sm: "w-[200px] h-[200px]",
    md: "w-[400px] h-[400px]",
    lg: "w-[800px] h-[800px]",
  };

  const colors = {
    lime: "bg-[var(--lime)]",
    teal: "bg-[var(--teal)]",
  };

  return (
    <div 
      className={cn(
        "absolute rounded-full blur-[80px] opacity-20 pointer-events-none mix-blend-screen",
        sizes[size],
        colors[color],
        animate && "animate-[float_8s_ease-in-out_infinite_alternate]",
        className
      )}
    />
  );
};
