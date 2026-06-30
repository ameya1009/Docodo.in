'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Layout, LineChart, Bot, CheckCircle2, ChevronRight, Zap, Smartphone, Sparkles } from 'lucide-react';
import styles from './Services.module.css';

const serviceDetails = [
    {
        id: "sites",
        title: "Websites & Apps",
        label: "Digital Engines",
        icon: <Layout className="w-8 h-8" />,
        description: "We engineer pixel-perfect, premium Next.js websites and web applications tailored for modern businesses. Designed with Apple-level standards, lightning-fast transitions, and high-conversion pathways.",
        features: [
            "Next.js High-Performance Architecture",
            "Apple-Standard Modern UI/UX",
            "Mobile, Tablet, and Desktop optimization",
            "Razorpay, Stripe & UPI Gateway Ready",
            "Hassle-free deployment with 99.9% uptime"
        ],
        pricing: "Starter ₹5,999 | Growth ₹15,999",
        funnyCopy: "⚠️ Warning: Having a website this beautiful might make your competitors question their life choices.",
        visual: {
            title: "Designed Wordmark & Fluid UI",
            elements: [95, 80, 60, 90]
        }
    },
    {
        id: "marketing",
        title: "Marketing & SEO",
        label: "Growth Velocity",
        icon: <LineChart className="w-8 h-8" />,
        description: "Precision-guided SEO campaigns and performance-marketing funnels to dominate local and global searches. We position your brand directly in front of active buyers, eliminating wasted ad spend.",
        features: [
            "Hyper-Targeted Local SEO Dominance",
            "Structured Rich Schema Generator",
            "ROI-Tracked Meta & Google Ad Funnels",
            "High-Converting Landing Copywriting",
            "Real-time analytics and metric dashboards"
        ],
        pricing: "Managed setup starting ₹9,999",
        funnyCopy: "🧠 Fact: 93% of search traffic goes to page 1. The remaining 7% is where people hide bodies. We keep you on page 1.",
        visual: {
            title: "Traffic Growth Curve",
            elements: [45, 85, 75, 95]
        }
    },
    {
        id: "automations",
        title: "AI Automations",
        label: "Intelligent Workforces",
        icon: <Bot className="w-8 h-8" />,
        description: "Auto-pilot your operational tasks, scheduling, and client chats. We deploy conversational AI agents that interact smoothly in Hinglish, English, or Marathi, securing leads 24/7.",
        features: [
            "Hinglish / Marathi WhatsApp Booking Bots",
            "Nap-Proof 24/7 client booking agents",
            "Automated CRM sync (Zapier / Hubspot)",
            "Instant lead qualification algorithms",
            "Automated outreach drafts and follow-ups"
        ],
        pricing: "Scale Packs from ₹2,499/mo",
        funnyCopy: "☕ Pune Special: Our bots don't take afternoon naps. They reply to leads even between 1:00 PM and 4:00 PM.",
        visual: {
            title: "AI Node Logic Flow",
            elements: [70, 50, 90, 80]
        }
    }
];

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState(serviceDetails[0]);

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#07060A]">
            <Navbar />

            {/* Glowing Backdrop Mesh */}
            <div className="absolute inset-0 pointer-events-none z-1">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[450px] h-[450px] bg-mint-500/5 rounded-full blur-[120px]" />
            </div>

            <section className={styles.section}>
                <div className="container relative z-10">
                    
                    {/* Header */}
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-4"
                        >
                            <span className="tag tag-mint">
                                <Sparkles size={11} className="text-mint" />
                                <span>2026 Premium Growth Suite</span>
                            </span>
                        </motion.div>
                        
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="text-white font-extrabold mt-4 mb-6 tracking-tighter"
                            style={{ fontSize: 'var(--fs-5xl)' }}
                        >
                            Elite <span className="text-gradient">Growth Engine OS</span>
                        </motion.h1>
                        <p className="text-zinc-400 font-medium" style={{ fontSize: 'var(--fs-lg)' }}>
                            Choose the component that fits your scale. Fully managed, optimized for modern viewports, and engineered for high ROI.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className={styles.tabsContainer}>
                        {serviceDetails.map((service) => (
                            <button
                                key={service.id}
                                className={`${styles.tab} ${activeTab.id === service.id ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab(service)}
                            >
                                {activeTab.id === service.id && (
                                    <motion.div
                                        layoutId="tabIndicator"
                                        className={styles.tabIndicator}
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <span className={activeTab.id === service.id ? "text-mint" : "text-zinc-400"}>
                                        {service.icon}
                                    </span>
                                    <span className="font-bold tracking-tight">{service.title}</span>
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Block */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className={styles.contentGrid}
                        >
                            {/* Text Info */}
                            <div className={styles.textContent}>
                                <span className="text-violet font-black text-xs uppercase tracking-wider mb-4 block">
                                    {activeTab.label}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight">
                                    {activeTab.title}
                                </h2>
                                <p className="text-zinc-400 font-medium mb-6 leading-relaxed" style={{ fontSize: 'var(--fs-base)' }}>
                                    {activeTab.description}
                                </p>

                                {/* Humorous tagline box */}
                                <div className="p-3.5 mb-8 rounded-xl bg-violet/5 border border-violet-500/10 text-[13px] font-semibold text-violet-300 italic flex items-center gap-2.5">
                                    <span className="text-base">💡</span>
                                    <span>{activeTab.funnyCopy}</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                    {activeTab.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-zinc-300">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-mint/10 flex items-center justify-center">
                                                <CheckCircle2 size={12} className="text-mint" />
                                            </div>
                                            <span className="text-sm font-semibold">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Dynamic Price banner */}
                                <div className="p-6 rounded-2xl bg-white/3 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Standard Setup</p>
                                        <p className="text-2xl font-black text-white">{activeTab.pricing}</p>
                                    </div>
                                    <Button variant="primary" onClick={() => window.location.href = '/contact'} className="gap-2 h-12 px-6 font-bold uppercase text-[11px] tracking-wider w-full sm:w-auto flex items-center justify-center">
                                        Activate OS <ChevronRight size={14} />
                                    </Button>
                                </div>
                            </div>

                            {/* Visual Mockup Card */}
                            <div className={styles.mockupContainer}>
                                <motion.div
                                    className={styles.mockup}
                                    initial={{ rotateY: -15, rotateX: 8 }}
                                    animate={{ rotateY: -6, rotateX: 3 }}
                                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                >
                                    <div className={styles.mockupInner}>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">{activeTab.visual.title}</span>
                                            <div className="w-2 h-2 rounded-full bg-mint shadow-[0_0_6px_#10B981]" />
                                        </div>
                                        <div className={styles.mockupBar} />
                                        {activeTab.visual.elements.map((w, i) => (
                                            <motion.div
                                                key={i}
                                                className={styles.mockupElement}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${w}%` }}
                                                transition={{ delay: 0.3 + (i * 0.08), duration: 0.8 }}
                                            />
                                        ))}
                                        <div className={styles.mockupCircle} />
                                    </div>

                                    {/* Abstract glowing components */}
                                    <motion.div
                                        className="absolute top-10 right-10 p-3 rounded-xl bg-violet/10 border border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 3.5, repeat: Infinity }}
                                    >
                                        <Zap className="text-violet" size={18} />
                                    </motion.div>
                                    <motion.div
                                        className="absolute bottom-10 left-10 p-3 rounded-xl bg-mint/10 border border-mint-500/20 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                                        animate={{ y: [0, 8, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                    >
                                        <Smartphone className="text-mint" size={18} />
                                    </motion.div>
                                </motion.div>
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            <Footer />
        </main>
    );
}
