'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import styles from './Portfolio.module.css';

const works = [
    {
        title: 'Neon Fintech Portal',
        category: 'FINTECH & SAAS',
        description: 'Engineered a conversion-focused dashboard that increased user retention by 35% through intuitive IA.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
        color: 'var(--color-primary)'
    },
    {
        title: 'Aura Wellness',
        category: 'D2C E-COMMERCE',
        description: 'Complete brand transformation and headless commerce implementation resulting in 3x revenue growth.',
        image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200',
        color: 'var(--color-secondary)'
    },
    {
        title: 'Nexus AI Dashboard',
        category: 'AI ARCHITECTURE',
        description: 'Next-gen analytics platform for enterprise AI teams, focusing on complex data visualization.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
        color: 'var(--color-accent)'
    },
    {
        title: 'Urban Estate',
        category: 'PROPTECH',
        description: 'Immersive real-estate discovery engine with AR integration and intelligent lead capture.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
        color: 'var(--color-primary)'
    },
    {
        title: 'Flow Automate',
        category: 'REV-OPS',
        description: 'Strategic B2B automation systems that removed procurement friction for scaling startups.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
        color: 'var(--color-secondary)'
    },
    {
        title: 'Zenith Brand',
        category: 'ID & SYSTEMS',
        description: 'Modular design system and category-defining identity for a category-leading digital studio.',
        image: 'https://images.unsplash.com/photo-1634942537034-2531766767d7?auto=format&fit=crop&q=80&w=1200',
        color: 'var(--color-accent)'
    }
];

export default function PortfolioPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            <section className={styles.hero}>
                <div className="container">
                    <motion.span
                        className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Success Stories
                    </motion.span>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Our <span className="text-gradient">Portfolio.</span>
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        We don&apos;t just build websites; we engineer demand-generation engines
                        and brand ecosystems that drive measurable growth.
                    </motion.p>
                </div>
            </section>

            <div className="container">
                <motion.div
                    className={styles.grid}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    {works.map((work, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={work.image}
                                        alt={work.title}
                                        fill
                                        className={styles.image}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className={styles.overlay} />
                                    <div className={styles.content}>
                                        <span className={styles.tag}>{work.category}</span>
                                        <h3 className={styles.cardTitle}>{work.title}</h3>
                                        <p className={styles.description}>{work.description}</p>
                                        <Button variant="outline" size="sm" className="mt-4 border-white/20 hover:bg-white hover:text-black">
                                            View Outcome <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}

