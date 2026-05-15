'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Share2, ExternalLink, TrendingUp, Users, MapPin, SlidersHorizontal } from 'lucide-react';

const filters = ["All", "Salons", "Clinics", "Cafes", "Consultants"];

const cases = [
    {
        title: "Viman Nagar Cafe: Oxygenating Orders",
        category: "Cafes",
        type: "Growth OS + Apps",
        location: "Viman Nagar, Pune",
        desc: "Implemented a custom AI-ordering WhatsApp bot that increased digital orders by 140% in 60 days.",
        roi: "+₹42,000/mo",
        metric: "140% Orders",
        beforeImg: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
        afterImg: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=800",
        id: "viman-cafe"
    },
    {
        title: "Kothrud Dental: Auto-Pilot Bookings",
        category: "Clinics",
        type: "AI Marketing + Bots",
        location: "Kothrud, Pune",
        desc: "Reduced no-shows by 60% using an automated Marathi/English appointment bot integrated with local SEO.",
        roi: "60% Fewer No-shows",
        metric: "45 Bookings/mo",
        beforeImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800",
        afterImg: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800",
        id: "kothrud-dental"
    },
    {
        title: "Baner Luxury Salon: Digital Facelift",
        category: "Salons",
        type: "Websites & SEO",
        location: "Baner, Pune",
        desc: "Engineered a premium Apple-lite website with local SEO dominance. Now ranking #1 for 'Luxury Salon Baner'.",
        roi: "₹35k Extra Rev",
        metric: "Top 1 Ranking",
        beforeImg: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
        afterImg: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800",
        id: "baner-salon"
    },
    {
        title: "Pimpri Hardware: B2B Automation",
        category: "Consultants",
        type: "Custom Systems",
        location: "Pimpri-Chinchwad",
        desc: "Automated inventory sync with a WhatsApp-based ordering system for regional distributors.",
        roi: "20hrs Saved/wk",
        metric: "Digital Inventory",
        beforeImg: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
        afterImg: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
        id: "pimpri-hardware"
    }
];

export default function CasesPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredCases = activeFilter === "All" 
        ? cases 
        : cases.filter(c => c.category === activeFilter);

    const handleShare = (title: string) => {
        const text = `Just seen how Docodo helped a local Pune business grow! ${title} - Real ROI with AI Growth OS. 🚀 #PuneSMB #DocodoAI`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <main className="bg-[#0F0F0F] min-h-screen relative overflow-hidden">
            {/* 3D Video Background */}
            <div className="absolute top-0 left-0 w-full h-[60vh] z-0 opacity-20 pointer-events-none">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-particle-background-animation-3043-large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F0F0F]" />
            </div>

            <div className="relative z-10">
                <Navbar />

                <section className="pt-32 pb-20 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-cyan-400 font-bold uppercase tracking-widest text-xs px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20"
                            >
                                Localized Success
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white text-5xl md:text-7xl font-extrabold mt-6 mb-6 tracking-tighter"
                            >
                                Pune <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sapphire-400">Wins.</span>
                            </motion.h1>
                            <p className="text-zinc-400 text-lg">
                                We don&apos;t just build sites. We build profit machines for Pune&apos;s most ambitious SMBs.
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                            <SlidersHorizontal size={20} className="text-zinc-500 mr-2 hidden md:block" />
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                                        activeFilter === filter 
                                            ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                                            : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Grid */}
                        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredCases.map((cs, i) => (
                                    <motion.div
                                        layout
                                        key={cs.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden group"
                                    >
                                        {/* Before/After Slider Mockup */}
                                        <div className="relative h-64 md:h-80 w-full overflow-hidden">
                                            <div className="absolute inset-0 w-full h-full">
                                                <img src={cs.afterImg} alt="After" className="w-full h-full object-cover" />
                                                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/20 z-20">After Docodo</div>
                                            </div>
                                            {/* Clip Path Before Image (Simulating Slider at 50%) */}
                                            <div className="absolute inset-0 w-full h-full border-r-2 border-white" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                                                <img src={cs.beforeImg} alt="Before" className="w-full h-full object-cover opacity-80 grayscale" />
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-zinc-400 border border-white/20 z-20">Before</div>
                                            </div>
                                            {/* Slider Handle */}
                                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 flex items-center justify-center z-30 cursor-ew-resize">
                                                <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                                                    <div className="w-1 h-4 border-l border-r border-zinc-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                                                <div className="flex gap-2">
                                                    <span className="px-3 py-1 rounded-full bg-sapphire-500/10 text-sapphire-400 text-[10px] font-black uppercase tracking-widest border border-sapphire-500/20">
                                                        {cs.type}
                                                    </span>
                                                </div>
                                                <span className="text-zinc-500 text-xs flex items-center gap-1 font-medium">
                                                    <MapPin size={12} /> {cs.location}
                                                </span>
                                            </div>

                                            <h2 className="text-2xl font-bold text-white mb-3">{cs.title}</h2>
                                            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">{cs.desc}</p>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Monthly ROI</div>
                                                    <div className="text-xl font-black text-emerald-400">{cs.roi}</div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Key Metric</div>
                                                    <div className="text-xl font-black text-white">{cs.metric}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 gap-2 border-white/10 hover:bg-white/5"
                                                    onClick={() => handleShare(cs.title)}
                                                >
                                                    <Share2 size={16} /> Share
                                                </Button>
                                                <Button variant="primary" className="flex-1 gap-2 bg-emerald-500 hover:bg-emerald-400 text-black">
                                                    Read Study <ExternalLink size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* CTA */}
                        <div className="mt-24 text-center">
                            <div className="relative inline-block p-8 md:p-12 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 max-w-3xl overflow-hidden w-full">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-sapphire-500/10 rounded-full blur-3xl -z-10" />
                                
                                <h3 className="text-3xl font-bold text-white mb-4">You're Next.</h3>
                                <p className="text-zinc-400 mb-8 max-w-lg mx-auto">Ready to add ₹50k/month to your bottom line with AI systems? Let's audit your business today.</p>
                                <Button variant="primary" size="lg" className="w-full sm:w-auto px-10 py-5 text-base" onClick={() => window.location.href = '/growth-grader'}>
                                    Start Free 50-Point Audit
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
