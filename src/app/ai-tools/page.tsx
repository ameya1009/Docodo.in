'use client';

import { AIToolsLayout } from '@/components/layout/AIToolsLayout';
import { motion } from 'framer-motion';
import { Brain, Cpu, Shield, Workflow, Sparkles, Mail, Users, Dumbbell, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const tools = [
    {
        id: 'email-automation',
        title: 'Smart Email Composer',
        description: 'Transform bullet points into perfectly crafted emails in seconds. Select your tone and let agents handle the nuance.',
        icon: <Mail className="w-6 h-6" />,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        href: '/ai-tools/email-automation',
        status: 'Active',
        category: 'Communication'
    },
    {
        id: 'patients-list',
        title: 'Patient Registry',
        description: 'Securely manage patient records, history, and prescriptions with AI assistance. Built for healthcare professionals.',
        icon: <Users className="w-6 h-6" />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        href: '/ai-tools/patients-list',
        status: 'Active',
        category: 'Medical'
    },
    {
        id: 'gym-management',
        title: 'FitFlow Manager',
        description: 'Automate gym memberships, track attendance, and manage growth. Streamline your facility operations.',
        icon: <Dumbbell className="w-6 h-6" />,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        href: '/ai-tools/gym-management',
        status: 'Active',
        category: 'Facility'
    }
];

const stats = [
    { label: 'Active Agents', value: '12', trend: '+2' },
    { label: 'Workflows Automated', value: '1.2k', trend: '+12%' },
    { label: 'Time Saved', value: '450h', trend: '+8%' }
];

export default function AIToolsPage() {
    return (
        <AIToolsLayout title="Overview">
            <div className="space-y-10">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.h1
                            className="text-3xl font-bold mb-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            Welcome to <span className="text-primary">Intelligence</span>
                        </motion.h1>
                        <motion.p
                            className="text-zinc-400"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            Unlock autonomous execution with Docodo agents.
                        </motion.p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                        >
                            <div className="text-sm text-zinc-500 mb-1">{stat.label}</div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                                <span className="text-xs text-green-500 font-medium pb-1.5">{stat.trend}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tools Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Active Applications</h2>
                        <button className="text-sm text-primary hover:underline flex items-center gap-1">
                            Browse all tools <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tools.map((tool, i) => (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="relative aspect-square"
                            >
                                <Link href={tool.href} className="block h-full group">
                                    <div className="h-full p-8 rounded-[2.5rem] border border-white/5 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col relative group">
                                        {/* Background Glow */}
                                        <div className={`absolute -top-24 -right-24 w-48 h-48 ${tool.bgColor} opacity-0 group-hover:opacity-20 blur-[80px] transition-opacity duration-700`} />

                                        <div className="flex items-start justify-between mb-8 relative z-10">
                                            <div className={`${tool.bgColor} ${tool.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/20`}>
                                                {tool.icon}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                                                    {tool.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex-1 flex flex-col justify-end">
                                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 tracking-tight">
                                                {tool.title}
                                            </h3>

                                            <p className="text-zinc-400 text-sm leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                                                {tool.description}
                                            </p>

                                            <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform duration-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="relative">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                        <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping opacity-75" />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{tool.status}</span>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                    <ArrowRight size={18} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Border highlight effect */}
                                        <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-[2.5rem] transition-colors pointer-events-none" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Automation Spotlight */}
                <motion.div
                    className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="text-primary" size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">Pro Feature</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Proprietary Growth Kernels</h2>
                        <p className="text-zinc-400 mb-6 font-medium leading-relaxed">
                            Docodo agents are built on kernels that don&apos;t just predict text—they execute workflows.
                            Connect your tools and let the agents handle the routine.
                        </p>
                        <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:brightness-110 transition-all">
                            Configure Workflows
                        </button>
                    </div>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 blur-sm pointer-events-none">
                        <Brain className="w-64 h-64" />
                    </div>
                </motion.div>
            </div>
        </AIToolsLayout>
    );
}

