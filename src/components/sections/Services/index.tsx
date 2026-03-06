'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Bot, LineChart, Palette, Rocket } from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        icon: <Palette className="w-8 h-8" />,
        title: 'Websites & Apps',
        description: 'AI-built mobile-first sites/apps with WhatsApp & Razorpay. Launch your digital storefront in days.',
        pricing: 'From ₹4,999',
        roi: '₹50k+/mo Potential',
        size: 'large',
        color: 'cyan'
    },
    {
        icon: <LineChart className="w-8 h-8" />,
        title: 'Marketing & SEO',
        description: 'Pune localized SEO and ads. We turn search intent into walk-in customers for salons & clinics.',
        pricing: 'Setup: ₹9,999',
        roi: '+₹30k Revenue Lift',
        size: 'medium',
        color: 'coral'
    },
    {
        icon: <Bot className="w-8 h-8" />,
        title: 'AI Automations',
        description: 'WhatsApp bots for leads & 24/7 auto-nurture. Save 15+ hours/week on manual follow-ups.',
        pricing: '₹2,999/mo',
        roi: '100% Lead Capture',
        size: 'medium',
        color: 'blue'
    }
];

export function Services() {
    return (
        <section className="section bg-zinc-950/50">
            <div className="container">
                <div className={styles.header}>
                    <h2 className="text-white text-5xl font-extrabold mb-4 tracking-tight">AI Growth OS Services</h2>
                    <p className={styles.subtitle}>
                        Everything your Pune business needs to scale, starting at ₹4,999.
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
