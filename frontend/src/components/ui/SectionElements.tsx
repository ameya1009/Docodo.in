"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  variant?: "default" | "elevated" | "glass" | "bordered";
  className?: string;
  children: React.ReactNode;
}

export const Card = ({ variant = "default", className, children }: CardProps) => {
  const baseStyles = "rounded-[var(--radius-md)] transition-all duration-180 ease-[var(--ease-out-expo)] shadow-[var(--shadow-md)] overflow-hidden";
  
  const variants = {
    default: "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
    elevated: "bg-[var(--bg-elevated)] border border-[var(--border-strong)]",
    glass: "glass", // Class defined in globals.css
    bordered: "bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:border-[var(--lime)]/40",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)}>
      {children}
    </div>
  );
};

export const SectionLabel = ({ 
  children, 
  dot = true,
  className 
}: { 
  children: React.ReactNode; 
  dot?: boolean;
  className?: string;
}) => (
  <div className={cn("flex items-center gap-3 text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em]", className)}>
    {dot && (
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--lime)] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--lime)]"></span>
      </span>
    )}
    {children}
  </div>
);

interface SectionHeadingProps {
  eyebrow?: string;
  headline: string;
  sub?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading = ({
  eyebrow,
  headline,
  sub,
  align = "center",
  className,
}: SectionHeadingProps) => (
  <div className={cn(
    "flex flex-col gap-4 mb-12",
    align === "center" ? "items-center text-center" : "items-start text-left",
    className
  )}>
    {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}
    <h2 className={cn(
      "text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1]",
      align === "center" && "max-w-3xl"
    )}>
      {headline}
    </h2>
    {sub && (
      <p className={cn(
        "text-[var(--text-secondary)] text-lg max-w-xl",
        align === "center" && "mx-auto"
      )}>
        {sub}
      </p>
    )}
  </div>
);
