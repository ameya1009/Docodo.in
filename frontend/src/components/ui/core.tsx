import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -----------------------------
// Button Primitives
// -----------------------------
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[var(--color-accent-primary)] text-black hover:scale-[1.02] hover:-translate-y-[2px] shadow-[var(--shadow-glow-button)]",
      secondary: "bg-transparent border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)] hover:text-black",
      ghost: "bg-transparent text-[var(--color-text-primary)] hover:underline decoration-[var(--color-accent-primary)] underline-offset-4",
      whatsapp: "bg-[#25D366] text-white hover:scale-[1.02] shadow-[0_0_20px_rgba(37,211,102,0.4)] animate-pulse hover:animate-none",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-8 text-base",
      lg: "h-14 px-10 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// -----------------------------
// Card Primitives
// -----------------------------
export const GlassCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[var(--color-bg-glass)] backdrop-blur-xl border border-[var(--color-border)] rounded-2xl p-6 transition-all duration-400 ease-[var(--ease-smooth)] hover:border-[var(--color-border-hover)] hover:-translate-y-1 hover:shadow-[var(--shadow-glow-card)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

// -----------------------------
// Badge Primitives
// -----------------------------
export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'popular' | 'new', className?: string }) => {
  const variants = {
    default: "border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
    popular: "bg-[var(--color-accent-primary)] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse",
    new: "bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
  };
  return (
    <span className={cn(variants[variant], className)}>
      {children}
    </span>
  );
};

// -----------------------------
// Input Primitives
// -----------------------------
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
