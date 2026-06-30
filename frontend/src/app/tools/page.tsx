'use client';

import { BentoCard } from '@/components/ui/BentoCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Brain, Zap, Search, MessageSquare, Share2, TrendingUp, BarChart3, Database, Globe, Layers, ShieldCheck, PlayCircle, Settings, Users, ArrowRight, Video, FileText, Code, Sparkles } from 'lucide-react';
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
        icon: <MessageSquare className="text-[var(--mint)]" />,
        desc: 'Interactive chat agent that books, pre-qualifies, and speaks local Hinglish. 300% booking lift in Kothrud.',
        repo: 'docodo/whatsapp-agent',
        stars: '1.2k',
        credits: 8,
        cash: '₹15,000/mo booking lift',
        trending: true,
        span: '2x2',
        theme: 'mint'
    },
    {
        id: 'ecg-content',
        name: 'ECG Content Generator',
        icon: <FileText className="text-[var(--indigo)]" />,
        desc: 'Generates Evergreen (50%), Controversial (30%), and Growth (20%) social copies. Stop staring at blank screens.',
        repo: 'docodo/ecg-copywriter',
        stars: '850',
        credits: 10,
        cash: 'Save 20 hrs/week',
        span: '1x1',
        theme: 'indigo'
    },
    {
        id: 'seo-schema',
        name: 'SEO Graph Generator',
        icon: <Search className="text-[var(--violet)]" />,
        desc: 'Valid Google JSON-LD schema builder with custom local business coordinates. Rank higher than the guy next door.',
        repo: 'docodo/seo-schema-gen',
        stars: '420',
        credits: 5,
        cash: 'Top Local Search visibility',
        span: '1x1',
        theme: 'violet'
    },
    {
        id: 'cold-outreach',
        name: 'AIDA Outreach Copywriter',
        icon: <Zap className="text-[var(--mint)]" />,
        desc: 'Personalized cold email & WhatsApp campaigns matching local prospect persona. Get replies, not blocks.',
        repo: 'docodo/cold-outreach-agent',
        credits: 12,
        cash: '₹25,000 passive pipeline',
        span: '1x2',
        theme: 'mint'
    },
    {
        id: 'zapier-agents',
        name: 'Zapier Automation Agent',
        icon: <Layers className="text-[var(--text-secondary)]" />,
        desc: 'Sync salon calendars with sheets & billing. Because you shouldn\'t be doing data entry at 11 PM.',
        repo: 'awesome-ai-tools',
        credits: 15,
        cash: '10 hrs/week admin saved',
        span: '1x1',
        theme: 'neutral'
    },
    {
        id: 'video-maker',
        name: 'AI Video Maker (Soon)',
        icon: <Video className="text-[var(--text-secondary)] opacity-60" />,
        desc: 'Generate viral promo reels from raw scripts. Coming soon. We\'re still teaching it to add the right sigma male music.',
        repo: 'hpcaitech/Open-Sora',
        credits: 20,
        cash: '$600/mo social traffic gen',
        span: '2x1',
        theme: 'neutral'
    }
];

export default function MarketplacePage() {
    const [balance, setBalance] = useState(1240);
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const getToolTitle = (id: string | null) => {
        switch (id) {
            case 'whatsapp-bot': return 'WhatsApp Hinglish Booking Simulator';
            case 'ecg-content': return 'ECG Content Generator';
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
            default: return <p className="text-[var(--text-secondary)] text-sm">This specialized engine is currently starting up. Docodo engineers are deploying this workspace.</p>;
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
        <main className="relative min-h-screen bg-[var(--color-bg)] text-white overflow-x-hidden selection:bg-[var(--mint)]/30">
            {/* 3D Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    transformOrigin: 'top center',
                }}
            />
            
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[var(--violet)] rounded-full blur-[150px] opacity-[0.15] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--mint)] rounded-full blur-[120px] opacity-[0.1] mix-blend-screen pointer-events-none" />

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 relative z-10">
                <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap items-center gap-3 mb-8"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-[var(--color-border)] text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                <Sparkles size={14} /> AI Marketplace v6.0
                            </span>
                            <span className="hidden sm:block w-8 h-[1px] bg-white/10" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--violet)]">Midnight Aurora Engines</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85]"
                        >
                            AI Growth <br />
                            <span className="text-gradient">Market.</span>
                        </motion.h1>
                        <p className="text-[var(--text-secondary)] text-xl leading-relaxed max-w-lg">
                            Live, credit-based access to Pune's finest 2026 AI business automations. Run campaigns and chat simulators instantly.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 glass-bright rounded-[3rem] border border-[var(--color-border-bright)] min-w-[320px] card-3d-wrap"
                    >
                        <div className="card-3d">
                            <div className="flex gap-4 items-center mb-8">
                                <div className="w-12 h-12 bg-[var(--mint-glow)] rounded-full flex items-center justify-center border border-[var(--mint)]">
                                    <Zap size={20} className="text-[var(--mint)]" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Your Engine Fuel</div>
                                    <div className="text-2xl font-black">{balance} Credits</div>
                                </div>
                            </div>
                            <Button 
                                className="w-full bg-white text-black font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl hover:bg-[var(--mint)] hover:scale-[1.02] transition-all shadow-[0_5px_20px_rgba(255,255,255,0.1)]"
                                onClick={() => setBalance(prev => prev + 500)}
                            >
                                Recharge Packs (+500 Credits)
                            </Button>
                        </div>
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
                                            <div className="w-14 h-14 glass-bright rounded-2xl flex items-center justify-center border border-[var(--color-border-bright)] group-hover:scale-110 transition-transform shadow-lg">
                                                {tool.icon}
                                            </div>
                                            {tool.trending && (
                                                <span className="px-3 py-1 bg-[var(--mint-glow)] border border-[var(--mint)] text-[9px] font-black text-[var(--mint)] uppercase tracking-widest rounded-lg">Trending</span>
                                            )}
                                        </div>
                                        <h3 className={tool.span === '2x2' ? "text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white" : "text-2xl font-black mb-2 tracking-tight text-white"}>
                                            {tool.name}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm mb-6">{tool.desc}</p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl text-[10px] font-bold text-[var(--text-muted)] border border-[var(--color-border)]">
                                                <Code size={12} /> {tool.repo}
                                            </div>
                                            {tool.stars && (
                                                <div className="px-3 py-1.5 bg-[var(--mint-glow)] border border-[var(--mint)]/30 rounded-xl text-[10px] font-black text-[var(--mint)]">
                                                    ★ {tool.stars}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between gap-4">
                                        <div className="flex flex-col">
                                            <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Est. ROI</div>
                                            <div className={`text-xs font-bold ${tool.theme === 'mint' ? 'text-[var(--mint)]' : tool.theme === 'violet' ? 'text-[var(--violet)]' : tool.theme === 'indigo' ? 'text-[var(--indigo)]' : 'text-white'}`}>
                                                {tool.cash}
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={() => handleRun(tool)}
                                            className="bg-[var(--color-bg-2)] border border-[var(--color-border-bright)] hover:bg-[var(--mint)] hover:text-black hover:border-[var(--mint)] text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl transition-all shrink-0 group-hover:shadow-[0_0_20px_var(--mint-glow)]"
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
                    className="mt-32 p-8 md:p-16 glass border border-[var(--color-border)] rounded-[3rem] md:rounded-[4rem] text-white text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--mint-glow)] via-transparent to-[var(--violet-glow)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none relative z-10">Need a Custom <br />Growth Agent?</h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-xl mx-auto mb-12 font-medium relative z-10">
                        We deploy custom database scraping bots, lead pipelines, and AI responders tailored to your specific local region in 7 days.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button className="w-full bg-[var(--mint)] text-black px-12 h-20 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[var(--mint)]/90 hover:scale-105 transition-all shadow-[0_0_30px_var(--mint-glow)]">
                                Request custom bot
                            </Button>
                        </Link>
                        <Link href="/pricing" className="w-full sm:w-auto">
                            <Button 
                                variant="outline" 
                                className="w-full border-white/10 hover:border-white/30 text-white px-12 h-20 rounded-2xl text-sm font-black uppercase tracking-widest bg-white/5"
                            >
                                Enterprise Plans
                            </Button>
                        </Link>
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
