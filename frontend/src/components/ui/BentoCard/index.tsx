'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    span?: '1x1' | '1x2' | '2x1' | '2x2' | '3x1' | '3x2';
    glowColor?: string;
    dark?: boolean;
    videoSrc?: string;
}

const spanClasses = {
    '1x1': 'col-span-1 row-span-1',
    '1x2': 'col-span-1 row-span-2',
    '2x1': 'col-span-1 md:col-span-2 row-span-1',
    '2x2': 'col-span-1 md:col-span-2 row-span-2',
    '3x1': 'col-span-1 md:col-span-3 row-span-1',
    '3x2': 'col-span-1 md:col-span-3 row-span-2',
};

export function BentoCard({
    children,
    className,
    span = '1x1',
    glowColor = 'rgba(124, 58, 237, 0.15)', // Default to violet
    dark = true,
    videoSrc
}: BentoCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const mouseXSpring = useSpring(mouseX, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(mouseY, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

    // Direct mouse position for the glow effect
    const glowX = useMotionValue(0);
    const glowY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        
        glowX.set(localX);
        glowY.set(localY);

        const xPct = localX / width - 0.5;
        const yPct = localY / height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        // We don't reset glow position so it stays where it left off, but we could fade it out if needed
    };

    const background = useMotionTemplate`radial-gradient(600px circle at ${glowX}px ${glowY}px, ${glowColor}, transparent 40%)`;

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.01, y: -5 }}
            whileTap={{ scale: 0.98 }}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            className={cn(
                "relative rounded-[2rem] overflow-hidden border transition-colors group",
                dark ? "bg-[#0E0C15]/80 backdrop-blur-xl border-white/5 hover:border-white/10" : "bg-white border-zinc-200",
                spanClasses[span],
                className
            )}
        >
            {/* Background Glow Effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background }}
            />
            
            {/* Base gradient for dark mode */}
            {dark && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            )}

            {videoSrc === 'mock' ? (
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-zinc-900/50 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C15] via-[#0E0C15]/50 to-transparent" />
                </div>
            ) : videoSrc && (
                <div className="absolute inset-0 z-0">
                    <video
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-50 mix-blend-screen"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C15] via-[#0E0C15]/50 to-transparent" />
                </div>
            )}

            <div className="relative z-10 w-full h-full p-8 md:p-10 transform-gpu" style={{ transform: "translateZ(30px)" }}>
                {children}
            </div>
        </motion.div>
    );
}
