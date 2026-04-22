'use client';

import { useState, useEffect } from 'react';
import { AIToolsLayout } from '@/components/layout/AIToolsLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Terminal,
    Activity,
    TrendingUp,
    Box,
    ShieldCheck,
    Zap,
    ArrowRight,
    Search,
    RefreshCw,
    CheckCircle2,
    BarChart3,
    Layers,
    ShoppingCart,
    Wallet,
    Users as UsersIcon,
    ArrowUpRight,
    ChevronDown,
    Command,
    Sparkles,
    Globe,
    Lock,
    Cpu,
    PieChart,
    ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
    id: number;
    agent: string;
    message: string;
    time: string;
}

const MOCK_INVENTORY = [
    { sku: 'CHIP-A1-X', stock: 45, status: 'Low', leadTime: '12d', price: '$8.40' },
    { sku: 'MEM-DDR5-8', stock: 120, status: 'Healthy', leadTime: '4d', price: '$42.10' },
    { sku: 'GPU-RTX-4', stock: 12, status: 'Critical', leadTime: '21d', price: '$890.00' },
    { sku: 'SSD-1TB-NV', stock: 85, status: 'Healthy', leadTime: '5d', price: '$75.50' }
];

const MOCK_FINANCE = [
    { entity: 'SAP Sync Hub', status: 'Active', value: '$1.2M', delta: '+4.2%', type: 'OData' },
    { entity: 'Odoo Reconciler', status: 'Syncing', value: '$45k', delta: '-1.1%', type: 'REST' },
    { entity: 'Tax Arbitrage', status: 'Optimized', value: '$210k', delta: '+12.4%', type: 'Agentic' },
    { entity: 'Shadow Books', status: 'Secured', value: '--', delta: '0.0%', type: 'Private' }
];

const MOCK_CRM = [
    { lead: 'Acme Corp', status: 'High Intent', score: 92, agent: 'SDR-1' },
    { lead: 'Globex Inc', status: 'Nurturing', score: 64, agent: 'SDR-Alpha' },
    { lead: 'Stark Ind', status: 'Closed', score: 100, agent: 'Closer-Bot' }
];

export default function AgenticERPPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [query, setQuery] = useState('');
    const [oracleResponse, setOracleResponse] = useState<string | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'finance' | 'crm'>('overview');
    const [isLive, setIsLive] = useState(true);

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks');
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (e) {
            console.error('Failed to fetch tasks:', e);
        }
    };

    const runOracle = async () => {
        if (!query) return;
        setIsThinking(true);
        setOracleResponse(null);
        try {
            const res = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: query })
            });
            const data = await res.json();
            setOracleResponse(data.result);
        } catch (e) {
            setOracleResponse('Oracle connection error. Ensure backend is running.');
        } finally {
            setIsThinking(false);
        }
    };

    const triggerInventoryAgent = async () => {
        try {
            await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'low_stock', payload: { sku: 'CHIP-A1-X' } })
            });
            setTimeout(fetchTasks, 1000);
        } catch (e) {
            alert('Agent trigger failed.');
        }
    };

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AIToolsLayout title="Agentic ERP">
            <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
                {/* Premium Enterprise Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 py-6 border-b border-zinc-800/30">
                    <div className="flex items-center gap-6">
                        <motion.div
                            className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-cyan-400 to-cyan-600 p-[1px]"
                            initial={{ rotate: -10, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                        >
                            <div className="w-full h-full rounded-[1.5rem] bg-black flex items-center justify-center text-cyan-400">
                                <Brain size={32} />
                            </div>
                        </motion.div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-black tracking-tighter text-white">Reasoning Engine</h1>
                                <span className="bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded">v4.0.2 Ent</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                    <Globe size={12} className="text-cyan-500" /> Global Instance: US-EAST-1
                                </span>
                                <span className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                    <Lock size={12} className="text-purple-500" /> End-to-End Neural Encryption
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden xl:flex items-center gap-8 mr-6">
                            <div className="text-right">
                                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Neural Load</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-cyan-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: '42%' }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-zinc-400">42%</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Success Value</p>
                                <p className="text-sm font-bold text-white tracking-tight">$82,410.00</p>
                            </div>
                        </div>
                        <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-white" onClick={fetchTasks}>
                            <RefreshCw size={16} />
                        </Button>
                        <Button className="rounded-xl bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest px-6 h-11 hover:bg-cyan-400 shadow-2xl shadow-cyan-500/20" onClick={triggerInventoryAgent}>
                            <Zap size={16} className="mr-2" /> Emit Signal
                        </Button>
                    </div>
                </div>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Navigation Sidebar (Vertical Tabs) */}
                    <div className="lg:col-span-1 hidden lg:flex flex-col gap-2">
                        {(['overview', 'inventory', 'finance', 'crm'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "w-full aspect-square rounded-3xl flex flex-col items-center justify-center gap-2 transition-all border",
                                    activeTab === tab
                                        ? "bg-zinc-800 border-zinc-700 text-white shadow-xl"
                                        : "bg-transparent border-transparent text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/20"
                                )}
                            >
                                {tab === 'overview' && <Layers size={20} />}
                                {tab === 'inventory' && <Box size={20} />}
                                {tab === 'finance' && <Wallet size={20} />}
                                {tab === 'crm' && <UsersIcon size={20} />}
                                <span className="text-[9px] font-black uppercase tracking-tighter">{tab}</span>
                            </button>
                        ))}
                    </div>

                    {/* Central Module View */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* High-Impact Stat Bento */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="p-8 bg-zinc-900/40 border-zinc-800/50 backdrop-blur-2xl rounded-[2.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Cpu size={80} />
                                </div>
                                <Activity size={18} className="text-cyan-500 mb-6" />
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Compute Arbitrage</p>
                                <h3 className="text-4xl font-bold text-white tracking-tighter">0.0012<span className="text-zinc-600 text-xl font-normal">s</span></h3>
                                <p className="text-[10px] text-green-500 font-bold mt-3 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Verification Level: 100%
                                </p>
                            </Card>

                            <Card className="p-8 bg-zinc-900/40 border-zinc-800/50 backdrop-blur-2xl rounded-[2.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <PieChart size={80} />
                                </div>
                                <BarChart3 size={18} className="text-purple-500 mb-6" />
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">EBITDA Efficiency</p>
                                <h3 className="text-4xl font-bold text-white tracking-tighter">+12.4%</h3>
                                <p className="text-[10px] text-purple-500 font-bold mt-3">Autonomous Optimization</p>
                            </Card>

                            <Card className="p-8 bg-white rounded-[2.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <ShoppingCart size={80} />
                                </div>
                                <Zap size={18} className="text-black mb-6" />
                                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">Agent Drift</p>
                                <h3 className="text-4xl font-bold text-black tracking-tighter">None</h3>
                                <p className="text-[10px] font-bold mt-3 text-black/60 underline cursor-pointer">View Reconciliation</p>
                            </Card>
                        </div>

                        {/* Enterprise Data Matrix (SAP/Zoho style density) */}
                        <Card className="bg-zinc-900/40 border-zinc-800/20 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-zinc-800/50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                                        {activeTab === 'inventory' ? <Box size={20} className="text-cyan-400" /> : activeTab === 'finance' ? <Wallet size={20} className="text-purple-400" /> : <Layers size={20} className="text-zinc-400" />}
                                        {activeTab === 'overview' ? 'Neural Matrix Overview' : `${activeTab.toUpperCase()} LEDGER`}
                                    </h3>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Real-time sync enabled • 12 agents active</p>
                                </div>
                                <div className="flex bg-zinc-800 p-1 rounded-xl">
                                    <button className="px-3 py-1.5 rounded-lg bg-zinc-700 text-[9px] font-black text-white uppercase">Table</button>
                                    <button className="px-3 py-1.5 rounded-lg text-[9px] font-black text-zinc-500 uppercase hover:text-white transition-colors">Visual</button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-800/30">
                                            <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-800/50">Subject</th>
                                            <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-800/50">Locus/State</th>
                                            <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-800/50">Capacity</th>
                                            <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-800/50 text-right">Utility</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/20">
                                        {activeTab === 'finance' ? MOCK_FINANCE.map((f, i) => (
                                            <tr key={i} className="hover:bg-zinc-800/30 group transition-all">
                                                <td className="p-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors font-mono">{f.entity}</span>
                                                        <span className="text-[9px] text-zinc-600 font-bold uppercase mt-0.5">{f.type} Protocol</span>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className={cn(
                                                        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                        f.status === 'Active' ? "bg-green-500/5 text-green-500 border-green-500/20" :
                                                            "bg-purple-500/5 text-purple-500 border-purple-500/20"
                                                    )}>
                                                        {f.status}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-bold text-zinc-300 font-mono">{f.value}</span>
                                                        <span className={cn("text-[10px] font-bold flex items-center", f.delta.startsWith('+') ? 'text-green-500' : 'text-red-500')}>
                                                            {f.delta.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                                            {f.delta}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all opacity-0 group-hover:opacity-100 mx-auto mr-0">
                                                        <ArrowRight size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : activeTab === 'crm' ? MOCK_CRM.map((c, i) => (
                                            <tr key={i} className="hover:bg-zinc-800/30 group transition-all">
                                                <td className="p-5">
                                                    <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{c.lead}</span>
                                                </td>
                                                <td className="p-5">
                                                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest border border-zinc-700">
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-cyan-500" style={{ width: `${c.score}%` }} />
                                                        </div>
                                                        <span className="text-xs font-mono text-cyan-400">{c.score}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right font-mono text-[10px] text-zinc-600 font-bold">{c.agent}</td>
                                            </tr>
                                        )) : MOCK_INVENTORY.map((inv, i) => (
                                            <tr key={i} className="hover:bg-zinc-800/30 group transition-all">
                                                <td className="p-5 font-mono text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{inv.sku}</td>
                                                <td className="p-5">
                                                    <span className={cn(
                                                        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                        inv.status === 'Healthy' ? "bg-green-500/5 text-green-500 border-green-500/20" :
                                                            inv.status === 'Low' ? "bg-yellow-500/5 text-yellow-500 border-yellow-500/20" :
                                                                "bg-red-500/5 text-red-500 border-red-500/20"
                                                    )}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-zinc-300">{inv.stock} Units</span>
                                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Target: {inv.price}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-white transition-colors" onClick={triggerInventoryAgent}>Procure</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Right Hand: The Oracle & Activity */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Oracle Command Center */}
                        <div className="p-8 bg-zinc-900 border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-5">
                                <Command size={200} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black shadow-lg shadow-cyan-500/20">
                                        <Sparkles size={18} />
                                    </div>
                                    <h3 className="text-xl font-black text-white tracking-tighter">Oracle AI</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && runOracle()}
                                            placeholder="Ask anything..."
                                            className="w-full bg-black border border-zinc-800 rounded-[1.5rem] pl-12 pr-4 py-5 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-zinc-800 font-bold"
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {oracleResponse && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-[1.5rem]"
                                            >
                                                <div className="text-[8px] text-cyan-500/60 font-black uppercase tracking-[0.4rem] mb-4">Neural Output</div>
                                                <p className="font-mono text-[13px] text-cyan-50 leading-relaxed font-medium">{oracleResponse}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Button
                                        className="w-full rounded-[1.5rem] h-14 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] hover:bg-zinc-100 hover:scale-[1.02] transition-all shadow-xl"
                                        onClick={runOracle}
                                        disabled={isThinking || !query}
                                    >
                                        {isThinking ? 'Consulting Core...' : 'Query Hub'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* High-Density Logs */}
                        <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-3xl rounded-[3rem] p-8 max-h-[600px] flex flex-col shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Neural Logs</h2>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 rounded-full bg-cyan-500 animate-ping" />
                                    <div className="w-1 h-1 rounded-full bg-cyan-500" />
                                </div>
                            </div>

                            <div className="space-y-4 overflow-y-auto pr-3 custom-scrollbar">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {tasks.map((task) => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-5 bg-zinc-800/20 border-l-2 border-cyan-500/50 rounded-r-2xl group transition-all hover:bg-zinc-800/40"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest px-2 py-0.5 bg-cyan-500/10 rounded">
                                                    {task.agent}
                                                </span>
                                                <span className="text-[9px] text-zinc-700 font-black uppercase">{task.time}</span>
                                            </div>
                                            <p className="text-[11px] text-zinc-400 leading-relaxed font-bold tracking-tight">{task.message}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {tasks.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="w-12 h-12 rounded-full border border-dashed border-zinc-800 mx-auto flex items-center justify-center text-zinc-800 mb-4">
                                            <Brain size={24} />
                                        </div>
                                        <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">Awaiting Neural Signal</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </AIToolsLayout>
    );
}
