import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Download, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './GTMToolkit.module.css';

const resources = [
    {
        title: "SaaS GTM Playbook 2026",
        description: "The complete framework for scaling B2B SaaS from $1M to $10M ARR using AI-driven systems.",
        tag: "Playbook",
        icon: <BookOpen className="w-6 h-6" />
    },
    {
        title: "The ABM Toolkit",
        description: "How to identify, engage, and close high-value accounts with precision targeting.",
        tag: "Toolkit",
        icon: <ShieldCheck className="w-6 h-6" />
    },
    {
        title: "Growth Audit Checklist",
        description: "50+ parameters to benchmark your current marketing performance and identify leaks.",
        tag: "Checklist",
        icon: <Download className="w-6 h-6" />
    }
];

export function GTMToolkit() {
    return (
        <section className={styles.toolkit}>
            <div className="container">
                <div className={styles.header}>
                    <motion.span
                        className={styles.label}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Strategic Resources
                    </motion.span>
                    <motion.h2
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        The Go-To-Market <span className="text-gradient">Power Kit</span>
                    </motion.h2>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        We don't just build websites. We engineer growth systems. Access our proprietary frameworks.
                    </motion.p>
                </div>

                <div className={styles.grid}>
                    {resources.map((resource, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                        >
                            <div className={styles.cardIcon}>
                                {resource.icon}
                            </div>
                            <span className={styles.cardTag}>{resource.tag}</span>
                            <h3 className={styles.cardTitle}>{resource.title}</h3>
                            <p className={styles.cardDescription}>{resource.description}</p>
                            <Button variant="ghost" size="sm" className={styles.cardLink}>
                                Get Access <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className={styles.cta}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    <div className={styles.ctaBox}>
                        <h3>Want a custom GTM strategy?</h3>
                        <p>Let's map out your path to market leadership.</p>
                        <Button variant="primary" size="lg" onClick={() => window.location.href = '/contact'}>
                            Book Strategy Call
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
