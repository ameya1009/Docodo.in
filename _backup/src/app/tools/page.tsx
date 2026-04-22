'use client';

import { BentoCard } from '@/components/ui/BentoCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Starfield } from '@/components/ui/Starfield';
import { Brain, Zap, Search, MessageSquare, Share2, TrendingUp, BarChart3, Database, Globe, Layers, ShieldCheck, PlayCircle, Settings, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
} as any;

const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
} as any;

export default function ToolsPage() {
    return (
        <main className="relative min-h-screen bg-[#000814] text-white overflow-x-hidden selection:bg-cyan-500/30">
            <Starfield />
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
                <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                Growth OS v4.0
                            </span>
                            <span className="w-8 h-[1px] bg-white/10" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-500">Stability: High</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85]"
                        >
                            Utility <br />
                            <span className="text-zinc-700">Hub / OS</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-zinc-500 text-xl leading-relaxed max-w-lg"
                        >
                            Spacious. Systematic. Engineering-first. Run your AI growth agents from a unified building-block interface.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="hidden lg:block p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl"
                    >
                        <div className="flex gap-4 items-center mb-6">
                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </div>
                            <div className="text-sm font-bold tracking-tight">System Status: Optimal</div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                <span>Credits</span>
                                <span>1,240</span>
                            </div>
                            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-cyan-500" />
                            </div>
                        </div>
                    </motion.div>
                </header>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 auto-rows-[320px]"
                >

                    {/* TOOL: GROWTH GRADER - LARGE */}
                    <motion.div variants={item} className="lg:col-span-2 lg:row-span-2">
                        <BentoCard span="2x2" className="group p-2" videoSrc="mock">
                            <div className="h-full flex flex-col justify-between relative z-10 p-4">
                                <div>
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="w-16 h-16 bg-white/5 backdrop-blur-3xl rounded-3xl flex items-center justify-center border border-white/10 outline outline-1 outline-white/5 group-hover:scale-110 transition-transform duration-700">
                                            <TrendingUp size={32} className="text-cyan-400" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">Precision</div>
                                            <div className="text-xl font-black text-white">99.2%</div>
                                        </div>
                                    </div>
                                    <h3 className="text-5xl font-black mb-6 tracking-tighter leading-none">Growth <br />Grader</h3>
                                    <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                                        Scan 50+ data points across your domain. Identify hidden revenue leaking from clinics, cafes, and salons.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-12 border-t border-white/5">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#000814] bg-zinc-800 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 rounded-full border-2 border-[#000814] bg-white flex items-center justify-center text-[10px] text-black font-black">+42</div>
                                    </div>
                                    <Link href="/growth-grader">
                                        <Button className="bg-white text-black font-black uppercase text-xs tracking-[0.2em] px-10 h-16 rounded-2xl hover:bg-cyan-500 hover:text-black transition-all group-hover:px-12">
                                            Launch Scan
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: HINGLISH BOT */}
                    <motion.div variants={item}>
                        <BentoCard className="flex flex-col justify-between group" videoSrc="mock">
                            <div className="relative z-10">
                                <MessageSquare className="text-purple-400 mb-8" size={28} />
                                <h3 className="text-3xl font-black mb-4 tracking-tighter">Hinglish Bot</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">Simulate customer trust with local Pune slang. 95% retention rate boost.</p>
                            </div>
                            <Button variant="outline" className="relative z-10 w-full border-zinc-800 text-xs font-black uppercase h-14 rounded-2xl hover:bg-purple-500/10 hover:border-purple-500/30 transition-all">
                                Open Sandbox
                            </Button>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: LEAD MATRIX */}
                    <motion.div variants={item}>
                        <BentoCard className="flex flex-col justify-between group" videoSrc="mock">
                            <div className="relative z-10">
                                <Database className="text-green-400 mb-8" size={28} />
                                <h3 className="text-3xl font-black mb-4 tracking-tighter">Lead Matrix</h3>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {['FB', 'IG', 'WA'].map(p => (
                                        <span key={p} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-widest">{p}</span>
                                    ))}
                                </div>
                            </div>
                            <Button variant="primary" className="relative z-10 w-full bg-green-500 text-black text-xs font-black uppercase h-14 rounded-2xl flex gap-2">
                                Sync Engine <Zap size={14} />
                            </Button>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: STRATEGY OS */}
                    <motion.div variants={item}>
                        <BentoCard className="flex flex-col justify-between group" videoSrc="mock">
                            <div className="relative z-10">
                                <Brain className="text-amber-400 mb-8" size={28} />
                                <h3 className="text-3xl font-black mb-4 tracking-tighter">Strategy OS</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">AI Playbooks tailored for localized Pune hubs.</p>
                            </div>
                            <div className="relative z-10 flex flex-col gap-2">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-amber-400/5 transition-colors">
                                    <div className="text-[10px] font-black text-zinc-600 uppercase mb-1">Last Plan</div>
                                    <div className="text-xs font-bold text-zinc-300 italic">Kothrud Cafe...</div>
                                </div>
                                <Button className="w-full bg-white text-black text-[10px] font-black uppercase h-12 rounded-xl">
                                    New Formula
                                </Button>
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: REVENUE PULSE */}
                    <motion.div variants={item}>
                        <BentoCard className="flex flex-col justify-between group" videoSrc="mock">
                            <div className="relative z-10 text-center">
                                <BarChart3 className="text-cyan-500 mx-auto mb-6" size={32} />
                                <h3 className="text-2xl font-black mb-2 tracking-tighter">Revenue Pulse</h3>
                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Real-time ROI Tracking</p>
                            </div>
                            <div className="relative z-10 p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                                <div className="text-4xl font-black mb-1">₹52k</div>
                                <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest">+12.4% MoM</div>
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: VIRAL SHARE */}
                    <motion.div variants={item}>
                        <BentoCard className="flex flex-col justify-between group" videoSrc="mock">
                            <div className="relative z-10">
                                <Share2 className="text-red-400 mb-8" size={28} />
                                <h3 className="text-3xl font-black mb-4 tracking-tighter">Viral Flow</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">Instantly share audit results to social.</p>
                            </div>
                            <Button variant="ghost" className="relative z-10 w-full text-zinc-600 text-[10px] font-black uppercase hover:text-white">
                                Configure <Settings size={14} className="ml-2" />
                            </Button>
                        </BentoCard>
                    </motion.div>

                </motion.div>

                {/* BOTTOM CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-32 p-12 bg-white rounded-[3rem] text-black flex flex-col items-center text-center group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="text-cyan-600 mb-8" size={32} />
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">Can't find <br />your tool?</h2>
                    <p className="text-xl text-zinc-600 max-w-lg mb-12 font-medium leading-relaxed">
                        We build custom AI agents for specialized Pune business workflows in under 7 days.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-black text-white px-12 h-18 rounded-2xl text-sm font-black uppercase tracking-widest flex gap-3 hover:bg-cyan-600 hover:scale-105 transition-all">
                            Request Custom Build <ArrowRight size={18} />
                        </Button>
                    </Link>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}

function Sparkles({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" />
        </svg>
    );
}
