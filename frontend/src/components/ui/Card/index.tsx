import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = true, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-[2rem] bg-[#0E0C15]/80 backdrop-blur-xl border border-white/5 overflow-hidden transition-all duration-300",
                hoverEffect && "hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-6 md:p-8 border-b border-white/5", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn("text-2xl font-bold text-white", className)} {...props}>{children}</h3>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-6 md:p-8 text-zinc-400", className)} {...props}>{children}</div>;
}
