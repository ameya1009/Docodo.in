'use client';

import { BentoCard } from '@/components/ui/BentoCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Starfield } from '@/components/ui/Starfield';
import { Brain, Zap, Search, MessageSquare, Share2, TrendingUp, BarChart3, Database, Globe, Layers, ShieldCheck, PlayCircle, Settings, Users, ArrowRight, Video, FileText, Code } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const tools = [
    {
        id: 'zapier-agents',
        name: 'Zapier Agents',
        icon: <Zap className="text-cyan-400" />,
        desc: 'No-code lead-to-sale automation. 300% YoY SMB growth tool.',
        repo: 'n8n-io/n8n',
        stars: '40k+',
        credits: 10,
        cash: '$300/week passive outreach',
        trending: true,
        span: '2x2'
    },
    {
        id: 'gumloop',
        name: 'Gumloop Agents',
        icon: <Layers className="text-amber-400" />,
        desc: 'Custom site & ad content flows. 70% faster than Zapier.',
        repo: 'awesome-ai-tools',
        stars: '7k+',
        credits: 15,
        cash: '$500/mo savings on inventory',
        span: '1x1'
    },
    {
        id: 'seo-optimizer',
        name: 'Surfer SEO Alt',
        icon: <Search className="text-green-400" />,
        desc: 'AI meta-scan in 50+ languages for 100% traffic lift.',
        repo: 'huggingface/transformers',
        stars: '120k+',
        credits: 5,
        cash: '$400/mo affiliate traffic',
        span: '1x1'
    },
    {
        id: 'botpress',
        name: 'Botpress Logic',
        icon: <MessageSquare className="text-purple-400" />,
        desc: 'WhatsApp multi-lang agents for booking & qualification.',
        repo: 'n8n-io/n8n-nodes',
        credits: 8,
        cash: '$1k/mo conversion funnels',
        span: '1x2'
    },
    {
        id: 'video-maker',
        name: 'AI Video Maker',
        icon: <Video className="text-red-400" />,
        desc: 'Promo reels from scripts. 200% higher e-comm video ROI.',
        repo: 'hpcaitech/Open-Sora',
        stars: '20k+',
        credits: 20,
        cash: '$600/mo social traffic gen',
        span: '2x1'
    },
    {
        id: 'script-analyzer',
        name: 'Whisper Script',
        icon: <FileText className="text-blue-400" />,
        desc: 'Analyze & make viral scripts. OpenAI Whisper-based engine.',
        repo: 'openai/whisper',
        stars: '50k+',
        credits: 10,
        cash: '$700/mo YouTube monetization',
        span: '1x1'
    },
    {
        id: 'lead-gen',
        name: 'n8n Lead Gen',
        icon: <Database className="text-teal-400" />,
        desc: 'Scrape & qualify LinkedIn leads globally. Safe & verified.',
        repo: 'n8n-io/n8n',
        credits: 25,
        cash: '$1.5k/mo consulting gigs',
        span: '1x1'
    }
];

export default function MarketplacePage() {
    const [balance, setBalance] = useState(1240);
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

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
                                AI Marketplace v5.0
                            </span>
                            <span className="w-8 h-[1px] bg-white/10" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-500">Verified Safe Repos</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85]"
                        >
                            Tool <br />
                            <span className="text-zinc-700">Market.</span>
                        </motion.h1>
                        <p className="text-zinc-500 text-xl leading-relaxed max-w-lg">
                            Live, credit-based access to trending 2026 AI growth automations. Safe Git-integrated engines for global ROI.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl min-w-[320px]"
                    >
                        <div className="flex gap-4 items-center mb-8">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
                                <Zap size={20} className="text-cyan-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Your Engine Fuel</div>
                                <div className="text-2xl font-black">{balance} Credits</div>
                            </div>
                        </div>
                        <Button className="w-full bg-white text-black font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl hover:bg-cyan-500">
                            Recharge Packs (+30% Bonus)
                        </Button>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[300px]">
                    {tools.map((tool) => (
                        <motion.div
                            key={tool.id}
                            className={tool.span === '2x2' ? 'lg:col-span-2 lg:row-span-2' : tool.span === '1x2' ? 'lg:row-span-2' : tool.span === '2x1' ? 'lg:col-span-2' : ''}
                        >
                            <BentoCard span={tool.span as any} className="group p-0" videoSrc="mock">
                                <div className="h-full flex flex-col justify-between p-8 relative z-10">
                                    <div>
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-14 h-14 bg-white/5 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                                {tool.icon}
                                            </div>
                                            {tool.trending && (
                                                <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-[9px] font-black text-red-500 uppercase tracking-widest rounded-lg">Trending</span>
                                            )}
                                        </div>
                                        <h3 className={tool.span === '2x2' ? "text-5xl font-black mb-4 tracking-tighter" : "text-2xl font-black mb-2 tracking-tight"}>
                                            {tool.name}
                                        </h3>
                                        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-6">{tool.desc}</p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-zinc-400">
                                                <Code size={12} /> {tool.repo}
                                            </div>
                                            {tool.stars && (
                                                <div className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-black text-cyan-400">
                                                    ★ {tool.stars}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                                        <div className="flex flex-col">
                                            <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Est. ROI</div>
                                            <div className="text-xs font-bold text-green-400">{tool.cash}</div>
                                        </div>
                                        <Button className="bg-white text-black font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl hover:bg-cyan-500 shrink-0">
                                            Run ({tool.credits}cr)
                                        </Button>
                                    </div>
                                </div>
                            </BentoCard>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-32 p-16 bg-white rounded-[4rem] text-black text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">Need a Custom <br />Global Engine?</h2>
                    <p className="text-xl text-zinc-600 max-w-xl mx-auto mb-12 font-medium">
                        We integrate specialized n8n, Hugging Face, and Zapier agents for any locale in 7 days.
                    </p>
                    <div className="flex justify-center gap-6">
                        <Link href="/contact">
                            <Button className="bg-black text-white px-12 h-20 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-cyan-600 transition-all">
                                Request Build
                            </Button>
                        </Link>
                        <Button variant="outline" className="border-black text-black px-12 h-20 rounded-2xl text-sm font-black uppercase tracking-widest">
                            Enterprise Packs
                        </Button>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
