'use client';

import { BentoCard } from '@/components/ui/BentoCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Starfield } from '@/components/ui/Starfield';
import { Brain, Zap, Search, MessageSquare, Share2, TrendingUp, BarChart3, Database, Globe, Layers, ShieldCheck } from 'lucide-react';
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
        <main className="relative min-h-screen bg-[#000814] text-white">
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
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">The Growth Suite v2.0</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-4"
                    >
                        Growth <span className="text-zinc-500">Toolbox.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 max-w-xl text-lg leading-relaxed"
                    >
                        Precision engineering for Pune SMBs. Modular agents that drive revenue, automate trust, and scale presence.
                    </motion.p>
                </header>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[220px]"
                >

                    {/* TOOL: GROWTH GRADER - 2x2 */}
                    <motion.div variants={item} className="md:col-span-2 md:row-span-2">
                        <BentoCard span="2x2" className="group" videoSrc="mock">
                            <div className="h-full flex flex-col justify-between relative z-10">
                                <div>
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 mb-8">
                                        <TrendingUp size={24} className="text-cyan-400" />
                                    </div>
                                    <h3 className="text-4xl font-black mb-4 tracking-tighter">Growth Grader</h3>
                                    <p className="text-zinc-300 text-sm max-w-sm leading-relaxed mb-8">
                                        The industry-standard audit for Pune businesses. We scan 50+ data points to find where your next ₹50k/mo is hiding.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <Link href="/growth-grader">
                                        <Button className="bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl hover:bg-white transition-all">
                                            Run Free Audit
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: HINGLISH BOT - 1x1 */}
                    <motion.div variants={item}>
                        <BentoCard className="flex flex-col justify-between p-8">
                            <MessageSquare className="text-purple-400" size={20} />
                            <div>
                                <h3 className="text-lg font-black mb-2 tracking-tight">Hinglish AI</h3>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Trust Automator</p>
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: LEAD SYNC - 1x2 */}
                    <motion.div variants={item} className="md:row-span-2">
                        <BentoCard span="1x2" className="flex flex-col justify-between border-green-500/10">
                            <div>
                                <Database className="text-green-400 mb-8" size={24} />
                                <h3 className="text-2xl font-black mb-4 tracking-tight leading-none">Lead Matrix</h3>
                                <div className="space-y-4">
                                    {['Facebook', 'Insta', 'WhatsApp'].map(p => (
                                        <div key={p} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                            <ShieldCheck size={12} className="text-white/20" /> {p}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button variant="outline" className="w-full border-zinc-800 text-[9px] font-black uppercase italic">Live Syncing...</Button>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: STRATEGY HUB - 1x1 */}
                    <motion.div variants={item}>
                        <BentoCard className="flex flex-col justify-between p-8">
                            <Brain className="text-amber-400" size={20} />
                            <div>
                                <h3 className="text-lg font-black mb-2 tracking-tight">Strategy OS</h3>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">GTM Planner</p>
                            </div>
                        </BentoCard>
                    </motion.div>

                    {/* TOOL: REVENUE PULSE - 2x1 */}
                    <motion.div variants={item} className="md:col-span-2">
                        <BentoCard span="2x1" className="flex items-center justify-between">
                            <div>
                                <h3 className="text-3xl font-black mb-2 tracking-tighter">₹52,400</h3>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Avg. Monthly ROI Lift</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <Layers size={16} className="text-zinc-600" />
                                </div>
                                <Zap size={16} className="text-cyan-400 mt-5" />
                            </div>
                        </BentoCard>
                    </motion.div>

                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
