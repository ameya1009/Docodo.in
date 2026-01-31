'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FloatingShapes } from '@/components/ui/FloatingShapes';
import styles from './Hero.module.css';

export function Hero() {
    return (
        <section className={styles.hero}>
            <FloatingShapes />
            <div className="container">
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className={styles.headline}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Digital Growth Studio<br />
                        <span className="text-gradient">For Modern Business.</span>
                    </motion.h1>

                    <motion.p
                        className={styles.subheadline}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        We build high-performance websites, automate your marketing, and simplify operations.
                        Founder-led, hands-on, and built for results.
                    </motion.p>

                    <motion.div
                        className={styles.ctas}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Button size="lg">Get a Free Audit</Button>
                        <Button variant="outline" size="lg">How We Work</Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Background/abstract elements can go here */}
            <div className={styles.glow} />
        </section>
    );
}
