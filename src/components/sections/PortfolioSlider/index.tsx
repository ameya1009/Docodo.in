'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './PortfolioSlider.module.css';

const projects = [
    {
        title: 'Neon Fintech Portal',
        category: 'Scaling (+40% CAC Efficiency)',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
        color: '#00E5FF',
        description: 'A comprehensive fintech portal overhaul focusing on user conversion and CAC efficiency.',
        stats: ['40% CAC reduction', '2x User retention', 'Secure API integration'],
    },
    {
        title: 'Aura Wellness',
        category: '3x Direct Revenue Transformation',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200',
        color: '#7C3AED',
        description: 'E-commerce transformation for a wellness brand, resulting in a 3x increase in direct revenue.',
        stats: ['300% Revenue growth', 'Mobile-first design', 'Seamless checkout flow'],
    },
    {
        title: 'Nexus AI Dashboard',
        category: 'Engineered for Product-Led Growth',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
        color: '#F59E0B',
        description: 'Advanced dashboard for an AI product, designed specifically to drive product-led growth.',
        stats: ['User-centric UI', 'Real-time analytics', 'PLG-focused UX'],
    },
    {
        title: 'Sentient Solutions',
        category: '5X Organic Search Growth',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200',
        color: '#00E5FF',
        description: 'Strategic content and architecture overhaul leading to 5x organic growth.',
        stats: ['500% SEO traffic', 'High-intent lead gen', 'Authority building'],
    }
];

function ProjectModal({ project, onClose }: { project: typeof projects[0], onClose: () => void }) {
    return (
        <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                style={{ borderTop: `4px solid ${project.color}` }}
            >
                <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>

                <div className={styles.modalGrid}>
                    <div className={styles.modalImageWrapper}>
                        <Image src={project.image} alt={project.title} fill className={styles.modalImage} />
                    </div>

                    <div className={styles.modalInfo}>
                        <span className={styles.modalCategory} style={{ color: project.color }}>{project.category}</span>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>

                        <div className={styles.modalStats}>
                            {project.stats.map((stat, i) => (
                                <div key={i} className={styles.statItem}>
                                    <div className={styles.statDot} style={{ background: project.color }} />
                                    {stat}
                                </div>
                            ))}
                        </div>

                        <div className={styles.modalActions}>
                            <Button variant="primary" onClick={() => window.location.href = '/contact'} className="w-full">
                                Get Similar Results <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export function PortfolioSlider() {
    const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
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
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={styles.viewBtn}
                                            onClick={() => setSelectedProject(project)}
                                        >
                                            View Outcome
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
