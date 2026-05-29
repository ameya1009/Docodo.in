'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import styles from './FloatingShapes.module.css';

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
        <div className={styles.container}>
            {/* Circle 1 */}
            <motion.div
                className={`${styles.shape} ${styles.circle1}`}
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
                className={`${styles.shape} ${styles.circle2}`}
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
        </div>
    );
}
