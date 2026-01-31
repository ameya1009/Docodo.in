import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Button.module.css';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    styles.button,
                    styles[variant],
                    styles[size],
                    isLoading && styles.loading,
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className={styles.spinner} size={16} />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
