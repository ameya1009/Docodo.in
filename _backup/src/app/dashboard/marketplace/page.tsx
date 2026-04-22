'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Search, Layout, MessageSquare, Briefcase, Play, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { docodoTools } from '@/lib/docodo-tools';
import { CreditRechargeModal } from '@/components/dashboard/CreditRechargeModal';

const tools = [
    {
        id: 'growth-audit',
        name: 'Growth Audit Pro',
        category: 'Marketing',
        description: 'Instant SEO & GTM audit for Pune SMBs. Finds ₹20k-50k/mo revenue gaps.',
        credits: 10,
        icon: <Search className="text-cyan-400" />,
        type: 'docodo'
    },
    {
        id: 'zapier-agents',
        name: 'Zapier Agents',
        category: 'Automations',
        description: 'Auto-reply to WhatsApp leads & sync to CRM. Saves 10+ hours/week.',
        credits: 50,
        icon: <Zap className="text-amber-400" />,
        type: 'external'
    },
    {
        id: 'botpress-booking',
        name: 'Booking Bot',
        category: 'Automations',
        description: 'AI chatbot for salons & clinics that qualifies leads & books appointments.',
        credits: 20,
        icon: <MessageSquare className="text-purple-400" />,
        type: 'external'
    },
    {
        id: 'viral-hooks',
        name: 'Viral Hook Gen',
        category: 'Marketing',
        description: 'Generate Hinglish social media hooks that get 10x more engagement in Pune.',
        credits: 5,
        icon: <Layout className="text-pink-400" />,
        type: 'docodo'
    }
];

export default function MarketplacePage() {
    const [credits, setCredits] = useState(50);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Websites', 'Marketing', 'Automations'];

    const filteredTools = selectedCategory === 'All'
        ? tools
        : tools.filter(t => t.category === selectedCategory);

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="max-w-7xl mx-auto space-y-10 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">AI Tools Marketplace</h1>
                    <p className="text-zinc-400">Integrated growth power-ups for your business.</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-6 shadow-2xl">
                    <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Available Credits</p>
                        <p className="text-2xl font-bold text-cyan-400">{credits}</p>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        className="bg-cyan-500 text-black font-bold"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Buy Credits
                    </Button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTools.map((tool) => (
                    <motion.div
                        key={tool.id}
                        whileHover={{ y: -5 }}
                        className="bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 flex flex-col h-full group hover:border-cyan-500/50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors">
                                {tool.icon}
                            </div>
                            <span className="text-xs font-bold text-zinc-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-tighter">
                                {tool.credits} Credits
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                        <p className="text-zinc-400 text-sm mb-8 leading-relaxed flex-grow">
                            {tool.description}
                        </p>

                        <div className="flex gap-3">
                            <Button
                                variant="primary"
                                className="flex-grow gap-2 font-bold"
                                onClick={async () => {
                                    if (credits >= tool.credits) {
                                        setCredits(credits - tool.credits);
                                        // Specific Tool Logic
                                        if (tool.id === 'growth-audit') {
                                            const result = await docodoTools['growth-audit-pro'].execute({ url: 'yoursite.com' });
                                            alert(`Audit Complete! SEO: ${result.seoScore}, GTM: ${result.gtmScore}. Check your email for full report.`);
                                        } else if (tool.id === 'viral-hooks') {
                                            const result = await docodoTools['viral-hooks'].execute({ businessType: 'Clinic', goal: 'Leads' });
                                            alert(`Hooks Generated: \n1. ${result[0]}\n2. ${result[1]}`);
                                        } else {
                                            alert(`Running ${tool.name}... simulation successful.`);
                                        }
                                    } else {
                                        alert('Not enough credits! Please recharge via Razorpay.');
                                    }
                                }}
                            >
                                <Play size={16} fill="currentColor" /> Run Tool
                            </Button>
                            <Button variant="outline" className="p-3">
                                <Info size={20} />
                            </Button>
                        </div>

                        {tool.type === 'docodo' && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Docodo Original</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Featured Promo */}
            <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/20 rounded-3xl p-10 flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-grow text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-white mb-4">Want a Custom AI Tool?</h2>
                    <p className="text-zinc-400 max-w-xl">We build custom bots and automations tailored to your specific Pune business needs. WhatsApp bots, CRM sync, and more.</p>
                </div>
                <Button variant="primary" size="lg" className="px-10 py-6 text-lg font-bold">Book AI Consultation</Button>
            </div>
            <CreditRechargeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(amount) => {
                    setCredits(credits + amount);
                    alert(`Successfully recharged ${amount} credits!`);
                }}
            />
        </div>
    );
}
