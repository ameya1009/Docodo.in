'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Check, ShieldCheck, ChevronDown, Rocket, Coffee, Sparkles, Gem, Calculator } from 'lucide-react';

const services = [
    {
        name: "Bootstrapper",
        icon: Coffee,
        priceMonthly: "₹0",
        priceAnnual: "₹0",
        description: "For the 'I will do it myself' founder living on Maggi.",
        features: ["50-Point AI Roast (Audit)", "Basic SEO Reality Check", "Competitor Stalking", "Do-It-Yourself Roadmap"],
        cta: "Start Free",
        popular: false,
        theme: "zinc"
    },
    {
        name: "Local Hustler",
        icon: Rocket,
        priceMonthly: "₹5,999",
        priceAnnual: "₹4,999",
        description: "Perfect for single-location clinics, cafes & Puneri misal joints.",
        features: ["AI One-page Site", "Basic WhatsApp Bot", "Local SEO (Google Maps Magic)", "Hosting & SSL Included"],
        cta: "Get Started",
        popular: false,
        theme: "violet"
    },
    {
        name: "Unicorn Dreamer",
        icon: Sparkles,
        priceMonthly: "₹15,999",
        priceAnnual: "₹12,999",
        description: "Full automation for businesses ready to pitch on Shark Tank.",
        features: ["Multi-page Web App", "Advanced WhatsApp CRM (Hinglish)", "Lead Nurturing Agents", "Priority 'Tech Bro' Support"],
        cta: "Scale Now",
        popular: true,
        theme: "mint"
    },
    {
        name: "Funding Secured",
        icon: Gem,
        priceMonthly: "₹39,999/mo",
        priceAnnual: "₹29,999/mo",
        description: "Continuous AI maintenance for when you actually have a budget.",
        features: ["Weekly Strategy Calls", "24/7 Uptime (Even in Monsoons)", "Continuous A/B Testing", "Custom AI Workflows"],
        cta: "Go Enterprise",
        popular: false,
        theme: "indigo"
    }
];

const compareFeatures = [
    { name: "Website Pages", tiers: ["1 Page", "1 Page", "Up to 10", "Unlimited"] },
    { name: "WhatsApp Automations", tiers: ["None", "Basic FAQ", "Advanced CRM", "Custom Flows"] },
    { name: "AI Lead Nurturing", tiers: ["No", "No", "Yes", "Yes (Aggressive Mode)"] },
    { name: "SEO Optimization", tiers: ["Audit Only", "Local Basics", "Advanced Local", "Dominance"] },
    { name: "Dedicated Support", tiers: ["Reddit", "Email", "Priority 24/7", "Dedicated CTO"] },
];

const faqs = [
    { q: "What is the 30-Day ROI Guarantee?", a: "If you don't see measurable growth in your lead volume or operational efficiency within the first 30 days of deploying our Unicorn Dreamer tier, we offer a full refund. No drama, just math." },
    { q: "Do I need technical knowledge?", a: "Zero. We handle everything from domains to AI server deployments. You just focus on closing the leads we bring you and pretending you know what 'Docker' means." },
    { q: "How do the WhatsApp bots work?", a: "We integrate directly with the WhatsApp Cloud API to build conversational agents that talk in fluent Hinglish, book appointments, and follow up with dead leads better than your ex." },
    { q: "Can I upgrade later?", a: "Of course! Start as a Hustler, upgrade to a Unicorn when the VC money hits your bank account." }
];

export default function PricingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [isAnnual, setIsAnnual] = useState(true);
    const [leads, setLeads] = useState(100);

    return (
        <main className="min-h-screen relative overflow-hidden bg-[var(--color-bg)]">
            {/* 3D Grid & Noise Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    transformOrigin: 'top center',
                }}
            />
            
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--violet)] rounded-full blur-[150px] opacity-[0.15] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--mint)] rounded-full blur-[120px] opacity-[0.1] mix-blend-screen pointer-events-none" />

            <div className="relative z-10">
                <Navbar />

                <section className="pt-32 pb-20 px-4">
                    <div className="container">
                        <div className="text-center mb-16 max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-bright border-[var(--color-border-bright)] mb-8"
                            >
                                <span className="w-2 h-2 rounded-full bg-[var(--mint)] animate-pulse" />
                                <span className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)]">Transparent Pricing. No BS.</span>
                            </motion.div>

                            <motion.h1
                                className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tighter text-white"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                Invest in your <br className="hidden md:block" />
                                <span className="text-gradient">Growth Engine.</span>
                            </motion.h1>
                            
                            <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto mb-10">
                                Simple, transparent pricing engineered for global scale. Choose the operating system that fits your ambition (and your current runway).
                            </p>

                            <div className="flex items-center justify-center gap-4 mb-16">
                                <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-[var(--text-muted)]'}`}>Monthly</span>
                                <button 
                                    className="relative w-16 h-8 bg-[var(--color-bg-2)] border border-[var(--color-border)] rounded-full p-1 transition-colors hover:border-[var(--violet)]"
                                    onClick={() => setIsAnnual(!isAnnual)}
                                >
                                    <motion.div 
                                        className="w-6 h-6 rounded-full shadow-lg"
                                        style={{ background: isAnnual ? 'var(--mint)' : 'var(--violet)' }}
                                        animate={{ x: isAnnual ? 32 : 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </button>
                                <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-[var(--text-muted)]'} flex items-center gap-2`}>
                                    Annually
                                    <span className="px-2 py-0.5 rounded-full bg-[var(--mint-glow)] text-[var(--mint)] text-xs font-bold border border-[var(--mint)]">-20%</span>
                                </span>
                            </div>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {services.map((plan, i) => {
                                const Icon = plan.icon;
                                return (
                                    <motion.div
                                        key={plan.name}
                                        className={`relative glass-bright rounded-3xl p-8 flex flex-col card-3d-wrap ${plan.popular ? 'gradient-border-neon' : ''}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                                    >
                                        <div className="card-3d h-full flex flex-col relative z-10">
                                            {plan.popular && (
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--mint)] text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_var(--mint-glow)]">
                                                    Most Popular
                                                </div>
                                            )}
                                            
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 
                                                ${plan.theme === 'mint' ? 'bg-[var(--mint-glow)] text-[var(--mint)]' : 
                                                  plan.theme === 'violet' ? 'bg-[var(--violet-glow)] text-[var(--violet)]' :
                                                  plan.theme === 'indigo' ? 'bg-[var(--indigo-glow)] text-[var(--indigo)]' :
                                                  'bg-white/5 text-zinc-400'}`}
                                            >
                                                <Icon size={24} />
                                            </div>

                                            <h3 className="text-[var(--text-secondary)] text-sm font-bold uppercase tracking-widest mb-2">{plan.name}</h3>
                                            <div className="text-3xl md:text-4xl font-black text-white mb-4 flex items-baseline gap-1">
                                                {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                                                {plan.priceAnnual !== "₹0" && !plan.priceAnnual.includes("/mo") && <span className="text-sm text-[var(--text-muted)] font-medium">/mo</span>}
                                            </div>
                                            <p className="text-[var(--text-secondary)] text-sm mb-8 min-h-[60px]">{plan.description}</p>

                                            <ul className="space-y-4 mb-10 flex-grow">
                                                {plan.features.map(f => (
                                                    <li key={f} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                                                        <Check size={16} className={`shrink-0 mt-0.5 ${plan.theme === 'mint' ? 'text-[var(--mint)]' : 'text-[var(--violet)]'}`} /> 
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <Button
                                                variant={plan.popular ? 'primary' : 'outline'}
                                                className="w-full mt-auto"
                                                onClick={() => window.location.href = '/contact'}
                                            >
                                                {plan.cta}
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.div 
                            className="mt-16 flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] font-medium"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <ShieldCheck className="text-[var(--mint)]" size={20} />
                            Backed by our 30-Day ROI Guarantee. <span className="text-[var(--text-muted)]">(Because we actually deliver)</span>
                        </motion.div>
                    </div>
                </section>

                {/* Hustle ROI Calculator (Humorous Element) */}
                <section className="py-24 relative z-10">
                    <div className="container max-w-4xl">
                        <div className="glass p-8 md:p-12 rounded-3xl glow-violet relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <Calculator size={200} />
                            </div>
                            
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-white mb-4">The "Puneri Hustle" Calculator</h2>
                                <p className="text-[var(--text-secondary)] mb-8 max-w-lg">
                                    Slide to see how much time and money you save when our AI stops you from manually replying to "Hi" messages on WhatsApp at 2 AM.
                                </p>

                                <div className="space-y-8 mb-8">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-bold uppercase tracking-wider text-[var(--violet)]">Monthly Leads Missed</span>
                                            <span className="text-sm font-bold text-white">{leads}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="10" 
                                            max="500" 
                                            value={leads}
                                            onChange={(e) => setLeads(parseInt(e.target.value))}
                                            className="w-full h-2 bg-[var(--color-bg)] rounded-lg appearance-none cursor-pointer accent-[var(--violet)]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] p-6 rounded-2xl">
                                        <div className="text-[var(--text-secondary)] text-sm mb-1 uppercase tracking-widest">Time Wasted Answering FAQs</div>
                                        <div className="text-3xl font-black text-white">{Math.round(leads * 5 / 60)} Hours</div>
                                        <div className="text-xs text-[var(--text-muted)] mt-2">That's time you could spend napping.</div>
                                    </div>
                                    <div className="bg-[var(--mint-glow)] border border-[var(--mint)] p-6 rounded-2xl">
                                        <div className="text-[var(--mint)] text-sm mb-1 uppercase tracking-widest font-bold">Lost Revenue Recovered</div>
                                        <div className="text-3xl font-black text-white">₹{(leads * 500).toLocaleString()}</div>
                                        <div className="text-xs text-[var(--mint)] mt-2 opacity-80">Assuming a tiny ₹500 profit per closed lead.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Compare Table */}
                <section className="py-24 bg-[var(--color-bg-2)] border-y border-[var(--color-border)]">
                    <div className="container max-w-5xl mx-auto overflow-x-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Feature Showdown</h2>
                            <p className="text-[var(--text-secondary)]">The nitty-gritty details for the analytical minds.</p>
                        </div>
                        
                        <div className="glass-bright rounded-2xl overflow-hidden">
                            <table className="w-full min-w-[800px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--color-bg)]">
                                        <th className="p-6 border-b border-[var(--color-border)] text-[var(--text-secondary)] font-bold tracking-wider uppercase text-sm w-1/3">Features</th>
                                        <th className="p-6 border-b border-[var(--color-border)] text-white font-bold text-center">Bootstrapper</th>
                                        <th className="p-6 border-b border-[var(--color-border)] text-white font-bold text-center">Local Hustler</th>
                                        <th className="p-6 border-b border-[var(--mint)] text-[var(--mint)] font-bold text-center bg-[var(--mint-glow)]">Unicorn Dreamer</th>
                                        <th className="p-6 border-b border-[var(--color-border)] text-white font-bold text-center">Funding Secured</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compareFeatures.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors border-b border-[var(--color-border-bright)] last:border-0">
                                            <td className="p-6 text-[var(--text-primary)] font-medium">{row.name}</td>
                                            <td className="p-6 text-center text-[var(--text-secondary)]">{row.tiers[0]}</td>
                                            <td className="p-6 text-center text-[var(--text-secondary)]">{row.tiers[1]}</td>
                                            <td className="p-6 text-center text-white font-bold bg-[rgba(16,185,129,0.05)]">{row.tiers[2]}</td>
                                            <td className="p-6 text-center text-[var(--text-secondary)]">{row.tiers[3]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQs */}
                <section className="py-32 px-4">
                    <div className="container max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">You've Got Questions? <br/> <span className="text-gradient-violet">We've Got Answers.</span></h2>
                            <p className="text-[var(--text-secondary)]">And if you don't find it here, our AI bot will roast... I mean, help you.</p>
                        </div>
                        
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="glass border border-[var(--color-border-bright)] rounded-2xl overflow-hidden transition-colors hover:border-[var(--violet)]">
                                    <button
                                        className="w-full p-6 text-left flex justify-between items-center text-white font-semibold text-lg"
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    >
                                        {faq.q} 
                                        <ChevronDown className={`transition-transform duration-300 text-[var(--violet)] ${openFaq === i ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <div className="px-6 pb-6 pt-2 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--color-border-bright)] mt-2">
                                                    {faq.a}
                                                </div>
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
