'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Bot, LineChart, Palette, Rocket } from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        icon: <LineChart className="w-8 h-8 text-primary" />,
        title: 'Full-Funnel Demand Generation',
        description: 'Next-gen SEO systems + multi-channel lead capture. We move beyond "traffic" to build scalable pipeline engines.',
        pricing: 'Starting from ₹45,000',
        timeline: '3-4 Weeks'
    },
    {
        icon: <Palette className="w-8 h-8 text-secondary" />,
        title: 'High-Velocity GTM Systems',
        description: 'Rapid-deployment landing pages + high-intent conversion architecture. Perfect for scaling SaaS and premium services.',
        pricing: 'Starting from ₹35,000',
        timeline: '2-3 Weeks'
    },
    {
        icon: <Bot className="w-8 h-8 text-accent" />,
        title: 'Revenue Operations Automation',
        description: 'WhatsApp CRM integration + intelligent lead routing. We remove friction from your sales process through AI.',
        pricing: 'Starting from ₹25,000',
        timeline: '1-2 Weeks'
    },
    {
        icon: <Rocket className="w-8 h-8 text-primary" />,
        title: 'Authority & Category Leadership',
        description: 'Strategic content engines + ecosystem positioning. We turn your expertise into a measurable competitive advantage.',
        pricing: 'Starting from ₹20,000/mo',
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
