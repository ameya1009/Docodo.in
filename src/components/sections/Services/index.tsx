'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Bot, LineChart, Palette, Rocket } from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        icon: <LineChart className="w-8 h-8 text-primary" />,
        title: 'Get More Qualified Leads',
        description: 'SEO-optimized Next.js websites + automated lead capture forms. Built to turn search intent into real business.',
        pricing: 'Starting from ₹45,000',
        timeline: '3-4 Weeks'
    },
    {
        icon: <Palette className="w-8 h-8 text-secondary" />,
        title: 'Convert Visitors to Customers',
        description: 'High-converting landing pages + automated email sequences. Perfect for SaaS and digital product launches.',
        pricing: 'Starting from ₹35,000',
        timeline: '2-3 Weeks'
    },
    {
        icon: <Bot className="w-8 h-8 text-accent" />,
        title: 'Save 10+ Hours Per Week',
        description: 'WhatsApp Business automation + custom lead routing workflows. Stop doing the repetitive tasks.',
        pricing: 'Starting from ₹25,000',
        timeline: '1-2 Weeks'
    },
    {
        icon: <Rocket className="w-8 h-8 text-primary" />,
        title: 'Build Authority in Your Niche',
        description: 'LinkedIn & Blog content strategy + execution. Thought leadership that builds trust while you sleep.',
        pricing: 'Starting from ₹20,000/mo',
        timeline: 'Ongoing'
    }
];

export function Services() {
    return (
        <section className="section bg-zinc-950/50">
            <div className="container">
                <div className={styles.header}>
                    <h2 className="text-gradient">Why Docodo?</h2>
                    <p className={styles.subtitle}>
                        We combine human creativity with AI efficiency to deliver
                        unmatched growth at scale.
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
