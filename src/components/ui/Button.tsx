"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-[var(--radius-sm)] font-medium transition-all duration-180 ease-[var(--ease-out-expo)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)]/40 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[var(--lime)] text-black hover:brightness-110 active:scale-[0.97]",
    secondary: "border border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] active:scale-[0.97]",
    ghost: "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] active:scale-[0.97]",
    danger: "bg-[var(--danger)] text-white hover:brightness-110 active:scale-[0.97]",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};
