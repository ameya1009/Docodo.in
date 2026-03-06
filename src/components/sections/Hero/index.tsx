'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FloatingShapes } from '@/components/ui/FloatingShapes';
import styles from './Hero.module.css';

export function Hero() {
    const router = useRouter();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className={styles.hero}>
            <div
                className={styles.mouseFollower}
                style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y}px`
                }}
            />

            {/* Immersive Background Layer */}
            <div className={styles.bgLayers}>
                <div className={styles.videoMask}>
                    <div className={styles.abstractBlob} />
                </div>
                <div className={styles.lensFlare} />
            </div>

            <FloatingShapes />

            <div className="container">
                <motion.div
                    className={styles.content}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                >

                    <motion.div
                        className={styles.trustBadge}
                        variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                        }}
                    >
                        <span className={styles.circuitAccentInline}></span>
                        <span>AI Growth OS for Pune SMBs</span>
                        <div className={styles.badgeDot} />
                        <span>Built by Engineers</span>
                    </motion.div>

                    <motion.h1
                        className={styles.headline}
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Docodo: AI Growth OS <br />
                        <span className={styles.glitchText}>for Your Pune Business.</span>
                    </motion.h1>

                    <motion.p
                        className={styles.subheadline}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        Sites + Apps + Marketing + Bots = ₹50k+/Month Extra ROI. <br />
                        No Tech Hassle. Free Audit in 2 Mins.
                    </motion.p>

                    <motion.div
                        className={styles.ctas}
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <Button size="lg" className={styles.mainBtn} onClick={() => router.push('/growth-grader')}>
                            Get Free Audit
                        </Button>
                        <Button size="lg" className={styles.mainBtn} onClick={() => router.push('/growth-grader')}>
                            Get Free Audit
                        </Button>
                        <Button variant="outline" size="lg" className={styles.demoBtn} onClick={() => router.push('/dashboard/marketplace')}>
                            Try Demo
                        </Button>
                        <Button variant="ghost" size="lg" className={styles.secBtn} onClick={() => router.push('/contact')}>
                            Book Call
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            <div className={styles.gradientOverlay} />
        </section>
    );
}
