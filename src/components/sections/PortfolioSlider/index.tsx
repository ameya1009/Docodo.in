'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './PortfolioSlider.module.css';

const projects = [
    {
        title: "BIOgram Health",
        category: "Branding",
        image: "/images/clients/biogram.png",
        color: '#22C55E',
        description: 'Identity design and digital positioning for a healthcare nutrition platform.',
        stats: ['Cohesive Brand Identity', 'User-centric Interface', 'Healthcare Tech Stack'],
    },
    {
        title: "Clearth GTM",
        category: "Strategy",
        image: "/images/clients/clearth.jpg",
        color: '#2DD4BF',
        description: 'Visual language and strategic messaging for an eco-conscious initiative.',
        stats: ['"Clearth Starts With You" Campaign', 'Brand Storytelling', 'Growth Architecture'],
    },
    {
        title: 'Dr. Patangankar',
        category: 'Medical Centre Digital Overhaul',
        image: '/images/clients/dr-patangankar.jpg',
        color: '#0EA5E9',
        description: 'Complete digital presence engineering for a leading Neuro, Spine & Pain Management Centre.',
        stats: ['Streamlined Patient Funnel', 'Institutional Authority', 'Conversion-First Design'],
    },
    {
        title: 'Clearth',
        category: 'Sustainable Brand Systems',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
        color: '#2DD4BF',
        description: 'Visual language and strategic messaging for an eco-conscious initiative.',
        stats: ['"Clearth Starts With You" Campaign', 'Brand Storytelling', 'Growth Architecture'],
    },
    {
        title: 'KKY',
        category: 'Personal Identity & Positioning',
        image: 'https://images.unsplash.com/photo-1634942537034-2531766767d7?auto=format&fit=crop&q=80&w=1200',
        color: '#A855F7',
        description: 'Bespoke identity system for a founder-led venture.',
        stats: ['Minimalist Aesthetic', 'Authority Positioning', 'Scalable Asset Library'],
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
                                        className={`${styles.image} object-cover`}
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
