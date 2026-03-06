'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Bot, LineChart, Palette, Rocket } from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        icon: <Palette className="w-8 h-8 text-cyan-400" />,
        title: 'Websites & Apps',
        description: 'AI-built, mobile-first sites/apps with WhatsApp & booking integration. Engineered for salons, clinics, and cafes.',
        pricing: 'From ₹4,999',
        roi: '+₹20k/mo potential',
        size: 'large'
    },
    {
        icon: <LineChart className="w-8 h-8 text-pink-400" />,
        title: 'Marketing & SEO',
        description: 'ROI-focused Pune localized SEO and ads. We turn search intent into walk-in customers.',
        pricing: 'Setup: ₹9,999',
        roi: '18% conversion lift',
        size: 'small'
    },
    {
        icon: <Bot className="w-8 h-8 text-amber-400" />,
        title: 'AI Automations',
        description: 'WhatsApp bots for leads & auto-nurture. Run your business while you sleep.',
        pricing: '₹2,999/mo',
        roi: '10 hrs/week saved',
        size: 'small'
    },
    {
        icon: <Rocket className="w-8 h-8 text-emerald-400" />,
        title: 'Consulting OS',
        description: 'Founder-led growth playbooks and technical audit to scale your SMB infrastructure.',
        pricing: 'Custom',
        roi: '3x growth velocity',
        size: 'medium'
    }
];

export function Services() {
    return (
        <section className="section bg-zinc-950/50">
            <div className="container">
                <div className={styles.header}>
                    <h2 className="text-white text-5xl font-extrabold mb-4 tracking-tight">Integrated Growth OS</h2>
                    <p className={styles.subtitle}>
                        Everything your Pune business needs to scale, integrated into one seamless platform.
                    </p>
                </div>

                <motion.div
                    className={styles.grid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
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
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className={`${styles.cardWrapper} ${styles[service.size]}`}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <Card className={`${styles.card} glass glass-hover h-full`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={styles.iconWrapper}>
                                        {service.icon}
                                    </div>
                                    <div className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{service.roi}</span>
                                    </div>
                                </div>
                                <CardHeader className="p-0 mb-4">
                                    <CardTitle className="text-white text-2xl font-bold">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 space-y-6">
                                    <p className="text-zinc-400 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-zinc-500 text-sm font-medium">Pricing</span>
                                        <span className="text-white font-bold">{service.pricing}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
