'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Check, Info, Zap, CreditCard, ChevronDown, ArrowRight } from 'lucide-react';
import styles from './Pricing.module.css';

const services = [
    {
        name: "Starter (Site)",
        price: "₹4,999",
        description: "Perfect for Pune startups & small boutiques.",
        features: ["One-page AI Site", "WhatsApp Integration", "Mobile Optimization", "Hosting Included", "Basic SEO"],
        cta: "Get Started",
        popular: false
    },
    {
        name: "Pro (Growth OS)",
        price: "₹14,999",
        description: "Full automation for clinics & cafes.",
        features: ["Multi-page Web App", "Razorpay Payment Setup", "Advanced SEO (Google Maps)", "Custom Lead CRM", "Priority Support"],
        cta: "Scale Now",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Scalable systems for chains & franchises.",
        features: ["Custom Software Architecture", "Multi-location SEO", "Dedicated Account Manager", "Custom WhatsApp Flows", "Security Audit"],
        cta: "Contact Sales",
        popular: false
    }
];

const creditPacks = [
    { name: "Starter Pack", credits: "100", price: "₹999", bonus: "0%" },
    { name: "Pro Pack", credits: "500", price: "₹3,999", bonus: "10%", popular: true },
    { name: "Growth Pack", credits: "2,000", price: "₹9,999", bonus: "+500 Bonus" }
];

const faqs = [
    { q: "Why is Docodo so affordable for Pune SMBs?", a: "We leverage proprietary AI-engineers that automate 80% of the manual coding process, allowing us to pass the savings directly to local business owners while maintaining Apple-level quality." },
    { q: "How do the AI credits work?", a: "Credits are used for running automated agents in the marketplace. For example, generating an AI audit costs 50 credits, while a lead-gen agent run costs 10 credits." },
    { q: "Do you include GST?", a: "All prices listed exclude 18% GST which will be calculated at checkout as per Indian law." },
    { q: "Can I cancel my retainer?", a: "Yes, our retainers are month-to-month. No lock-ins, because we believe in delivering ROI every single month." }
];

export default function PricingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <main className="bg-black min-h-screen">
            <Navbar />

            <section className={styles.pricingHero}>
                <div className="container">
                    <motion.h1
                        className="text-white text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Simple, <span className="text-gradient">ROI-First</span> Pricing.
                    </motion.h1>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto mb-16">
                        No hidden fees. No tech jargon. Just pure growth systems engineered for Pune.
                    </p>

                    <div className={styles.pricingGrid}>
                        {services.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                className={styles.priceCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                {plan.popular && <div className={styles.popularTag}>Most Popular</div>}
                                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2">{plan.name}</h3>
                                <div className="text-4xl font-bold text-white mb-4">{plan.price}</div>
                                <p className="text-zinc-500 text-sm mb-8">{plan.description}</p>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-center gap-3 text-zinc-300 text-sm">
                                            <Check size={16} className="text-cyan-400 shrink-0" /> {f}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={plan.popular ? 'primary' : 'outline'}
                                    className="w-full"
                                    onClick={() => window.location.href = '/contact'}
                                >
                                    {plan.cta}
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    <div className={styles.creditSection}>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                                <Zap className="text-cyan-400" /> Marketplace Credit Packs
                            </h2>
                            <p className="text-zinc-500">Add fuel to your AI agents. 1 Credit = ₹1-₹2 Value.</p>
                        </div>

                        <div className={styles.creditGrid}>
                            {creditPacks.map((pack) => (
                                <div key={pack.name} className={styles.creditPack}>
                                    <div className="text-cyan-400 font-bold mb-2">{pack.credits} Credits</div>
                                    <div className="text-2xl font-bold text-white mb-1">{pack.price}</div>
                                    <div className="text-[10px] text-emerald-400 font-bold uppercase mb-6">{pack.bonus}</div>
                                    <Button variant="outline" size="sm" className="w-full border-white/10 hover:border-cyan-500/50">
                                        Buy Now
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.faqContainer}>
                        <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
                        {faqs.map((faq, i) => (
                            <div key={i} className={styles.faqItem}>
                                <button
                                    className={styles.faqQuestion}
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    {faq.q} <ChevronDown className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            className={styles.faqAnswer}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <p className="pb-4">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
