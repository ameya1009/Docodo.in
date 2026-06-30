import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    asChild?: boolean;
}

const variantStyles = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]",
    secondary: "bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.2)]",
    outline: "border border-white/20 bg-white/5 hover:bg-white/10 text-white",
    ghost: "bg-transparent hover:bg-white/10 text-white",
    link: "bg-transparent text-violet-400 hover:text-violet-300 underline-offset-4 hover:underline p-0 h-auto"
};

const sizeStyles = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-base"
};

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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </>
        );

        return (
            <Comp
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
                    variant !== 'link' && variantStyles[variant],
                    variant === 'link' && variantStyles.link,
                    variant !== 'link' && sizeStyles[size],
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
