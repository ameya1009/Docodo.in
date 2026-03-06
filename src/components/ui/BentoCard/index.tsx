'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './BentoCard.module.css';

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    span?: '1x1' | '1x2' | '2x1' | '2x2' | '3x1' | '3x2';
    glowColor?: string;
    dark?: boolean;
    videoSrc?: string;
}

export function BentoCard({
    children,
    className,
    span = '1x1',
    glowColor = 'rgba(0, 212, 255, 0.2)',
    dark = true,
    videoSrc
}: BentoCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            className={cn(
                styles.card,
                styles[`span_${span}`],
                dark ? styles.dark : styles.light,
                className
            )}
        >
            {videoSrc && (
                <div className={styles.videoContainer}>
                    <video
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={styles.video}
                    />
                    <div className={styles.videoOverlay} />
                </div>
            )}

            <div
                className={styles.glow}
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${glowColor}, transparent 40%)`
                } as any}
            />

            <div className={styles.content}>
                {children}
            </div>
        </motion.div>
    );
}
