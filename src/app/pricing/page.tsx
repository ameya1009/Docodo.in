'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const tiers = [
    {
        name: 'Sprint',
        price: 'Custom',
        description: 'For high-growth startups needing immediate GTM execution.',
        features: ['AI Content Engine', 'Lead Scraper Setup', 'Performance Creative', 'Weekly Strategy Sync'],
        cta: 'Book a Sprint'
    },
    {
        name: 'Scale',
        price: 'Custom',
        description: 'Full-funnel automation for established ventures.',
        features: ['Full GTM Stack', 'Custom AI Agents', 'Predictive Analytics', '24/7 Priority Support'],
        cta: 'Get Started',
        highlighted: true
    }
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />

                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Invest in <span className="text-gradient">Intelligent Growth.</span>
                        </h1>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-12">
                            Transparent, results-driven pricing designed for founders who value speed and precision.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
                        {tiers.map((tier, i) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-8 rounded-3xl border ${tier.highlighted
                                        ? 'border-primary bg-primary/5 shadow-[0_0_50px_-12px_rgba(var(--primary-rgb),0.3)]'
                                        : 'border-zinc-800 bg-zinc-900/50'
                                    } text-left flex flex-col`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-bold">{tier.name}</h3>
                                    {tier.highlighted && (
                                        <span className="bg-primary text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                                            Most Popular
                                        </span>
                                    )}
                                </div>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                </div>
                                <p className="text-zinc-400 text-sm mb-8">{tier.description}</p>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {tier.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="w-full py-6 text-base"
                                    variant={tier.highlighted ? 'default' : 'outline'}
                                    asChild
                                >
                                    <Link href="/contact">{tier.cta}</Link>
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="p-12 rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/20"
                    >
                        <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
                        <h4 className="text-xl font-bold mb-2">Need something custom?</h4>
                        <p className="text-zinc-500 mb-6">We build dedicated growth stacks for enterprise needs.</p>
                        <Button variant="link" className="text-primary hover:text-primary-light" asChild>
                            <Link href="/contact">Talk to Strategy &rarr;</Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
