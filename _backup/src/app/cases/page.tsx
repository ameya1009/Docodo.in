'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Share2, ExternalLink, TrendingUp, Users, MapPin } from 'lucide-react';
import styles from './Cases.module.css';

const cases = [
    {
        title: "Viman Nagar Cafe: Oxygenating Orders",
        category: "Growth OS + Apps",
        location: "Viman Nagar, Pune",
        desc: "Implemented a custom AI-ordering WhatsApp bot that increased digital orders by 140% in 60 days.",
        roi: "+₹42,000/mo",
        metric: "140% Orders",
        id: "viman-cafe"
    },
    {
        title: "Kothrud Dental: Auto-Pilot Bookings",
        category: "AI Marketing + Bots",
        location: "Kothrud, Pune",
        desc: "Reduced no-shows by 60% using an automated Marathi/English appointment bot integrated with local SEO.",
        roi: "60% Fewer No-shows",
        metric: "45 Bookings/mo",
        id: "kothrud-dental"
    },
    {
        title: "Baner Luxury Salon: Digital Facelift",
        category: "Websites & SEO",
        location: "Baner, Pune",
        desc: "Engineered a premium Apple-lite website with local SEO dominance. Now ranking #1 for 'Luxury Salon Baner'.",
        roi: "₹35k Extra Rev",
        metric: "Top 1 Ranking",
        id: "baner-salon"
    },
    {
        title: "Pimpri Hardware: B2B Automation",
        category: "Custom Systems",
        location: "Pimpri-Chinchwad",
        desc: "Automated inventory sync with a WhatsApp-based ordering system for regional distributors.",
        roi: "20hrs Saved/wk",
        metric: "Digital Inventory",
        id: "pimpri-hardware"
    }
];

export default function CasesPage() {
    const handleShare = (title: string) => {
        const text = `Just seen how Docodo helped a local Pune business grow! ${title} - Real ROI with AI Growth OS. 🚀 #PuneSMB #DocodoAI`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <main className="bg-black min-h-screen">
            <Navbar />

            <section className={styles.section}>
                <div className="container">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-cyan-400 font-bold uppercase tracking-widest text-xs"
                        >
                            Localized Success
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white text-5xl md:text-7xl font-extrabold mt-4 mb-6 tracking-tighter"
                        >
                            Pune <span className="text-gradient">Wins.</span>
                        </motion.h1>
                        <p className="text-zinc-500 text-lg">
                            We don&apos;t just build sites. We build profit machines for Pune&apos;s most ambitious SMBs.
                        </p>
                    </div>

                    <div className={styles.grid}>
                        {cases.map((cs, i) => (
                            <motion.div
                                key={cs.id}
                                className={styles.caseCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className={styles.image}>
                                    <TrendingUp size={48} className="text-white/10" />
                                    <div className={styles.metrics}>
                                        <div className={styles.badge}>{cs.roi}</div>
                                        <div className={styles.badge} style={{ background: 'white' }}>{cs.metric}</div>
                                    </div>
                                </div>
                                <div className={styles.content}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={styles.category}>{cs.category}</span>
                                        <span className="text-zinc-600 text-[10px] flex items-center gap-1">
                                            <MapPin size={10} /> {cs.location}
                                        </span>
                                    </div>
                                    <h2 className={styles.title}>{cs.title}</h2>
                                    <p className={styles.desc}>{cs.desc}</p>

                                    <div className={styles.footer}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 border-white/5 text-zinc-400 hover:text-white"
                                            onClick={() => handleShare(cs.title)}
                                        >
                                            <Share2 size={14} /> Share Story
                                        </Button>
                                        <Button variant="ghost" size="sm" className="gap-1 text-cyan-400">
                                            View Details <ExternalLink size={12} />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <div className="inline-block p-10 rounded-3xl bg-zinc-900/50 border border-cyan-500/20 max-w-2xl">
                            <h3 className="text-2xl font-bold text-white mb-4">You&apos;re Next.</h3>
                            <p className="text-zinc-500 mb-8">Ready to add ₹50k/month to your bottom line with AI systems? Let&apos;s audit your business today.</p>
                            <Button variant="primary" size="lg" onClick={() => window.location.href = '/growth-grader'}>
                                Start Free 50-Point Audit
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
