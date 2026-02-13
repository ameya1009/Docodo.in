'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Bot, LineChart, Palette, Rocket } from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        icon: <LineChart className="w-8 h-8 text-primary" />,
        title: 'Full-Funnel Demand Generation',
        description: 'SEO systems + conversion-focused lead capture. We build the demand engine that adds measurable pipeline, not just vanity traffic.',
        pricing: 'Investment: ₹45,000 - ₹65,000',
        timeline: '3-4 Weeks Setup'
    },
    {
        icon: <Palette className="w-8 h-8 text-secondary" />,
        title: 'Founder-led GTM Systems',
        description: 'High-velocity landing pages and conversion architecture. Perfect for technical founders who need product excellence reflected in their GTM.',
        pricing: 'Investment: ₹35,000 - ₹55,000',
        timeline: '2-3 Weeks'
    },
    {
        icon: <Bot className="w-8 h-8 text-accent" />,
        title: 'Revenue Ops Automation',
        description: 'Intelligent lead routing and CRM integration. We remove operational friction so you can focus on closing, not chasing.',
        pricing: 'Investment: ₹25,000+',
        timeline: '1-2 Weeks'
    },
    {
        icon: <Rocket className="w-8 h-8 text-primary" />,
        title: 'Authority Architecture',
        description: 'Strategic content engines that turn your expertise into category leadership. We build your proprietary demand system.',
        pricing: 'Retainer: ₹20,000/mo',
        timeline: 'Ongoing'
    }
];

export function Services() {
    return (
        <section className="section bg-zinc-950/50">
            <div className="container">
                <div className={styles.header}>
                    <h2 className="text-gradient">Core Growth Systems</h2>
                    <p className={styles.subtitle}>
                        We engineer the infrastructure your business needs to scale,
                        combining strategic depth with technical precision.
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
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className={`${styles.card} glass glass-hover`}>
                                <div className={styles.iconWrapper}>
                                    {service.icon}
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-white">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-zinc-400 leading-relaxed text-sm">
                                        {service.description}
                                    </p>
                                    <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-zinc-500">Pricing</span>
                                            <span className="text-primary font-medium">{service.pricing}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-zinc-500">Timeline</span>
                                            <span className="text-zinc-300">{service.timeline}</span>
                                        </div>
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
