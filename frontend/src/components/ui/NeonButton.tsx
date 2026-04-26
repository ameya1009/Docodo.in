import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const NeonButton = ({ variant = 'primary', children, className, ...props }: NeonButtonProps) => {
  const variants = {
    primary: "bg-lime text-bg-deep hover:bg-lime-glow shadow-lime",
    secondary: "bg-transparent border border-lime/30 text-lime hover:bg-lime/10",
    ghost: "bg-transparent text-white hover:bg-white/10"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-6 py-3 rounded-full font-bold transition-all duration-200 flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
