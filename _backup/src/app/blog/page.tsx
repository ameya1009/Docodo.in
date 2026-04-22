'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Calendar, ArrowRight, Clock, Tag } from 'lucide-react';
import styles from './Blog.module.css';

interface Resource {
    title: string;
    category: string;
    description: string;
    thumbnail: string;
    readTime: string;
    date: string;
}

const resources: Resource[] = [
    {
        title: "SMB WhatsApp Bot Playbook for Pune Salons",
        category: "Automations",
        description: "How to automate 80% of your bookings and follow-ups using Botpress and WhatsApp Business API.",
        thumbnail: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800",
        readTime: "12 min read",
        date: "March 2026"
    },
    {
        title: "2026 GTM Playbook: Scale your Clinic to ₹10L/mo",
        category: "Strategy",
        description: "A data-backed guide on patient acquisition funnels and local SEO mastery for Maharashtra medical centers.",
        thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
        readTime: "15 min read",
        date: "Feb 2026"
    },
    {
        title: "Low-Cost Ads for Pune Cafes & Gyms",
        category: "Marketing",
        description: "Zero-fluff ad strategies to drive walk-ins without breaking the bank. Hinglish creative templates included.",
        thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
        readTime: "8 min read",
        date: "Jan 2026"
    },
    {
        title: "The AI Site Builder Revolution",
        category: "Websites",
        description: "Why traditional web design is dead and how AI integrated OS is the only way to scale SMBs in 2026.",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        readTime: "10 min read",
        date: "Dec 2025"
    },
    {
        title: "SaaS GTM Playbook 2026",
        category: "Strategy",
        description: "Repurposing elite B2B strategies for Tier-2 India SMB growth.",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
        readTime: "18 min read",
        date: "Nov 2025"
    }
];

export default function BlogPage() {

    const formatPreview = (html: string) => {
        const tmp = document.createElement("DIV");
        const spacedHtml = html.replace(/<\/p>|<\/h\d>|<br\s*\/?>/gi, ' ');
        tmp.innerHTML = spacedHtml;
        const text = tmp.textContent || tmp.innerText || "";
        const cleanText = text.replace(/\s+/g, ' ').trim();
        return cleanText.length > 200 ? cleanText.substring(0, 200) + "..." : cleanText;
    };

    const firstResource = resources[0];
    const remainingResources = resources.slice(1);

    return (
        <main className={styles.blogPage}>
            <Navbar />

            <div className="container">
                {/* Editorial Header */}
                <header className={styles.header}>
                    <motion.span
                        className={styles.kicker}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        SMB Growth Resources
                    </motion.span>
                    <h1 className={styles.pageTitle}>Playbooks & <span className="text-gradient">Insights.</span></h1>
                    <p className={styles.pageSubtitle}>
                        Free engineering-grade reports to help your Pune business scale 10x with AI and technical GTM.
                    </p>
                </header>

                <section className={styles.feedWrapper}>
                    {/* Featured Report */}
                    {firstResource && (
                        <motion.div
                            className={styles.featuredEntry}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className={styles.featuredImage}>
                                <img src={firstResource.thumbnail} alt={firstResource.title} />
                                <div className={styles.imageOverlay} />
                            </div>
                            <div className={styles.featuredContent}>
                                <span className={styles.featuredLabel}>Highest ROI Playbook</span>
                                <h2 className={styles.featuredTitle}>{firstResource.title}</h2>
                                <p className={styles.featuredDesc}>{firstResource.description}</p>
                                <div className={styles.metaLine}>
                                    <span className={styles.metaItem}><Clock size={14} /> {firstResource.readTime}</span>
                                    <span className={styles.metaItem}><Calendar size={14} /> {firstResource.date}</span>
                                </div>
                                <Button size="lg" className={styles.primaryReadBtn}>
                                    Download Playbook <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Grid */}
                    <div className={styles.masonryGrid}>
                        {remainingResources.map((resource, idx) => (
                            <motion.div
                                key={idx}
                                className={`${styles.blogCard} ${idx % 3 === 0 ? styles.wide : ''}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className={styles.cardThumb}>
                                    <img src={resource.thumbnail} alt={resource.title} />
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.tag}><Tag size={12} /> {resource.category}</span>
                                        <span className={styles.date}>{resource.date}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{resource.title}</h3>
                                    <p className={styles.cardDesc}>{resource.description}</p>
                                    <button className={styles.ghostLink}>
                                        Read Report <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
