import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export const GlassCard = ({ children, className, glow = false, ...props }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 perspective-1000",
        glow && "neon-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
