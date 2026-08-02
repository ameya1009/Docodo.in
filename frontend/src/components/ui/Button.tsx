"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-[var(--radius-sm)] font-medium transition-all duration-180 ease-[var(--ease-out-expo)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)]/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";
  
  const variants = {
    primary: "bg-[var(--lime)] text-black hover:brightness-110",
    secondary: "border border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
    ghost: "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]",
    danger: "bg-[var(--danger)] text-white hover:brightness-110",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
