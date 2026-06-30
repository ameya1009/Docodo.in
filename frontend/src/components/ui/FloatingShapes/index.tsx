'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export function FloatingShapes() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    // Parallax transforms: shapes move slightly opposite to mouse
    const x1 = useTransform(springX, [-1000, 1000], [40, -40]);
    const y1 = useTransform(springY, [-1000, 1000], [40, -40]);

    const x2 = useTransform(springX, [-1000, 1000], [-30, 30]);
    const y2 = useTransform(springY, [-1000, 1000], [-30, 30]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
            mouseY.set(e.clientY - window.innerHeight / 2);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Circle 1 */}
            <motion.div
                className="absolute top-1/4 -left-[10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] mix-blend-screen"
                style={{ x: x1, y: y1 }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Circle 2 */}
            <motion.div
                className="absolute top-1/2 -right-[10%] w-[600px] h-[600px] bg-mint-500/10 rounded-full blur-[100px] mix-blend-screen"
                style={{ x: x2, y: y2 }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />
            
            {/* Extra subtle center glow */}
            <motion.div
                className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] mix-blend-screen"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
