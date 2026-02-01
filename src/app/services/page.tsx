'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Check, ArrowRight, Zap, Palette, Rocket, Bot } from 'lucide-react';
import styles from './Services.module.css';

const servicePackages = [
    {
        title: 'Modern Growth Website',
        price: 'From ₹25,000',
        description: 'Engineered for conversion and speed. We don\'t just build sites; we build high-performance business assets.',
        icon: <Rocket />,
        color: 'var(--color-primary)',
        features: [
            'Next.js 15 Performance Architecture',
            'Full Responsive Design Systems',
            'Conversion Rate Optimization (CRO)',
            'SEO Data-Layer Integration',
            'Scalable CMS Architecture'
        ]
    },
    {
        title: 'Social Growth Authority',
        price: 'From ₹15,000/mo',
        description: 'Elite content strategy and execution that turns your presence into a measurable trust-building machine.',
        icon: <Palette />,
        color: 'var(--color-secondary)',
        features: [
            'Authority-Driven Content Engine',
            'Premium Reel & Short-form Editing',
            'Strategic Hashtag & Keyword Ops',
            'Profile Optimization & UI Audit',
            'Bi-Weekly Performance Insights'
        ]
    },
    {
        title: 'AI Automation Systems',
        price: 'Custom Quote',
        description: 'Intelligent lead capture and process automation that removes human friction from your sales cycle.',
        icon: <Bot />,
        color: 'var(--color-accent)',
        features: [
            'WhatsApp CRM & Bot Integration',
            'Autonomous Lead Nurture Funnels',
            'Revenue Operations Automation',
            'Intelligent Lead Scoring Systems',
            '24/7 AI Engagement Agents'
        ]
    },
    {
        title: 'Full GTM Orchestration',
        price: 'Tailored Strategy',
        description: 'The "Top 1%" treatment. We act as your fractional growth engineering team, scaling everything.',
        icon: <Zap />,
        color: 'var(--color-primary)',
        features: [
            'Full-Funnel Growth Engineering',
            'Custom AI Model Implementation',
            'Omnichannel Scale Strategy',
            'Founder-Led Marketing Systems',
            'Dedicated Growth Ops Engineer'
        ]
    }
];

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            <section className={styles.hero}>
                <div className="container">
                    <motion.span
                        className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Growth Solutions
                    </motion.span>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Clear, Transparent <span className="text-gradient">Systems.</span>
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        We strip away enterprise complexity and replace it with engineering precision.
                        Choose the infrastructure your growth demands.
                    </motion.p>
                </div>
            </section>

            <div className="container">
                <motion.div
                    className={styles.grid}
                    initial="hidden"
                    animate="visible"
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
                    {servicePackages.map((pkg, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className={styles.card}>
                                <div className={styles.cardGlow} />
                                <div className={styles.iconWrapper}>
                                    {pkg.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
                                <div className={styles.price}>{pkg.price}</div>
                                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                                    {pkg.description}
                                </p>
                                <ul className={styles.features}>
                                    {pkg.features.map((feature, idx) => (
                                        <li key={idx} className={styles.feature}>
                                            <Check className="w-5 h-5 text-primary shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full mt-4 group">
                                    Deploy System <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.section
                    className={styles.ctaSection}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="mb-4">Not sure what you need?</h2>
                    <p className="text-zinc-400 max-w-xl mx-auto mb-8 text-lg">
                        Every business is at a different stage. Let&apos;s architect a
                        custom roadmap specific to your current constraints and goals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="px-10">Talk to the Founder</Button>
                        <Button variant="outline" size="lg" className="px-10">Get a Free Audit</Button>
                    </div>
                </motion.section>
            </div>

            <Footer />
        </main>
    );
}

