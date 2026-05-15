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
        title: "Global SMB WhatsApp Bot Strategy 2026",
        category: "Automations",
        description: "How to automate 90% of global bookings using multi-lang agents. Hinglish/English variants included.",
        thumbnail: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800",
        readTime: "12 min read",
        date: "March 2026"
    },
    {
        title: "NYC Cafe AI Order Bot Playbook",
        category: "Food & Bev",
        description: "Standardizing $800/mo ROI via Bleecker St. automation templates.",
        thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
        readTime: "10 min read",
        date: "March 2026"
    },
    {
        title: "AI Video Marketing for Global E-Comm",
        category: "Visual Marketing",
        description: "Generating TikTok/IG Reels that drive $600/mo organic traffic.",
        thumbnail: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800",
        readTime: "15 min read",
        date: "Feb 2026"
    },
    {
        title: "London Salon Booking OS",
        category: "Health & Beauty",
        description: "Reducing Mayfair no-shows by 75% using dynamic schedule AI.",
        thumbnail: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
        readTime: "8 min read",
        date: "Feb 2026"
    },
    {
        title: "n8n Lead Gen for Singapore SMBs",
        category: "Sales Automation",
        description: "Scraping and qualifying 500+ leads/week via safe Git workflows.",
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
        readTime: "12 min read",
        date: "Jan 2026"
    },
    {
        title: "Hugging Face Models for Customer Bot",
        category: "Deep Tech",
        description: "How to use 100k-star repos to build safe, multilingual support agents.",
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
        readTime: "20 min read",
        date: "Jan 2026"
    },
    {
        title: "Whisper AI: Podcasts to Scripts",
        category: "Content Gen",
        description: "Monetizing audio into $700/mo YouTube SEO scripts using OpenAI Whisper.",
        thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800",
        readTime: "9 min read",
        date: "Dec 2025"
    },
    {
        title: "Global SEO: Multi-Locale Mastery",
        category: "Search",
        description: "Ranking #1 in 50 countries using semantic AI content nodes.",
        thumbnail: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=800",
        readTime: "14 min read",
        date: "Dec 2025"
    },
    {
        title: "Zapier Agents vs. n8n Self-Host",
        category: "Ops Strategy",
        description: "Choosing the right engine for $300/week affiliate outreach.",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bbbda5366fd6?auto=format&fit=crop&q=80&w=800",
        readTime: "11 min read",
        date: "Nov 2025"
    },
    {
        title: "Gumloop: 70% Faster Automations",
        category: "Productivity",
        description: "Building site tweaks and ad flows for e-comm inventory alerts.",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        readTime: "7 min read",
        date: "Nov 2025"
    },
    {
        title: "Affiliate Automator: Passive Income AI",
        category: "Cash Gen",
        description: "Building email/social funnels that gen $400/week in commissions.",
        thumbnail: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800",
        readTime: "13 min read",
        date: "Oct 2025"
    },
    {
        title: "AI Website Blueprint for Clinics",
        category: "Healthcare",
        description: "Patient booking + Follow-up bots in 10 mins using Docodo templates.",
        thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
        readTime: "10 min read",
        date: "Oct 2025"
    },
    {
        title: "Open-Sora: Text-to-Video for Reels",
        category: "Visual AI",
        description: "Safe, open-source alternatives to RunwayML for viral salon ads.",
        thumbnail: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800",
        readTime: "15 min read",
        date: "Sept 2025"
    },
    {
        title: "Canva AI: Global Banner Factory",
        category: "Design",
        description: "Auto-generating high-CTR ads for 50+ languages instantly.",
        thumbnail: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=800",
        readTime: "8 min read",
        date: "Sept 2025"
    },
    {
        title: "SMB Growth OS: The 2026 Vision",
        category: "Vision",
        description: "Why integrated tech is the only survival path for local legends.",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
        readTime: "12 min read",
        date: "Aug 2025"
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
        <main>
            <Navbar />

            <div className="container">
                {/* Editorial Header */}
                <header className={styles.header}>
                    <motion.span
                        className={styles.kicker}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        SMB Global Growth Hub
                    </motion.span>
                    <h1 className={styles.pageTitle}>Global AI <span className="text-gradient">Playbooks.</span></h1>
                    <p className={styles.pageSubtitle}>
                        Free engineering-grade reports to help your worldwide SMB scale 10x with AI and technical GTM.
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
