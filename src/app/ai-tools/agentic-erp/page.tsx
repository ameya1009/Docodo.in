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
    CheckCircle2
} from 'lucide-react';

interface Task {
    id: number;
    agent: string;
    message: string;
    time: string;
}

export default function AgenticERPPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [query, setQuery] = useState('');
    const [oracleResponse, setOracleResponse] = useState<string | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [activeAgents] = useState(3);
    const [dailyMargin] = useState('24.5%');

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
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest border border-cyan-500/20">
                                Enterprise Agent
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                <Activity size={10} className="text-green-500" /> System Online
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white">Reasoning Engine</h1>
                        <p className="text-zinc-500 mt-2 max-w-md">
                            Autonomous ERP controller that prioritizes business execution over UI management.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-3"
                    >
                        <Button variant="secondary" className="rounded-2xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800" onClick={fetchTasks}>
                            <RefreshCw size={18} className="mr-2" /> Refresh
                        </Button>
                        <Button className="rounded-2xl shadow-xl shadow-cyan-500/10" onClick={triggerInventoryAgent}>
                            <Zap size={18} className="mr-2" /> Trigger Inventory Agent
                        </Button>
                    </motion.div>
                </div>

                {/* Apple-style Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Daily Margin', value: dailyMargin, icon: <TrendingUp className="text-green-400" />, sub: '+1.2% from yest.' },
                        { label: 'Active Agents', value: activeAgents, icon: <Brain className="text-cyan-400" />, sub: 'Optimal load' },
                        { label: 'Tasks Automated', value: tasks.length, icon: <ShieldCheck className="text-purple-400" />, sub: 'Success-based' }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-6 bg-zinc-900/20 border-zinc-800/50 backdrop-blur-xl rounded-3xl hover:border-zinc-700 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    {stat.icon}
                                </div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                                <p className="text-[11px] text-zinc-600 font-medium flex items-center gap-1.5">
                                    <CheckCircle2 size={12} className="text-zinc-700" /> {stat.sub}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <motion.div
                        className="lg:col-span-2 space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={16} className="text-cyan-400" /> Agent Activity Stream
                            </h2>
                            <span className="text-[10px] text-zinc-600 font-bold uppercase">Live Updates</span>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {tasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-5 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl backdrop-blur-md flex items-center gap-4 group hover:bg-zinc-800/30 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                            {task.agent === 'Inventory' ? <Box size={20} /> : <TrendingUp size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-white uppercase tracking-tight">{task.agent} Agent</span>
                                                <span className="text-[10px] text-zinc-500 font-medium">{task.time}</span>
                                            </div>
                                            <p className="text-sm text-zinc-400 leading-relaxed font-medium">{task.message}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Oracle NL2SQL Sidebar */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl backdrop-blur-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Terminal size={18} className="text-cyan-400" /> Ask Oracle
                                </h3>
                                <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                                    Query your entire business database in natural language.
                                </p>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && runOracle()}
                                            placeholder="What was my margin last week?"
                                            className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none transition-all placeholder:text-zinc-700"
                                        />
                                    </div>

                                    <Button
                                        className="w-full rounded-2xl h-11 bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                                        onClick={runOracle}
                                        disabled={isThinking || !query}
                                    >
                                        {isThinking ? 'Consulting Logic...' : 'Query Engine'}
                                    </Button>

                                    <AnimatePresence>
                                        {oracleResponse && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="pt-4 border-t border-zinc-800 mt-2"
                                            >
                                                <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-[13px] text-cyan-100 leading-relaxed font-medium">
                                                    <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">Oracle Response</div>
                                                    {oracleResponse}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Card */}
                        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Success-Based Billing</h4>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-zinc-400 font-medium">Current Fee Due</span>
                                <span className="text-xl font-bold text-white">$14.00</span>
                            </div>
                            <Button variant="secondary" className="w-full rounded-2xl border-zinc-700 bg-transparent text-white font-bold hover:bg-zinc-800">
                                Settle Tasks (14)
                            </Button>
                            <p className="text-[10px] text-zinc-600 text-center mt-4 font-medium uppercase tracking-tighter">
                                $1 USD per autonomous action completed
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AIToolsLayout>
    );
}
