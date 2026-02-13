import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Button.module.css';
import { Loader2 } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, asChild = false, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        // Filter out whitespace and empty fragments
        const childrenArray = React.Children.toArray(children).filter(child => {
            if (typeof child === 'string') return child.trim() !== '';
            return child !== null && child !== undefined;
        });

        // When asChild is true, Slot expects exactly one child.
        // We ensure we only pass the first valid child.
        const content = asChild ? childrenArray[0] : (
            <>
                {isLoading && <Loader2 className={styles.spinner} size={16} />}
                {children}
            </>
        );

        return (
            <Comp
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
                {content}
            </Comp>
        );
    }
);

Button.displayName = 'Button';
