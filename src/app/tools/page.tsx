'use client';

import { BentoCard } from '@/components/ui/BentoCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Starfield } from '@/components/ui/Starfield';
import { Brain, Zap, Search, MessageSquare, Share2, TrendingUp, BarChart3, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ToolsPage() {
    return (
        <main className="relative min-h-screen bg-[#000814] text-white">
            <Starfield />
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="mb-12">
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Growth Toolbox</h1>
                    <p className="text-zinc-500">All your AI-powered growth agents in one building-block interface.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[240px]">

                    {/* TOOL: GROWTH GRADER */}
                    <BentoCard span="2x1" glowColor="rgba(0, 212, 255, 0.2)">
                        <div className="flex items-center justify-between h-full">
                            <div className="max-w-[60%]">
                                <Search className="text-cyan-400 mb-4" size={24} />
                                <h3 className="text-xl font-bold mb-2">Growth Grader</h3>
                                <p className="text-zinc-500 text-xs mb-4">Scan your site and find ₹50k+ in hidden revenue.</p>
                                <Link href="/growth-grader">
                                    <Button size="sm" className="bg-white text-black text-[10px] font-black uppercase px-4 h-8">Run Audit</Button>
                                </Link>
                            </div>
                            <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
                                <TrendingUp size={32} className="text-cyan-400" />
                            </div>
                        </div>
                    </BentoCard>

                    {/* TOOL: HINGLISH BOT */}
                    <BentoCard span="1x1" glowColor="rgba(168, 85, 247, 0.2)">
                        <MessageSquare className="text-purple-400 mb-4" size={24} />
                        <h3 className="text-lg font-bold mb-2">Hinglish Bot</h3>
                        <p className="text-zinc-500 text-[10px] mb-4">Simulate customer chat in Pune slang.</p>
                        <Button variant="outline" className="w-full text-[9px] border-zinc-800">Launch Simulation</Button>
                    </BentoCard>

                    {/* TOOL: VIRAL SHARE */}
                    <BentoCard span="1x1" glowColor="rgba(239, 68, 68, 0.2)">
                        <Share2 className="text-red-400 mb-4" size={24} />
                        <h3 className="text-lg font-bold mb-2">Viral Boost</h3>
                        <p className="text-zinc-500 text-[10px] mb-4">Generate shareable audit reports.</p>
                        <Button variant="outline" className="w-full text-[9px] border-zinc-800">Generate Report</Button>
                    </BentoCard>

                    {/* TOOL: LEAD SYNC */}
                    <BentoCard span="1x2" glowColor="rgba(34, 197, 94, 0.2)">
                        <Database className="text-green-400 mb-6" size={32} />
                        <h2 className="text-2xl font-bold mb-4 tracking-tight">Lead Matrix</h2>
                        <p className="text-zinc-500 text-xs mb-8 leading-relaxed">
                            Sync leads from Facebook, Google, and WhatsApp directly to your CRM.
                        </p>
                        <div className="space-y-3 mb-8">
                            {['Auto-Sync', 'Duplicate Check', 'Warm Transfer'].map((f) => (
                                <div key={f} className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest bg-white/5 p-2 rounded-lg">
                                    <Zap size={10} className="text-green-400" /> {f}
                                </div>
                            ))}
                        </div>
                        <Button className="w-full bg-green-500 text-black font-black uppercase text-[10px] tracking-widest h-11">Activate Sync</Button>
                    </BentoCard>

                    {/* TOOL: REVENUE TRACKER */}
                    <BentoCard span="2x1" glowColor="rgba(234, 179, 8, 0.2)">
                        <div className="flex h-full gap-4 items-center">
                            <div className="flex-1">
                                <BarChart3 className="text-amber-400 mb-4" size={24} />
                                <h3 className="text-xl font-bold mb-2">Revenue Pulse</h3>
                                <p className="text-zinc-500 text-xs">Real-time tracking of AI-driven sales conversions.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <div className="text-xs font-mono text-zinc-600">LTV</div>
                                    <div className="font-bold text-white tracking-widest">₹14k</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <div className="text-xs font-mono text-zinc-600">CAC</div>
                                    <div className="font-bold text-white tracking-widest">₹200</div>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* TOOL: GTM PLAYBOOK */}
                    <BentoCard span="1x1" glowColor="rgba(59, 130, 246, 0.2)">
                        <Brain className="text-blue-400 mb-4" size={24} />
                        <h3 className="text-lg font-bold mb-2">Strategy Hub</h3>
                        <p className="text-zinc-500 text-[10px] mb-4">AI-generated growth playbooks for Suncity, Baner, etc.</p>
                        <Button variant="outline" className="w-full text-[9px] border-zinc-800">Generate Plan</Button>
                    </BentoCard>

                </div>
            </div>

            <Footer />
        </main>
    );
}
