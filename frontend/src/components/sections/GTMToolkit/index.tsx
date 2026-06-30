'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download, ShieldCheck, X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const resources = [
    {
        title: "Zapier Agents",
        description: "Automate leads from your site directly to your CRM or WhatsApp group. Pure magic.",
        tag: "10 Credits/Run",
        icon: <ArrowRight className="w-5 h-5" />,
        color: "from-violet-500 to-indigo-500",
        shadow: "shadow-violet-500/20"
    },
    {
        title: "Botpress WhatsApp",
        description: "Deploy a Hinglish-speaking bot in 5 mins. 'Namaskar! Business growth?' is the vibe.",
        tag: "15 Credits/Flow",
        icon: <ShieldCheck className="w-5 h-5" />,
        color: "from-mint-400 to-emerald-600",
        shadow: "shadow-mint-500/20"
    },
    {
        title: "Canva AI Banners",
        description: "Auto-generate posters for your Baner salon or Viman Nagar cafe in seconds.",
        tag: "5 Credits/Asset",
        icon: <Download className="w-5 h-5" />,
        color: "from-amber-400 to-orange-500",
        shadow: "shadow-amber-500/20"
    }
];

function ResourceModal({ resource, onClose }: { resource: typeof resources[0], onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        // Mock API call to simulate realistic interaction
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-md bg-[#0E0C15] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${resource.color}`} />
                
                <button 
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    onClick={onClose}
                >
                    <X size={16} />
                </button>

                {status === 'success' ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6"
                    >
                        <div className="w-20 h-20 mx-auto bg-mint-500/10 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={40} className="text-mint-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Access Granted</h3>
                        <p className="text-zinc-400 text-sm mb-8">
                            We've sent the {resource.title} module to your workspace. Check your dashboard.
                        </p>
                        <Button className="w-full bg-white/5 hover:bg-white/10 text-white" onClick={onClose}>
                            Close
                        </Button>
                    </motion.div>
                ) : (
                    <>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center text-white mb-6 shadow-lg ${resource.shadow}`}>
                            {resource.icon}
                        </div>
                        <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-4">
                            {resource.tag}
                        </span>
                        <h3 className="text-2xl font-black text-white mb-2">Deploy {resource.title}</h3>
                        <p className="text-zinc-400 text-sm mb-8">
                            Enter your workspace email to activate this AI agent. Zero coding required.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    required
                                    placeholder="founder@startup.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                                />
                            </div>
                            <Button type="submit" disabled={status === 'submitting'} className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl flex items-center justify-center">
                                {status === 'submitting' ? <Loader2 className="animate-spin text-black" size={20} /> : 'Activate Agent'}
                            </Button>
                        </form>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}

export function GTMToolkit() {
    const [selectedResource, setSelectedResource] = useState<typeof resources[0] | null>(null);

    return (
        <section className="section relative bg-[#07060A]">
            <div className="container relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-500/10 border border-mint-500/20 text-mint-400 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <Sparkles size={12} className="animate-pulse" />
                        AI Marketplace
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
                    >
                        Trending 2026 <span className="text-gradient">AI Tools</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 text-lg"
                    >
                        Deploy ready-to-use agentic workflows directly to your stack. All included in your Docodo OS.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative bg-[#0E0C15] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 transition-all duration-300"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${resource.color} opacity-0 group-hover:opacity-5 rounded-[2rem] transition-opacity duration-500 pointer-events-none`} />
                            
                            <div className="flex items-center justify-between mb-8">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center text-white shadow-lg ${resource.shadow} group-hover:scale-110 transition-transform duration-500`}>
                                    {resource.icon}
                                </div>
                                <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                    {resource.tag}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-3">{resource.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                                {resource.description}
                            </p>
                            
                            <button
                                onClick={() => setSelectedResource(resource)}
                                className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider group/btn"
                            >
                                Deploy Agent
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-colors">
                                    <ArrowRight size={12} />
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border border-violet-500/20 p-10 md:p-14 text-center"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-3xl font-black text-white mb-4">Get 50 Free Credits on Signup</h3>
                        <p className="text-violet-200 mb-8">Experience the magic of AI-powered growth today. Zero commitment.</p>
                        <Button 
                            className="bg-white text-black hover:bg-zinc-200 font-black px-8 h-14 rounded-xl text-sm tracking-wider shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            Claim Free Credits Now
                        </Button>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedResource && (
                    <ResourceModal
                        resource={selectedResource}
                        onClose={() => setSelectedResource(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
