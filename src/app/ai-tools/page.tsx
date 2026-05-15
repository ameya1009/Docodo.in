'use client';

import { AIToolsLayout } from '@/components/layout/AIToolsLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Mail, Users, Dumbbell, ArrowRight, Play, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const tools = [
    {
        id: 'email-automation',
        title: 'Email Composer',
        description: 'Transform bullet points into perfectly crafted emails in seconds. Select your tone and let agents handle the nuance.',
        icon: <Mail className="w-6 h-6" />,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        href: '/ai-tools/email-automation',
        status: 'Active',
        category: 'Communication',
        demoVideo: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-a-program-4161-large.mp4'
    },
    {
        id: 'patients-list',
        title: 'Patient Registry',
        description: 'Securely manage patient records, history, and prescriptions with AI assistance. Built for healthcare professionals.',
        icon: <Users className="w-6 h-6" />,
        color: 'text-sapphire-400',
        bgColor: 'bg-sapphire-500/10',
        href: '/ai-tools/patients-list',
        status: 'Active',
        category: 'Medical',
        demoVideo: 'https://assets.mixkit.co/videos/preview/mixkit-medical-researcher-analyzing-data-on-a-computer-4162-large.mp4'
    },
    {
        id: 'gym-management',
        title: 'FitFlow Manager',
        description: 'Automate gym memberships, track attendance, and manage growth. Streamline your facility operations.',
        icon: <Dumbbell className="w-6 h-6" />,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        href: '/ai-tools/gym-management',
        status: 'Active',
        category: 'Facility',
        demoVideo: 'https://assets.mixkit.co/videos/preview/mixkit-fitness-instructor-training-in-gym-4163-large.mp4'
    },
    {
        id: 'agentic-erp',
        title: 'Agentic ERP',
        description: 'Autonomous reasoning engine for Finance, Inventory, and CRM. The UI is secondary to execution.',
        icon: <Brain className="w-6 h-6" />,
        color: 'text-gold-400',
        bgColor: 'bg-yellow-500/10',
        href: '/ai-tools/agentic-erp',
        status: 'Beta',
        category: 'Enterprise',
        demoVideo: 'https://assets.mixkit.co/videos/preview/mixkit-financial-trader-looking-at-stock-market-numbers-4164-large.mp4'
    }
];

export default function AIToolsPage() {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    return (
        <AIToolsLayout title="AI Tools Hub">
            {/* Hero Section with 3D Video Background */}
            <div className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-16 mb-16 border border-white/10 shadow-2xl group flex flex-col items-center text-center">
                <div className="absolute inset-0 z-0">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 transition-opacity group-hover:opacity-40">
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-hologram-of-a-planet-in-a-dark-room-4165-large.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
                </div>
                
                <div className="relative z-10 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 mx-auto mb-8 relative"
                    >
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                        <Brain className="w-full h-full text-emerald-400" />
                    </motion.div>

                    <motion.h1
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Deployed.</span>
                    </motion.h1>
                    <motion.p
                        className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Explore our suite of autonomous agents. Test them live, watch the demos, and integrate them into your business with zero code.
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-emerald-400 transition-colors">
                            Explore All Agents
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="mb-12 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-emerald-400" size={24} />
                    Featured Workflows
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
                {tools.map((tool, i) => (
                    <motion.div
                        key={tool.id}
                        className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.08] transition-all group relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full -z-10" />

                        <div className="flex justify-between items-start mb-8">
                            <div className={`p-4 rounded-2xl ${tool.bgColor}`}>
                                {tool.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full text-zinc-300">
                                {tool.category}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">{tool.title}</h3>
                        <p className="text-zinc-400 text-sm mb-8 line-clamp-2 min-h-[40px]">
                            {tool.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button 
                                onClick={() => setActiveVideo(tool.demoVideo)}
                                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl transition-colors"
                            >
                                <Play size={16} /> Live Demo
                            </button>
                            <Link href={tool.href} className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium text-sm rounded-xl transition-colors border border-emerald-500/20">
                                Try Free <ExternalLink size={16} />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setActiveVideo(null)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl bg-[#0F0F0F] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <button 
                                    onClick={() => setActiveVideo(null)}
                                    className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="aspect-video w-full bg-black">
                                <video 
                                    src={activeVideo} 
                                    autoPlay 
                                    loop 
                                    controls 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AIToolsLayout>
    );
}
