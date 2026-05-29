'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, History, Zap, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CreditRechargeModal } from '@/components/dashboard/CreditRechargeModal';

export default function CreditsPage() {
    const [credits, setCredits] = useState(50);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const history = [
        { id: 1, activity: 'Recharge Starter Pack', date: 'Mar 06, 2026', amount: '+100', type: 'positive' },
        { id: 2, activity: 'Viral Hook Gen Run', date: 'Mar 05, 2026', amount: '-5', type: 'negative' },
        { id: 3, activity: 'Free Signup Bonus', date: 'Mar 01, 2026', amount: '+50', type: 'positive' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 p-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Credit Dashboard</h1>
                    <p className="text-zinc-400">Manage your Growth OS fuel and tool usage.</p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    className="gap-2 font-bold px-8"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Zap size={18} fill="currentColor" /> Recharge Now
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-4">Available Credits</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold text-cyan-400">{credits}</span>
                        <span className="text-zinc-600 font-bold">PTS</span>
                    </div>
                </div>
                <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-4">Total ROI Generated</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold text-emerald-400">₹12k</span>
                        <span className="text-zinc-600 font-bold">EST</span>
                    </div>
                </div>
                <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-4">Tool Performance</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold text-purple-400">92%</span>
                        <span className="text-zinc-600 font-bold">ACC</span>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/20 border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History className="text-zinc-500" />
                        <h2 className="text-xl font-bold text-white">Usage History</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="text-zinc-500">View All</Button>
                </div>
                <div className="divide-y divide-white/5">
                    {history.map(item => (
                        <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'positive' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {item.type === 'positive' ? <ArrowUpRight size={20} /> : <Zap size={18} />}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{item.activity}</p>
                                    <p className="text-zinc-500 text-xs">{item.date}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${item.type === 'positive' ? 'text-emerald-400' : 'text-zinc-400'
                                }`}>
                                {item.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <CreditRechargeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(amount) => setCredits(credits + amount)}
            />
        </div>
    );
}
