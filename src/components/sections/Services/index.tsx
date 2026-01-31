'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Bot, LineChart, Palette, Rocket } from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        icon: <Palette className="w-8 h-8 text-primary" />,
        title: 'Modern Websites',
        description: 'Fast, SEO-ready websites built on Next.js. Designed to convert visitors into customers, not just look pretty.'
    },
    {
        icon: <Rocket className="w-8 h-8 text-secondary" />,
        title: 'Social Growth',
        description: 'Instagram & LinkedIn strategies that actually work. Content creation, reel editing, and consistent posting schedules.'
    },
    {
        icon: <Bot className="w-8 h-8 text-accent" />,
        title: 'Automation',
        description: 'WhatsApp business automation, lead capture forms, and email sequences to save you 10+ hours a week.'
    },
    {
        icon: <LineChart className="w-8 h-8 text-primary" />,
        title: 'Google Business',
        description: 'Complete GMB profile optimization to help local customers find you first. Reviews management included.'
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

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <Card key={index} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                {service.icon}
                            </div>
                            <CardHeader>
                                <CardTitle>{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {service.description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
