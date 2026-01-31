import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = true, children, ...props }: CardProps) {
    return (
        <div
            className={cn(styles.card, hoverEffect && styles.hover, className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(styles.header, className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn(styles.title, className)} {...props}>{children}</h3>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(styles.content, className)} {...props}>{children}</div>;
}
