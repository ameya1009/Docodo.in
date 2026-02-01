'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FloatingShapes } from '@/components/ui/FloatingShapes';
import styles from './Hero.module.css';

export function Hero() {
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
                                staggerChildren: 0.15
                            }
                        }
                    }}
                >
                    <motion.div
                        className={styles.trustBadge}
                        variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        Built by Ameya Kshirsagar, Electronics Engineer
                    </motion.div>

                    <motion.h1
                        className={styles.headline}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Digital growth for founders<br />
                        <span className="text-gradient">who move fast.</span>
                    </motion.h1>

                    <motion.p
                        className={styles.subheadline}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        Strategy + execution. No fluff, just systems that work.
                        We build websites, automate marketing, and simplify operations.
                    </motion.p>

                    <motion.div
                        className={styles.ctas}
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.6 }}
                    >
                        <Button size="lg" onClick={() => window.location.href = '/contact'}>
                            Get a Free Audit
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => window.location.href = '/about#how-we-work'}>
                            See How We Work
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            <div className={styles.glow} />
        </section>
    );
}
