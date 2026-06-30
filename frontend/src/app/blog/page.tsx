'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Calendar, ArrowRight, Clock, Tag } from 'lucide-react';

interface Resource {
    title: string;
    category: string;
    description: string;
    thumbnail: string;
    readTime: string;
    date: string;
}

const resources: Resource[] = [
    {
        title: "Global SMB WhatsApp Bot Strategy 2026",
        category: "Automations",
        description: "How to automate 90% of global bookings using multi-lang agents. Hinglish/English variants included.",
        thumbnail: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800",
        readTime: "12 min read",
        date: "March 2026"
    },
    {
        title: "NYC Cafe AI Order Bot Playbook",
        category: "Food & Bev",
        description: "Standardizing $800/mo ROI via Bleecker St. automation templates.",
        thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
        readTime: "10 min read",
        date: "March 2026"
    },
    {
        title: "AI Video Marketing for Global E-Comm",
        category: "Visual Marketing",
        description: "Generating TikTok/IG Reels that drive $600/mo organic traffic.",
        thumbnail: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800",
        readTime: "15 min read",
        date: "Feb 2026"
    },
    {
        title: "London Salon Booking OS",
        category: "Health & Beauty",
        description: "Reducing Mayfair no-shows by 75% using dynamic schedule AI.",
        thumbnail: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
        readTime: "8 min read",
        date: "Feb 2026"
    },
    {
        title: "n8n Lead Gen for Singapore SMBs",
        category: "Sales Automation",
        description: "Scraping and qualifying 500+ leads/week via safe Git workflows.",
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
        readTime: "12 min read",
        date: "Jan 2026"
    },
    {
        title: "Hugging Face Models for Customer Bot",
        category: "Deep Tech",
        description: "How to use 100k-star repos to build safe, multilingual support agents.",
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
        readTime: "20 min read",
        date: "Jan 2026"
    },
    {
        title: "Whisper AI: Podcasts to Scripts",
        category: "Content Gen",
        description: "Monetizing audio into $700/mo YouTube SEO scripts using OpenAI Whisper.",
        thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800",
        readTime: "9 min read",
        date: "Dec 2025"
    },
    {
        title: "Global SEO: Multi-Locale Mastery",
        category: "Search",
        description: "Ranking #1 in 50 countries using semantic AI content nodes.",
        thumbnail: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=800",
        readTime: "14 min read",
        date: "Dec 2025"
    },
    {
        title: "Zapier Agents vs. n8n Self-Host",
        category: "Ops Strategy",
        description: "Choosing the right engine for $300/week affiliate outreach.",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bbbda5366fd6?auto=format&fit=crop&q=80&w=800",
        readTime: "11 min read",
        date: "Nov 2025"
    },
    {
        title: "Gumloop: 70% Faster Automations",
        category: "Productivity",
        description: "Building site tweaks and ad flows for e-comm inventory alerts.",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        readTime: "7 min read",
        date: "Nov 2025"
    },
    {
        title: "Affiliate Automator: Passive Income AI",
        category: "Cash Gen",
        description: "Building email/social funnels that gen $400/week in commissions.",
        thumbnail: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800",
        readTime: "13 min read",
        date: "Oct 2025"
    },
    {
        title: "AI Website Blueprint for Clinics",
        category: "Healthcare",
        description: "Patient booking + Follow-up bots in 10 mins using Docodo templates.",
        thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
        readTime: "10 min read",
        date: "Oct 2025"
    },
    {
        title: "Open-Sora: Text-to-Video for Reels",
        category: "Visual AI",
        description: "Safe, open-source alternatives to RunwayML for viral salon ads.",
        thumbnail: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800",
        readTime: "15 min read",
        date: "Sept 2025"
    },
    {
        title: "Canva AI: Global Banner Factory",
        category: "Design",
        description: "Auto-generating high-CTR ads for 50+ languages instantly.",
        thumbnail: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=800",
        readTime: "8 min read",
        date: "Sept 2025"
    },
    {
        title: "SMB Growth OS: The 2026 Vision",
        category: "Vision",
        description: "Why integrated tech is the only survival path for local legends.",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
        readTime: "12 min read",
        date: "Aug 2025"
    }
];

export default function BlogPage() {
    const firstResource = resources[0];
    const remainingResources = resources.slice(1);

    return (
        <main className="bg-[#07060A] min-h-screen pt-24 pb-20">
            <Navbar />

            <div className="container relative z-10 max-w-7xl mx-auto px-4 md:px-6">
                {/* Editorial Header */}
                <header className="py-16 md:py-24 max-w-4xl">
                    <motion.span
                        className="inline-block px-4 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        SMB Global Growth Hub
                    </motion.span>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-[1.1]">
                        Global AI <span className="text-gradient">Playbooks.</span>
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
                        Free engineering-grade reports to help your worldwide SMB scale 10x with AI and technical GTM.
                    </p>
                </header>

                <section className="space-y-12">
                    {/* Featured Report */}
                    {firstResource && (
                        <motion.div
                            className="group relative rounded-[2rem] bg-[#0E0C15]/80 backdrop-blur-xl border border-white/5 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 transition-colors hover:border-white/10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="relative h-[300px] lg:h-[500px] overflow-hidden">
                                <img src={firstResource.thumbnail} alt={firstResource.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C15] lg:from-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0E0C15]" />
                            </div>
                            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                                <span className="text-mint-400 text-sm font-bold tracking-widest uppercase mb-4 inline-block">Highest ROI Playbook</span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{firstResource.title}</h2>
                                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">{firstResource.description}</p>
                                <div className="flex flex-wrap items-center gap-6 mb-10 text-sm font-medium text-zinc-500">
                                    <span className="flex items-center gap-2"><Clock size={16} /> {firstResource.readTime}</span>
                                    <span className="flex items-center gap-2"><Calendar size={16} /> {firstResource.date}</span>
                                </div>
                                <Button size="lg" className="self-start">
                                    Download Playbook <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {remainingResources.map((resource, idx) => (
                            <motion.div
                                key={idx}
                                className={`group rounded-[2rem] bg-[#0E0C15]/80 backdrop-blur-xl border border-white/5 overflow-hidden flex flex-col transition-colors hover:border-white/10 ${idx % 3 === 0 ? 'md:col-span-2' : ''}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="relative h-[240px] overflow-hidden bg-zinc-900">
                                    <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4 text-xs font-bold uppercase tracking-widest">
                                        <span className="text-violet-400 flex items-center gap-1.5"><Tag size={12} /> {resource.category}</span>
                                        <span className="text-zinc-600">{resource.date}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">{resource.title}</h3>
                                    <p className="text-zinc-400 mb-8 flex-1 line-clamp-3">{resource.description}</p>
                                    <button className="text-white font-bold flex items-center gap-2 text-sm group-hover:text-mint-400 transition-colors self-start mt-auto">
                                        Read Report <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
