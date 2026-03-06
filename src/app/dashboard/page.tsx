'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Zap, ShoppingCart, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCredits } from '@/hooks/useCredits';

const tools = [
    { id: 'zapier', title: 'Zapier Agents', cost: 10, category: 'Automation', icon: <Zap className="text-cyan-400" /> },
    { id: 'gumloop', title: 'Gumloop Flows', cost: 15, category: 'Agentic', icon: <Sparkles className="text-purple-400" /> },
    { id: 'botpress', title: 'Botpress WhatsApp', cost: 8, category: 'Bots', icon: <CreditCard className="text-emerald-400" /> },
    { id: 'canva', title: 'Canva AI Visuals', cost: 3, category: 'Design', icon: <ShoppingCart className="text-amber-400" /> },
];

export default function DashboardPage() {
    const { credits, updateCredits } = useCredits();
    const [loadingTool, setLoadingTool] = useState<string | null>(null);
    const [recharging, setRecharging] = useState(false);

    const handleRunTool = async (tool: typeof tools[0]) => {
        if (credits < tool.cost) {
            alert('Insufficient credits! Please recharge.');
            return;
        }

        setLoadingTool(tool.id);
        try {
            const res = await fetch('/api/run-tool', {
                method: 'POST',
                body: JSON.stringify({ toolId: tool.id, credits: tool.cost }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                updateCredits(-tool.cost);
                alert(data.result);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingTool(null);
        }
    };

    const handleRecharge = async () => {
        setRecharging(true);
        try {
            const res = await fetch('/api/recharge', {
                method: 'POST',
                body: JSON.stringify({ packId: 'pro', amount: 3999 }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                // Mocking successful payment
                setTimeout(() => {
                    updateCredits(500);
                    alert(`Success! 500 Credits added. Order: ${data.orderId}`);
                    setRecharging(false);
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            setRecharging(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 p-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-500 mb-2">Docodo Growth OS</h1>
                    <p className="text-zinc-400">Welcome to your AI Marketplace, Ameya. Pune business scaling made easy.</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-2xl flex items-center gap-6">
                    <div>
                        <p className="text-[10px] text-cyan-300 uppercase font-bold mb-1">Total Balance</p>
                        <p className="text-2xl font-black text-white">{credits} <span className="text-xs font-medium text-cyan-400">Credits</span></p>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        className="bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                        onClick={handleRecharge}
                        disabled={recharging}
                    >
                        {recharging ? <Loader2 className="animate-spin" size={16} /> : 'Get Credits'}
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    AI Marketplace
                    <span className="text-xs font-medium px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">Trending 2026</span>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tools.map((tool) => (
                        <div key={tool.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl group hover:border-cyan-500/30 transition-all hover:bg-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-cyan-500/10 transition-colors uppercase text-[10px] font-bold">
                                    {tool.icon}
                                </div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tool.category}</span>
                            </div>
                            <h3 className="font-bold text-white mb-1">{tool.title}</h3>
                            <p className="text-xs text-zinc-400 mb-4">{tool.cost} Credits per run</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-[10px] py-1"
                                onClick={() => handleRunTool(tool)}
                                disabled={loadingTool === tool.id}
                            >
                                {loadingTool === tool.id ? <Loader2 className="animate-spin" size={12} /> : 'Run Tool'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-6">Recent Usage</h2>
                <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/5">
                    {[
                        { name: 'Zapier Agent Lead Sync', cost: -10, date: 'Oct 24, 2026' },
                        { name: 'Botpress Appointment Bot', cost: -8, date: 'Oct 22, 2026' }
                    ].map((item, i) => (
                        <div key={i} className="p-6 flex justify-between items-center group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-[10px]">AI</div>
                                <div>
                                    <p className="font-medium text-zinc-200">{item.name}</p>
                                    <p className="text-xs text-zinc-500">{item.cost} Credits • {item.date}</p>
                                </div>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase">Success</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
