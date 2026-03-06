'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

const tiers = [
    {
        name: "SMB Starter",
        price: "₹4,999",
        description: "Perfect for Pune salons & cafes starting their GTM journey.",
        features: ["AI-Built Landing Page", "WhatsApp Integration", "Basic SEO Setup", "Growth Audit Report", "50 Free Credits"],
        highlight: false
    },
    {
        name: "Growth Pro",
        price: "₹14,999",
        description: "The integrated OS for medical clinics & dental centers.",
        features: ["Custom Web App", "Advanced Local SEO", "Full Ad Setup", "AI Booking Bot", "500 Free Credits", "Priority Support"],
        highlight: true
    },
    {
        name: "Enterprise OS",
        price: "₹29,999+",
        description: "Scale your high-volume business with custom engineering.",
        features: ["Bespoke Web Systems", "Custom Agentic AI Bots", "Full-Funnel Management", "Premium Content Engine", "Unlimited Tool Credits", "Dedicated Engineer"],
        highlight: false
    }
];

export default function PricingPage() {
    return (
        <main className="bg-black min-h-screen">
            <Navbar />

            <div className="container py-32">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-6xl font-extrabold mb-6 tracking-tighter"
                    >
                        Android Scale. <span className="text-gradient">Apple Delight.</span>
                    </motion.h1>
                    <p className="text-zinc-400 text-xl leading-relaxed">
                        Premium engineering growth systems at prices that make sense for the 80M+ Indian SMBs. No hidden fees. Just ROI.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {tiers.map((tier, idx) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-10 rounded-3xl border ${tier.highlight
                                    ? 'bg-zinc-900/50 border-cyan-500/50 shadow-[0_0_50px_rgba(0,255,255,0.1)]'
                                    : 'bg-zinc-900/20 border-white/10'
                                } flex flex-col h-full`}
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">{tier.name}</h2>
                            <p className="text-zinc-500 text-sm mb-8">{tier.description}</p>

                            <div className="mb-8">
                                <span className="text-4xl font-bold text-white">{tier.price}</span>
                                {tier.price !== 'Custom' && <span className="text-zinc-500 text-sm font-medium ml-2">/ one-time</span>}
                            </div>

                            <div className="space-y-4 mb-10 flex-grow">
                                {tier.features.map(feature => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="mt-1 p-0.5 bg-cyan-500/20 rounded-full text-cyan-400">
                                            <Check size={14} />
                                        </div>
                                        <span className="text-zinc-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={tier.highlight ? 'primary' : 'outline'}
                                size="lg"
                                className="w-full font-bold py-6 text-lg"
                            >
                                Get Started <ArrowRight className="ml-2" />
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section Placeholder */}
                <section className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-10 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Why is it more affordable for Pune SMBs?", a: "We use an 'Android Volume' model—leveraging AI for high-velocity engineering to keep costs low while delivering Apple-grade UX." },
                            { q: "What are AI Tool Credits?", a: "Credits allow you to run powerful growth agents like Surfer SEO or Zapier Agents directly from your Docodo dashboard." },
                            { q: "Do you offer Marathi support?", a: "Yes, our bots and consulting can be localized in Marathi/Hinglish to better serve your local customers." }
                        ].map((item, i) => (
                            <div key={i} className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-white font-bold mb-2">{item.q}</h3>
                                <p className="text-zinc-500 text-sm">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
