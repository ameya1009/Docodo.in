'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Layout, LineChart, Bot, CheckCircle2 } from 'lucide-react';

const serviceDetails = [
    {
        title: "Websites & Apps",
        id: "sites",
        icon: <Layout className="w-12 h-12 text-cyan-400" />,
        description: "Engineering mobile-first, conversion-optimized site architecture that turns visitors into revenue.",
        features: [
            "AI-Built Custom UI/UX",
            "WhatsApp & Booking API Integration",
            "Next.js High-Performance Stack",
            "Pune Localized Content Strategy"
        ],
        pricing: "Starting at ₹4,999"
    },
    {
        title: "Digital Marketing & GTM",
        id: "marketing",
        icon: <LineChart className="w-12 h-12 text-pink-400" />,
        description: "Precision-engineered SEO and ad systems designed specifically for the Indian SMB ecosystem.",
        features: [
            "Local SEO Dominance (Pune Focus)",
            "ROI-Tracked Meta & Google Ads",
            "High-Conversion Landing Pages",
            "Content Engine for Authority"
        ],
        pricing: "Setup from ₹9,999"
    },
    {
        title: "AI Automations & Bots",
        id: "bots",
        icon: <Bot className="w-12 h-12 text-amber-400" />,
        description: "Removing operational friction with intelligent agents that run your business 24/7.",
        features: [
            "Custom WhatsApp Business Bots",
            "Lead Nurturing Automations",
            "CRM & Pipeline Integration",
            " मराठी/Hinglish Language Support"
        ],
        pricing: "₹2,999/mo Retainer"
    }
];

export default function ServicesPage() {
    return (
        <main className="bg-black min-h-screen">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container">
                    <div className="max-w-3xl mb-20">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-cyan-500 font-bold uppercase tracking-widest text-sm"
                        >
                            The Integrated OS
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white text-6xl font-extrabold mt-4 mb-6 tracking-tighter"
                        >
                            High-Velocity <span className="text-gradient">Growth Systems.</span>
                        </motion.h1>
                        <p className="text-zinc-400 text-xl leading-relaxed">
                            We don&apos;t just build tools; we build the infrastructure your business needs to dominate the Pune market.
                        </p>
                    </div>

                    <div className="space-y-32">
                        {serviceDetails.map((service, idx) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col lg:flex-row items-center gap-16 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                <div className="lg:w-1/2">
                                    <div className="mb-6">{service.icon}</div>
                                    <h2 className="text-4xl font-bold text-white mb-6">{service.title}</h2>
                                    <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-4 mb-10">
                                        {service.features.map(feature => (
                                            <li key={feature} className="flex items-center gap-3 text-zinc-300">
                                                <CheckCircle2 size={18} className="text-cyan-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex items-center gap-6">
                                        <Button variant="primary" size="lg">Get Started</Button>
                                        <span className="text-zinc-500 font-medium">{service.pricing}</span>
                                    </div>
                                </div>
                                <div className="lg:w-1/2 w-full aspect-video bg-zinc-900/50 rounded-3xl border border-white/5 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-zinc-800 font-black text-8xl tracking-tighter opacity-10 uppercase">{service.id}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
