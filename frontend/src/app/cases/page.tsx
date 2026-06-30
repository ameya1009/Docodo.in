'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Share2, ExternalLink, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';

const filters = ["All", "Salons", "Clinics", "Cafes", "Tech Bros"];

const cases = [
    {
        title: "Viman Nagar Cafe: Surviving Swiggy Margins",
        category: "Cafes",
        type: "Growth OS + Bots",
        location: "Viman Nagar, Pune",
        desc: "Implemented a WhatsApp AI bot that takes direct orders. Increased direct sales by 140% in 60 days. Take that, 30% commission fees.",
        roi: "+₹42,000/mo",
        metric: "140% Direct Orders",
        beforeImg: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
        afterImg: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=800",
        id: "viman-cafe",
        theme: "mint"
    },
    {
        title: "Kothrud Dental: Auto-Pilot Bookings",
        category: "Clinics",
        type: "AI CRM",
        location: "Kothrud, Pune",
        desc: "Reduced no-shows by 60% using an automated Marathi/English appointment bot. It guilt-trips patients who don't show up.",
        roi: "60% Fewer No-shows",
        metric: "45 Bookings/mo",
        beforeImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800",
        afterImg: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800",
        id: "kothrud-dental",
        theme: "violet"
    },
    {
        title: "Baner Luxury Salon: Influencer Ready",
        category: "Salons",
        type: "Websites & SEO",
        location: "Baner, Pune",
        desc: "Engineered a premium 'Apple-lite' website. Now ranking #1 for 'Luxury Salon Baner' so they can charge ₹5000 for a haircut.",
        roi: "₹35k Extra Rev",
        metric: "Top 1 Ranking",
        beforeImg: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
        afterImg: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800",
        id: "baner-salon",
        theme: "indigo"
    },
    {
        title: "Pimpri Hardware: B2B Automation",
        category: "Tech Bros",
        type: "Custom Systems",
        location: "Pimpri-Chinchwad",
        desc: "Automated inventory sync with a WhatsApp-based ordering system. The uncle owner now plays Candy Crush all day.",
        roi: "20hrs Saved/wk",
        metric: "Digital Inventory",
        beforeImg: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
        afterImg: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
        id: "pimpri-hardware",
        theme: "mint"
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
        <main className="bg-[var(--color-bg)] min-h-screen relative overflow-hidden">
            {/* 3D Grid & Noise Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    transformOrigin: 'top center',
                }}
            />
            
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--mint)] rounded-full blur-[150px] opacity-[0.15] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--violet)] rounded-full blur-[120px] opacity-[0.1] mix-blend-screen pointer-events-none" />


            <div className="relative z-10">
                <Navbar />

                <section className="pt-32 pb-20 px-4">
                    <div className="container">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-bright border-[var(--color-border-bright)] mb-8"
                            >
                                <Sparkles size={14} className="text-[var(--mint)]" />
                                <span className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)]">Case Studies</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-7xl font-extrabold mt-2 mb-6 tracking-tighter text-white"
                            >
                                Pune <span className="text-gradient-growth">Wins.</span>
                            </motion.h1>
                            <p className="text-[var(--text-secondary)] text-lg">
                                We don't just build sites. We build profit machines for Pune's most ambitious SMBs. Here's the proof.
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                            <SlidersHorizontal size={20} className="text-[var(--text-muted)] mr-2 hidden md:block" />
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                                        activeFilter === filter 
                                            ? 'bg-[var(--mint)] text-black shadow-[0_0_20px_var(--mint-glow)]' 
                                            : 'glass-bright text-[var(--text-secondary)] hover:text-white hover:border-[var(--mint)]'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Grid */}
                        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                            <AnimatePresence mode="popLayout">
                                {filteredCases.map((cs) => (
                                    <motion.div
                                        layout
                                        key={cs.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="glass border-[var(--color-border)] rounded-[2.5rem] overflow-hidden group card-3d-wrap"
                                    >
                                        <div className="card-3d h-full flex flex-col">
                                            {/* Before/After Slider Mockup */}
                                            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                                                <div className="absolute inset-0 w-full h-full">
                                                    <img src={cs.afterImg} alt="After" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-[var(--mint)] border border-[var(--mint)] z-20">After Docodo</div>
                                                </div>
                                                {/* Clip Path Before Image (Simulating Slider at 50%) */}
                                                <div className="absolute inset-0 w-full h-full border-r-2 border-white/50" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                                                    <img src={cs.beforeImg} alt="Before" className="w-full h-full object-cover opacity-80 grayscale" />
                                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-[var(--text-secondary)] border border-white/20 z-20">Before</div>
                                                </div>
                                                {/* Slider Handle */}
                                                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 flex items-center justify-center z-30">
                                                    <div className="w-8 h-8 bg-[var(--color-bg-2)] border border-[var(--color-border)] rounded-full shadow-lg flex items-center justify-center">
                                                        <div className="w-1 h-4 border-l border-r border-[var(--text-muted)]" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 flex-grow flex flex-col">
                                                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                                                    <div className="flex gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border 
                                                            ${cs.theme === 'mint' ? 'bg-[var(--mint-glow)] text-[var(--mint)] border-[var(--mint)]' : 
                                                              cs.theme === 'violet' ? 'bg-[var(--violet-glow)] text-[var(--violet)] border-[var(--violet)]' :
                                                              'bg-[var(--indigo-glow)] text-[var(--indigo)] border-[var(--indigo)]'}`}
                                                        >
                                                            {cs.type}
                                                        </span>
                                                    </div>
                                                    <span className="text-[var(--text-muted)] text-xs flex items-center gap-1 font-medium">
                                                        <MapPin size={12} /> {cs.location}
                                                    </span>
                                                </div>

                                                <h2 className="text-2xl font-bold text-white mb-3">{cs.title}</h2>
                                                <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed flex-grow">{cs.desc}</p>

                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border-bright)]">
                                                        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Monthly ROI</div>
                                                        <div className={`text-xl font-black ${cs.theme === 'mint' ? 'text-[var(--mint)]' : cs.theme === 'violet' ? 'text-[var(--violet)]' : 'text-[var(--indigo)]'}`}>{cs.roi}</div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border-bright)]">
                                                        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Key Metric</div>
                                                        <div className="text-xl font-black text-white">{cs.metric}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 gap-2"
                                                        onClick={() => handleShare(cs.title)}
                                                    >
                                                        <Share2 size={16} /> Share
                                                    </Button>
                                                    <Button variant="primary" className="flex-1 gap-2">
                                                        Read Study <ExternalLink size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* CTA */}
                        <div className="mt-24 text-center">
                            <div className="relative inline-block p-8 md:p-12 rounded-[3rem] glass gradient-border-neon max-w-3xl overflow-hidden w-full">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--mint-glow)] rounded-full blur-3xl -z-10" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--violet-glow)] rounded-full blur-3xl -z-10" />
                                
                                <h3 className="text-3xl font-bold text-white mb-4">You're Next.</h3>
                                <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">Ready to stop losing leads and start making money? Let's audit your business today before your competitor does.</p>
                                <Button variant="primary" size="lg" className="w-full sm:w-auto px-10 py-5 text-base shadow-[0_0_30px_var(--mint-glow)]" onClick={() => window.location.href = '/contact'}>
                                    Start Free AI Audit
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
