'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import styles from './PortfolioSlider.module.css';

const projects = [
    {
        title: 'Neon Fintech Portal',
        category: 'Scaling (+40% CAC Efficiency)',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
        color: '#00E5FF',
    },
    {
        title: 'Aura Wellness',
        category: '3x Direct Revenue Transformation',
        image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200',
        color: '#7C3AED',
    },
    {
        title: 'Nexus AI Dashboard',
        category: 'Engineered for Product-Led Growth',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
        color: '#F59E0B',
    },
    {
        title: 'Sentient Solutions',
        category: '5X Organic Search Growth',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e905263543?auto=format&fit=crop&q=80&w=1200',
        color: '#00E5FF',
    }
];

export function PortfolioSlider() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "-50%"]);

    return (
        <section ref={sectionRef} className={styles.section}>
            <div className={styles.sticky}>
                <div className="container">
                    <div className={styles.header}>
                        <motion.span className={styles.label}>Case Studies</motion.span>
                        <h2 className="text-gradient">Strategic Impact</h2>
                        <p className={styles.subtitle}>
                            We deliver measurable business outcomes. Explore our recent engineering triumphs.
                        </p>
                    </div>
                </div>

                <div className={styles.sliderContainer}>
                    <motion.div style={{ x }} className={styles.slider}>
                        {projects.map((project, index) => (
                            <motion.div
                                key={index}
                                className={styles.projectCard}
                                whileHover={{ y: -10 }}
                                transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                            >
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        className={styles.image}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className={styles.overlay} style={{ backgroundColor: `${project.color}30` }} />
                                    <div className={styles.cardContent}>
                                        <span className={styles.projectCategory}>{project.category}</span>
                                        <h3 className={styles.projectTitle}>{project.title}</h3>
                                        <Button variant="outline" size="sm" className={styles.viewBtn}>
                                            View Outcome
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
