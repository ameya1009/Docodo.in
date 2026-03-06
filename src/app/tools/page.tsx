'use client';

import { BentoCard } from '@/components/ui/BentoCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Starfield } from '@/components/ui/Starfield';
import { Brain, Zap, Search, MessageSquare, Share2, TrendingUp, BarChart3, Database, Globe, Layers, ShieldCheck, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ToolsPage() {
    return (
        <main className="relative min-h-screen bg-[#000814] text-white overflow-x-hidden">
            <Starfield />
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <span className="w-12 h-[1px] bg-cyan-500/50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 font-sans">Growth OS Interface</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-4"
                    >
                        Tool <span className="text-zinc-500">Center.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 max-w-xl text-lg leading-relaxed"
                    >
                        Pure functional bento interface for running AI agents. Click on any box to launch its engine.
                    </motion.p>
                </header>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[240px]"
                >

                    {/* TOOL: GROWTH GRADER - 2x2 */}
                    <motion.div variants={item} className="md:col-span-2 md:row-span-2">
                        <BentoCard span="2x2" className="group" videoSrc="mock">
                            <div className="h-full flex flex-col justify-between relative z-10">
                                <div className="space-y-6">
                                    <div className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                                        <TrendingUp size={28} className="text-cyan-400" />
                                    </div>
                                    <h3 className="text-4xl font-black mb-2 tracking-tighter">Growth Grader</h3>
                                    <p className="text-zinc-300 text-sm max-w-sm leading-relaxed">
                                        Advanced domain forensics. We analyze market share, pixel health, and SEO gaps for Pune businesses.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-lg w-fit">
                                        <Zap size={12} /> ENGINE READY
                                    </div>
                                    <Link href="/growth-grader">
                                        <Button className="w-full bg-white text-black font-black uppercase text-xs tracking-widest h-14 rounded-2xl hover:bg-cyan-400 transition-all flex gap-2">
                                            Run Diagnostic <PlayCircle size={18} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: HINGLISH BOT - 1x1 */}
                    <motion.div variants={item}>
                        <BentoCard className="flex flex-col justify-between p-8" videoSrc="mock">
                            <div className="relative z-10 space-y-4">
                                <MessageSquare className="text-purple-400" size={24} />
                                <h3 className="text-xl font-black tracking-tight">Hinglish Bot</h3>
                                <p className="text-zinc-400 text-[11px] leading-relaxed">Automate trust with local slang integration.</p>
                            </div>
                            <Button variant="outline" className="relative z-10 w-full border-zinc-800 text-[10px] font-black uppercase h-10 rounded-xl hover:bg-purple-500/20">
                                Launch
                            </Button>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: LEAD SYNC - 1x2 */}
                    <motion.div variants={item} className="md:row-span-2">
                        <BentoCard span="1x2" className="flex flex-col justify-between border-green-500/10" videoSrc="mock">
                            <div className="relative z-10">
                                <Database className="text-green-400 mb-8" size={32} />
                                <h3 className="text-3xl font-black mb-4 tracking-tighter leading-none">Lead Matrix</h3>
                                <div className="space-y-3 mb-8">
                                    {['Facebook Ads', 'Insta Leads', 'WhatsApp Chat'].map(p => (
                                        <div key={p} className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 bg-white/5 p-2.5 rounded-xl border border-white/5">
                                            <ShieldCheck size={14} className="text-green-400" /> {p}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative z-10 space-y-3">
                                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ x: [-100, 300] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="h-full w-1/3 bg-green-400"
                                    />
                                </div>
                                <Button className="w-full bg-green-500 text-black font-black uppercase text-[11px] tracking-widest h-12 rounded-xl">
                                    Sync Now
                                </Button>
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: STRATEGY HUB - 1x1 */}
                    <motion.div variants={item}>
                        <BentoCard className="flex flex-col justify-between p-8" videoSrc="mock">
                            <div className="relative z-10 space-y-4">
                                <Brain className="text-amber-400" size={24} />
                                <h3 className="text-xl font-black tracking-tight">Strategy OS</h3>
                                <p className="text-zinc-400 text-[11px] leading-relaxed">AI Playbooks tailored for Baner & Viman Nagar.</p>
                            </div>
                            <Button variant="outline" className="relative z-10 w-full border-zinc-800 text-[10px] font-black uppercase h-10 rounded-xl">
                                Generate
                            </Button>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: REVENUE PULSE - 2x1 */}
                    <motion.div variants={item} className="md:col-span-2">
                        <BentoCard span="2x1" className="flex items-center justify-between" videoSrc="mock">
                            <div className="relative z-10">
                                <div className="text-4xl font-black font-mono mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">₹52,400</div>
                                <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">Monthly Growth Pulse</p>
                            </div>
                            <div className="relative z-10 flex gap-4">
                                <div className="space-y-2 text-right">
                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Efficiency</div>
                                    <div className="text-xl font-black text-green-400">+12%</div>
                                </div>
                                <div className="h-12 w-[1px] bg-zinc-800" />
                                <BarChart3 size={32} className="text-white/20 self-center" />
                            </div>
                        </BentoCard>
                    </motion.div>

                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
