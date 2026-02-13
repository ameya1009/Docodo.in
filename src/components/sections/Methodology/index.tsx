'use client';

import { motion } from 'framer-motion';
import styles from './Methodology.module.css';
import { Layers, Cpu, Zap, BarChart3 } from 'lucide-react';

const steps = [
    {
        icon: <Layers className="w-6 h-6" />,
        title: "Layer 01: Systems Audit",
        description: "We deconstruct your current tech stack and funnel to identify technical debt and conversion leaks.",
        details: ["Funnel Mapping", "Tech Stack Audit", "CAC Analysis"]
    },
    {
        icon: <Cpu className="w-6 h-6" />,
        title: "Layer 02: Infrastructure Engineering",
        description: "Building the high-velocity foundation. Landing pages, CMS, and data tracking layers.",
        details: ["Next.js Buildout", "Headless CMS Setup", "Analytics Rig"]
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Layer 03: Growth Automation",
        description: "Removing human friction. Lead routing, CRM sync, and automated nurturing sequences.",
        details: ["WhatsApp CRM", "Lead Intelligence", "Email Sequences"]
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Layer 04: Velocity Optimization",
        description: "Continuous iteration based on real-world data to drive exponential ROI.",
        details: ["A/B Testing", "Heatmap Analysis", "Scaling Playbook"]
    }
];

export function Methodology() {
    return (
        <section id="methodology" className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <motion.span
                        className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Our Protocol
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        The Founder-First <br />
                        <span className="text-gradient">Growth Stack™</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        A deterministic engineering protocol for scaling B2B SaaS from $1M to $10M ARR
                        without adding agency overhead.
                    </p>
                </div>

                <div className={styles.grid}>
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.card}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className={styles.iconBox}>
                                {step.icon}
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{step.title}</h3>
                                <p className={styles.desc}>{step.description}</p>
                                <ul className={styles.details}>
                                    {step.details.map((detail, i) => (
                                        <li key={i} className={styles.detailItem}>
                                            <div className={styles.bullet} />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
