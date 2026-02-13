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
        title: 'Dr. Patangankar',
        category: 'HEALTHCARE ARCHITECTURE',
        description: 'A comprehensive digital ecosystem for a specialized medical centre, streamlining patient acquisition and authority.',
        image: '/images/clients/dr-patangankar.jpg',
        color: 'var(--color-primary)'
    },
    {
        title: 'BIOgram',
        category: 'HEALTH & NUTRITION',
        description: 'Scaling a wellness brand through systematic identity design and acquisition-focused architecture.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba9690a?auto=format&fit=crop&q=80&w=1200',
        color: 'var(--color-secondary)'
    },
    {
        title: 'Clearth',
        category: 'SUSTAINABILITY',
        description: 'Brand transformation and digital systems for an eco-conscious growth initiative.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
        color: 'var(--color-accent)'
    },
    {
        title: 'KKY',
        category: 'FOUNDER BRANDING',
        description: 'Personal authority positioning and minimalist visual systems for a leader-led venture.',
        image: 'https://images.unsplash.com/photo-1634942537034-2531766767d7?auto=format&fit=crop&q=80&w=1200',
        color: 'var(--color-primary)'
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

