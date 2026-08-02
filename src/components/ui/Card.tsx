import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "surface" | "glass" | "outline" | "interactive" | "bordered";
  hover?: boolean;
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = false, children, ...props }, ref) => {
    const baseStyles = "rounded-[var(--radius-xl)] border transition-all duration-200 ease-[var(--ease-out-expo)] text-[var(--text-primary)]";

    const variants: Record<NonNullable<CardProps["variant"]>, string> = {
      default: "bg-[var(--bg-surface)] border-[var(--border-subtle)] p-6 shadow-sm",
      elevated: "bg-[var(--bg-elevated)] border-[var(--border-default)] p-6 shadow-md",
      surface: "bg-[var(--bg-surface)] border-[var(--border-subtle)] p-6",
      glass: "bg-[var(--bg-elevated)]/60 backdrop-blur-xl border-white/5 p-6 shadow-xl",
      outline: "bg-transparent border-[var(--border-strong)] p-6",
      interactive: "bg-[var(--bg-surface)] border-[var(--border-subtle)] p-6 cursor-pointer hover:border-[var(--lime)]/50 hover:bg-[var(--bg-elevated)]",
      bordered: "bg-[var(--bg-surface)] border-[var(--border-default)] p-6",
    };

    const hoverStyles = hover
      ? "hover:border-[var(--border-strong)] hover:shadow-lg hover:-translate-y-0.5"
      : "";

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
