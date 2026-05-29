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
import { Modal } from '@/components/ui/Modal';
import { ECGGeneratorDemo, WhatsAppSimulatorDemo, SEOSchemaDemo, ColdOutreachDemo } from '@/components/demos/InteractiveTools';

const tools = [
    {
        id: 'whatsapp-bot',
        name: 'WhatsApp Hinglish Agent',
        icon: <MessageSquare className="text-emerald-400" />,
        desc: 'Interactive chat agent that books, pre-qualifies, and speaks local Hinglish. 300% booking lift.',
        repo: 'docodo/whatsapp-agent',
        stars: '1.2k',
        credits: 8,
        cash: '₹15,000/mo booking lift',
        trending: true,
        span: '2x2'
    },
    {
        id: 'ecg-content',
        name: 'ECG Content Generator',
        icon: <FileText className="text-sapphire-400" />,
        desc: 'Generates Evergreen (50%), Controversial (30%), and Growth (20%) social copies based on Raj Shamani formula.',
        repo: 'docodo/ecg-copywriter',
        stars: '850',
        credits: 10,
        cash: 'Save 20 hrs/week content creation',
        span: '1x1'
    },
    {
        id: 'seo-schema',
        name: 'SEO Graph Generator',
        icon: <Search className="text-cyan-400" />,
        desc: 'Valid Google JSON-LD schema builder with custom local business + SoftwareApplication coordinates.',
        repo: 'docodo/seo-schema-gen',
        stars: '420',
        credits: 5,
        cash: 'Top Local Search visibility',
        span: '1x1'
    },
    {
        id: 'cold-outreach',
        name: 'AIDA Outreach Copywriter',
        icon: <Zap className="text-emerald-400" />,
        desc: 'Personalized cold email & WhatsApp campaigns matching local prospect persona and hooks.',
        repo: 'docodo/cold-outreach-agent',
        credits: 12,
        cash: '₹25,000 passive pipeline',
        span: '1x2'
    },
    {
        id: 'zapier-agents',
        name: 'Zapier Automation Agent',
        icon: <Layers className="text-zinc-500" />,
        desc: 'Sync salon calendars with sheets & billing. Custom trigger nodes.',
        repo: 'awesome-ai-tools',
        credits: 15,
        cash: '10 hrs/week admin saved',
        span: '1x1'
    },
    {
        id: 'video-maker',
        name: 'AI Video Maker (Soon)',
        icon: <Video className="text-zinc-500 opacity-60" />,
        desc: 'Generate viral promo reels from raw scripts using AI image assets.',
        repo: 'hpcaitech/Open-Sora',
        credits: 20,
        cash: '$600/mo social traffic gen',
        span: '2x1'
    }
];

export default function MarketplacePage() {
    const [balance, setBalance] = useState(1240);
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const getToolTitle = (id: string | null) => {
        switch (id) {
            case 'whatsapp-bot': return 'WhatsApp Hinglish Booking Simulator';
            case 'ecg-content': return 'ECG Content Generator (Raj Shamani Formula)';
            case 'seo-schema': return 'SEO Rich Graph Schema Generator';
            case 'cold-outreach': return 'AIDA Cold Outreach Copywriter';
            default: return 'AI Growth Engine Workspace';
        }
    };

    const getToolComponent = (id: string | null) => {
        switch (id) {
            case 'whatsapp-bot': return <WhatsAppSimulatorDemo />;
            case 'ecg-content': return <ECGGeneratorDemo />;
            case 'seo-schema': return <SEOSchemaDemo />;
            case 'cold-outreach': return <ColdOutreachDemo />;
            default: return <p className="text-zinc-400 text-sm">This specialized engine is currently starting up. Docodo engineers are deploying this workspace.</p>;
        }
    };

    const handleRun = (tool: any) => {
        if (balance >= tool.credits) {
            setBalance(prev => prev - tool.credits);
            setActiveTool(tool.id);
        } else {
            alert('Insufficient credits! Please recharge your account.');
        }
    };

    return (
        <main className="relative min-h-screen bg-[#0F0F0F] text-white overflow-x-hidden selection:bg-emerald-500/30">
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
                                AI Marketplace v6.0
                            </span>
                            <span className="w-8 h-[1px] bg-white/10" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Emerald & Sapphire Engines</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85]"
                        >
                            AI Growth <br />
                            <span className="text-zinc-700">Market.</span>
                        </motion.h1>
                        <p className="text-zinc-500 text-xl leading-relaxed max-w-lg">
                            Live, credit-based access to Pune's top 2026 AI business automations. Run campaigns and chat simulators instantly.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl min-w-[320px]"
                    >
                        <div className="flex gap-4 items-center mb-8">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                <Zap size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Your Engine Fuel</div>
                                <div className="text-2xl font-black">{balance} Credits</div>
                            </div>
                        </div>
                        <Button 
                            className="w-full bg-white text-black font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl hover:bg-emerald-500 transition-all"
                            onClick={() => setBalance(prev => prev + 500)}
                        >
                            Recharge Packs (+500 Credits)
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
                                                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black text-emerald-400 uppercase tracking-widest rounded-lg">Trending</span>
                                            )}
                                        </div>
                                        <h3 className={tool.span === '2x2' ? "text-5xl font-black mb-4 tracking-tighter text-white" : "text-2xl font-black mb-2 tracking-tight text-white"}>
                                            {tool.name}
                                        </h3>
                                        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-6">{tool.desc}</p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-zinc-400">
                                                <Code size={12} /> {tool.repo}
                                            </div>
                                            {tool.stars && (
                                                <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400">
                                                    ★ {tool.stars}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                                        <div className="flex flex-col">
                                            <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Est. ROI</div>
                                            <div className="text-xs font-bold text-emerald-400">{tool.cash}</div>
                                        </div>
                                        <Button 
                                            onClick={() => handleRun(tool)}
                                            className="bg-white text-black font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl hover:bg-emerald-400 transition-all shrink-0"
                                        >
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
                    className="mt-32 p-16 bg-white/5 border border-white/10 backdrop-blur-md rounded-[4rem] text-white text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-sapphire-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">Need a Custom <br />Growth Agent?</h2>
                    <p className="text-xl text-zinc-400 max-w-xl mx-auto mb-12 font-medium">
                        We deploy custom database scraping bots, lead pipelines, and AI responders tailored to your specific local region in 7 days.
                    </p>
                    <div className="flex justify-center gap-6">
                        <Link href="/contact">
                            <Button className="bg-white text-black px-12 h-20 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
                                Request custom bot
                            </Button>
                        </Link>
                        <Button 
                            variant="outline" 
                            className="border-white/10 hover:border-emerald-500/30 text-white px-12 h-20 rounded-2xl text-sm font-black uppercase tracking-widest bg-white/5"
                        >
                            Enterprise Plans
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Modal for interactive tool running */}
            <Modal
                isOpen={activeTool !== null}
                onClose={() => setActiveTool(null)}
                title={getToolTitle(activeTool)}
            >
                {getToolComponent(activeTool)}
            </Modal>

            <Footer />
        </main>
    );
}
