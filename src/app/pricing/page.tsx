'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Check, Zap, ChevronDown, ShieldCheck, X } from 'lucide-react';

const services = [
    {
        name: "Free Audit",
        priceMonthly: "₹0",
        priceAnnual: "₹0",
        description: "Get a comprehensive 50-point AI growth analysis.",
        features: ["50-Point Growth Audit", "Basic SEO Report", "Competitor Analysis", "Actionable Roadmap"],
        cta: "Start Free",
        popular: false
    },
    {
        name: "Starter",
        priceMonthly: "₹5,999",
        priceAnnual: "₹4,999",
        description: "Perfect for single-location clinics & cafes.",
        features: ["AI One-page Site", "Basic WhatsApp Bot", "Local SEO Setup", "Hosting & SSL Included"],
        cta: "Get Started",
        popular: false
    },
    {
        name: "Growth",
        priceMonthly: "₹15,999",
        priceAnnual: "₹12,999",
        description: "Full automation for ambitious local businesses.",
        features: ["Multi-page Web App", "Advanced WhatsApp CRM", "Lead Nurturing Agents", "Priority Support"],
        cta: "Scale Now",
        popular: true
    },
    {
        name: "Pro",
        priceMonthly: "₹3,999/mo",
        priceAnnual: "₹2,999/mo",
        description: "Continuous AI maintenance & ROI tracking.",
        features: ["Monthly Strategy Calls", "24/7 Uptime Monitoring", "Continuous A/B Testing", "Custom AI Workflows"],
        cta: "Subscribe",
        popular: false
    }
];

const compareFeatures = [
    { name: "Website Pages", tiers: ["1 Page", "1 Page", "Up to 10", "Unlimited"] },
    { name: "WhatsApp Automations", tiers: ["None", "Basic FAQ", "Advanced CRM", "Custom Flows"] },
    { name: "AI Lead Nurturing", tiers: ["No", "No", "Yes", "Yes"] },
    { name: "SEO Optimization", tiers: ["Audit Only", "Local Basics", "Advanced Local", "Continuous"] },
    { name: "Dedicated Support", tiers: ["Community", "Email", "Priority 24/7", "Dedicated Rep"] },
];

const faqs = [
    { q: "What is the 30-Day ROI Guarantee?", a: "If you don't see measurable growth in your lead volume or operational efficiency within the first 30 days of deploying our Growth or Pro tier, we offer a full refund on your setup fees." },
    { q: "Do I need technical knowledge?", a: "Zero. We handle everything from domains to AI server deployments. You just focus on closing the leads we bring you." },
    { q: "How do the WhatsApp bots work?", a: "We integrate directly with the WhatsApp Cloud API to build conversational agents that talk in Hinglish, book appointments, and follow up with dead leads." }
];

export default function PricingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#0F0F0F]">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-particle-background-animation-3043-large.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="relative z-10">
                <Navbar />

                <section className="pt-32 pb-20 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <motion.h1
                                className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tighter text-white"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Growth Engine.</span>
                            </motion.h1>
                            <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mb-10">
                                Simple, transparent pricing engineered for global scale. Choose the operating system that fits your ambition.
                            </p>

                            <div className="flex items-center justify-center gap-4 mb-16">
                                <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
                                <button 
                                    className="relative w-16 h-8 bg-zinc-800 rounded-full p-1 transition-colors hover:bg-zinc-700"
                                    onClick={() => setIsAnnual(!isAnnual)}
                                >
                                    <motion.div 
                                        className="w-6 h-6 bg-emerald-400 rounded-full shadow-lg"
                                        animate={{ x: isAnnual ? 32 : 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </button>
                                <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-zinc-500'} flex items-center gap-2`}>
                                    Annually
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">-20%</span>
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
                            {services.map((plan, i) => (
                                <motion.div
                                    key={plan.name}
                                    className={`relative bg-white/5 backdrop-blur-xl border ${plan.popular ? 'border-emerald-500' : 'border-white/10'} rounded-3xl p-8 flex flex-col`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2">{plan.name}</h3>
                                    <div className="text-3xl md:text-4xl font-black text-white mb-4">
                                        {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                                    </div>
                                    <p className="text-zinc-500 text-sm mb-8 min-h-[40px]">{plan.description}</p>

                                    <ul className="space-y-4 mb-10 flex-grow">
                                        {plan.features.map(f => (
                                            <li key={f} className="flex items-start gap-3 text-zinc-300 text-sm">
                                                <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" /> {f}
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

                        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-zinc-400 font-medium">
                            <ShieldCheck className="text-emerald-400" size={20} />
                            Backed by our 30-Day ROI Guarantee. <a href="#" className="text-emerald-400 hover:underline">Learn more.</a>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-black/50 border-y border-white/5">
                    <div className="container max-w-5xl mx-auto px-4 overflow-x-auto">
                        <h2 className="text-3xl font-bold text-white mb-12 text-center">Compare Features</h2>
                        <table className="w-full min-w-[800px] text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 border-b border-white/10 text-zinc-400 font-medium w-1/3">Features</th>
                                    <th className="p-4 border-b border-white/10 text-white font-bold text-center">Free</th>
                                    <th className="p-4 border-b border-white/10 text-white font-bold text-center">Starter</th>
                                    <th className="p-4 border-b border-emerald-500 text-emerald-400 font-bold text-center relative">Growth <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 -z-10 rounded-t-xl" /></th>
                                    <th className="p-4 border-b border-white/10 text-white font-bold text-center">Pro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compareFeatures.map((row, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 border-b border-white/5 text-zinc-300">{row.name}</td>
                                        <td className="p-4 border-b border-white/5 text-center text-zinc-400">{row.tiers[0]}</td>
                                        <td className="p-4 border-b border-white/5 text-center text-zinc-400">{row.tiers[1]}</td>
                                        <td className="p-4 border-b border-white/5 text-center text-white font-medium bg-emerald-500/5">{row.tiers[2]}</td>
                                        <td className="p-4 border-b border-white/5 text-center text-zinc-400">{row.tiers[3]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="py-24 px-4">
                    <div className="container max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                    <button
                                        className="w-full p-6 text-left flex justify-between items-center text-white font-medium"
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    >
                                        {faq.q} 
                                        <ChevronDown className={`transition-transform duration-300 text-zinc-400 ${openFaq === i ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <p className="px-6 pb-6 text-zinc-400 leading-relaxed">{faq.a}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
