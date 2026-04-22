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
        category: "Clinic Growth",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
        color: '#00D4FF',
        description: 'Auto-lead capture system for a Pune clinic. Delivering structured patient inquiries with zero tech hassle.',
        stats: ['200% Lead Growth', '₹45k/mo Bookings', 'WhatsApp Integrated'],
    },
    {
        title: "Dr. Patangankar",
        category: "Medical Centre",
        image: "https://images.unsplash.com/photo-1629909613654-28705fe478c5?auto=format&fit=crop&q=80&w=1200",
        color: '#FF6B6B',
        description: 'Complete digital transformation for a Baner medical facility, driving massive local SEO visibility.',
        stats: ['Top 3 Local Pack', '₹50k/mo Extra ROI', 'Seamless Booking'],
    },
    {
        title: "Viman Nagar Cafe",
        category: "Local Service",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200",
        color: '#00D4FF',
        description: 'Increased monthly orders using a custom WhatsApp ordering bot tailored for Pune foodies.',
        stats: ['₹40k Order Boost', 'Daily 50+ Inquiries', 'Auto-Menu Bot'],
    },
    {
        title: "Baner Styling Salon",
        category: "Wellness SMB",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200",
        color: '#C0C0C0',
        description: 'Automated booking calendar reducing salon no-shows by 80% and increasing high-value service sales.',
        stats: ['80% No-Show Drop', '₹35k Extra Sales', 'Member CRM'],
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
                        <motion.span className={styles.label}>ROI Case Studies</motion.span>
                        <h2 className="text-white text-5xl font-extrabold mb-4 tracking-tighter">Pune Success Stories</h2>
                        <p className={styles.subtitle}>
                            Sites + Apps + Marketing + Bots. See how Docodo delivers real growth for local legends.
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
