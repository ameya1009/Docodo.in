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
                    <motion.div
                        className={styles.trustBadge}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        Built by Ameya Kshirsagar, Electronics Engineer
                    </motion.div>

                    <motion.h1
                        className={styles.headline}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Digital growth for founders<br />
                        <span className="text-gradient">who move fast.</span>
                    </motion.h1>

                    <motion.p
                        className={styles.subheadline}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Strategy + execution. No fluff, just systems that work.
                        We build websites, automate marketing, and simplify operations.
                    </motion.p>

                    <motion.div
                        className={styles.ctas}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
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
