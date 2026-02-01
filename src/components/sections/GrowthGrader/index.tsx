'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Target, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import styles from './GrowthGrader.module.css';

export function GrowthGrader() {
    return (
        <section className={styles.grader}>
            <div className="container">
                <div className={styles.containerInner + ' glass'}>
                    <div className={styles.content}>
                        <motion.div
                            className={styles.badges}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className={styles.badge}><Zap className="w-4 h-4" /> Strategic</span>
                            <span className={styles.badge}><Target className="w-4 h-4" /> Precise</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Stop guessing. Start <span className="text-gradient">Benchmarking.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Our 2026 Growth Grader analyzes your current GTM strategy,
                            website conversion architecture, and lead generation velocity.
                        </motion.p>

                        <motion.div
                            className={styles.stats}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className={styles.stat}>
                                <div className={styles.statIcon}><TrendingUp /></div>
                                <div>
                                    <div className={styles.statValue}>15 Min</div>
                                    <div className={styles.statLabel}>To Complete</div>
                                </div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statIcon}><BarChart3 /></div>
                                <div>
                                    <div className={styles.statValue}>Full Report</div>
                                    <div className={styles.statLabel}>Sent to Email</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button size="lg" className={styles.ctaButton} onClick={() => window.location.href = '/contact'}>
                                Grade Your Growth Now
                            </Button>
                        </motion.div>
                    </div>

                    <div className={styles.visual}>
                        <div className={styles.glow} />
                        <div className={styles.glowSecondary} />
                        {/* Decorative elements representing a dashboard or chart */}
                        <div className={styles.chartMockup}>
                            <div className={styles.bar + ' ' + styles.bar1} />
                            <div className={styles.bar + ' ' + styles.bar2} />
                            <div className={styles.bar + ' ' + styles.bar3} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
