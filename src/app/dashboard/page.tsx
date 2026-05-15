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
        if (credits === null || credits < tool.cost) {
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
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">Global OS v5.0</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Live Engine</span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white mb-4">Growth <br /><span className="text-zinc-700">Analytics.</span></h1>
                    <p className="text-zinc-500 font-medium max-w-md leading-relaxed">Scaling your global SMB ecosystem. Your AI automations are currently projecting <span className="text-white">$1,240 ROI</span> this month.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl min-w-[240px]">
                        <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-4">Global Credits</p>
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-4xl font-black text-white">{credits}</span>
                            <span className="text-xs font-black text-cyan-400 mb-1.5">FUEL</span>
                        </div>
                        <Button
                            variant="primary"
                            className="w-full bg-white text-black font-black uppercase text-[10px] tracking-widest h-12 rounded-2xl hover:bg-cyan-500"
                            onClick={handleRecharge}
                            disabled={recharging}
                        >
                            {recharging ? <Loader2 className="animate-spin" size={16} /> : 'Recharge +30%'}
                        </Button>
                    </div>

                    <div className="bg-cyan-500 border border-cyan-400 p-8 rounded-[2.5rem] min-w-[240px]">
                        <p className="text-[10px] text-black/60 uppercase font-black tracking-[0.2em] mb-4">Projected ROI</p>
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-4xl font-black text-black">$1,240</span>
                            <span className="text-xs font-black text-black/60 mb-1.5">/MO</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-black uppercase tracking-widest">
                            <ArrowUpRight size={14} /> +24% vs Last Month
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-12 border-t border-white/5">
                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3 tracking-tight">
                    Quick Market <span className="text-zinc-700">Tools</span>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool) => (
                        <div key={tool.id} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] group hover:border-cyan-500/30 transition-all hover:bg-white/10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-cyan-500/10 transition-colors">
                                    {tool.icon}
                                </div>
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{tool.category}</span>
                            </div>
                            <h3 className="font-black text-white mb-1 tracking-tight">{tool.title}</h3>
                            <p className="text-[10px] font-bold text-zinc-500 mb-6">{tool.cost} Credits Per Run</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-[9px] font-black uppercase tracking-widest h-10 rounded-xl"
                                onClick={() => handleRunTool(tool)}
                                disabled={loadingTool === tool.id}
                            >
                                {loadingTool === tool.id ? <Loader2 className="animate-spin" size={12} /> : 'Launch Engine'}
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
