'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Layout, LineChart, Bot, CheckCircle2, ChevronRight, Zap, Smartphone, Globe } from 'lucide-react';
import styles from './Services.module.css';

const serviceDetails = [
    {
        id: "sites",
        title: "Websites & Apps",
        label: "Digital Storefronts",
        icon: <Layout className="w-8 h-8" />,
        description: "Engineering mobile-first, conversion-optimized site architecture that turns visitors into revenue. Built for Pune's fastest growing SMBs.",
        features: [
            "AI-Built Custom UI/UX (Apple-standard)",
            "WhatsApp & Booking API Integration",
            "Next.js High-Performance Stack (<1s Load)",
            "Razorpay & UPI Checkout Ready",
            "Pune Localized Content Engine"
        ],
        pricing: "Starter ₹4,999 | Pro ₹14,999",
        visual: {
            title: "Mobile App OS",
            elements: [80, 60, 40, 90]
        }
    },
    {
        id: "marketing",
        title: "Marketing & SEO",
        label: "Performance Growth",
        icon: <LineChart className="w-8 h-8" />,
        description: "Precision-engineered SEO and ad systems designed specifically for the Indian SMB ecosystem. We dominate local search in Pune.",
        features: [
            "Local SEO Dominance (Baner, Viman Nagar focus)",
            "ROI-Tracked Meta & Google Ads",
            "High-Conversion Landing Pages",
            "Content Engine for Authority",
            "Monthly Performance Audits"
        ],
        pricing: "₹9,999 Setup + Monthly Retainer",
        visual: {
            title: "Traffic Analytics",
            elements: [40, 90, 70, 50]
        }
    },
    {
        id: "automations",
        title: "AI Automations",
        label: "Operational OS",
        icon: <Bot className="w-8 h-8" />,
        description: "Removing operational friction with intelligent agents that run your business 24/7. Handle 1000s of leads with zero manual effort.",
        features: [
            "Custom WhatsApp Business Bots",
            " मराठी/Hinglish Language Support",
            "Lead Nurturing Automations",
            "Zapier & CRM Sink Architecture",
            "24/7 Auto-Pilot Lead Capture"
        ],
        pricing: "Packages from ₹2,499/mo",
        visual: {
            title: "Logic Flow AI",
            elements: [60, 40, 80, 100]
        }
    }
];

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState(serviceDetails[0]);

    return (
        <main className="bg-black min-h-screen">
            <Navbar />

            <section className={styles.section}>
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-cyan-500 font-bold uppercase tracking-widest text-sm"
                        >
                            2026 Growth Suite
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white text-5xl md:text-7xl font-extrabold mt-4 mb-6 tracking-tighter"
                        >
                            Docodo <span className="text-gradient">Growth OS.</span>
                        </motion.h1>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
                            Pick a component for your business engine. Fully managed, zero maintenance, high ROI.
                        </p>
                    </div>

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
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {service.icon}
                                    <span className="hidden md:inline">{service.title}</span>
                                </span>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className={styles.contentGrid}
                        >
                            <div className={styles.textContent}>
                                <motion.span
                                    className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-4 block"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {activeTab.label}
                                </motion.span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                    {activeTab.title}
                                </h2>
                                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                                    {activeTab.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                    {activeTab.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-zinc-300">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center">
                                                <CheckCircle2 size={12} className="text-cyan-500" />
                                            </div>
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Indicative Pricing</p>
                                        <p className="text-xl font-bold text-white">{activeTab.pricing}</p>
                                    </div>
                                    <Button variant="primary" onClick={() => window.location.href = '/contact'} className="gap-2">
                                        Launch OS <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>

                            <div className={styles.mockupContainer}>
                                <motion.div
                                    className={styles.mockup}
                                    initial={{ rotateY: -20, rotateX: 10 }}
                                    animate={{ rotateY: -10, rotateX: 5 }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                >
                                    <div className={styles.mockupInner}>
                                        <div className={styles.mockupTitle}>{activeTab.visual.title}</div>
                                        <div className={styles.mockupBar} />
                                        {activeTab.visual.elements.map((w, i) => (
                                            <motion.div
                                                key={i}
                                                className={styles.mockupElement}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${w}%` }}
                                                transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            />
                                        ))}
                                        <div className={styles.mockupCircle} />
                                    </div>

                                    {/* Abstract icons floating */}
                                    <motion.div
                                        className="absolute top-10 right-10 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <Zap className="text-cyan-400" />
                                    </motion.div>
                                    <motion.div
                                        className="absolute bottom-10 left-10 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                    >
                                        <Smartphone className="text-purple-400" />
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
