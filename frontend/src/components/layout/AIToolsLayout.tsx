'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Mail,
    Users,
    Dumbbell,
    ChevronRight,
    Sparkles,
    Settings,
    LogOut,
    Menu,
    Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCredits } from '@/hooks/useCredits';

interface AIToolsLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function AIToolsLayout({ children, title }: AIToolsLayoutProps) {
    const pathname = usePathname();
    const { credits } = useCredits();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        {
            icon: <LayoutDashboard className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />,
            label: 'Marketplace',
            href: '/dashboard'
        },
        {
            icon: <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />,
            label: 'AI Agents',
            href: '/dashboard/agents'
        },
        {
            icon: <Brain className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />,
            label: 'Audit History',
            href: '/dashboard/audits'
        },
        {
            icon: <Settings className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />,
            label: 'Billing',
            href: '/dashboard/billing'
        }
    ];

    return (
        <div className="min-h-screen bg-[#07060A] text-white flex overflow-hidden">
            {/* Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[48] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static top-0 left-0 h-full w-[260px] bg-[#0E0C15]/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-[50] transition-transform duration-300",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex items-center gap-3 h-16 px-6 border-b border-white/5 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Sparkles size={16} />
                    </div>
                    <span className="font-bold text-sm tracking-widest uppercase text-white">Intelligence</span>
                </div>

                <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                pathname === item.href 
                                    ? "bg-white/10 text-white shadow-[inset_2px_0_0_0_#22d3ee]" 
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}

                    <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-white/5">
                        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
                            <Settings className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                            Settings
                        </Link>
                        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all group">
                            <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                            Exit
                        </Link>
                    </div>
                </nav>

                <div className="p-4 mt-auto border-t border-white/5 shrink-0 bg-white/[0.02]">
                    <div className="bg-[#07060A] rounded-xl border border-white/5 p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-xl rounded-full" />
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Balance</span>
                            <span className="text-sm font-black text-cyan-400">{credits} Credits</span>
                        </div>
                        <Link href="/pricing" className="w-full block text-center py-2 bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                            Recharge Now
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0 bg-[#0E0C15]/50 backdrop-blur-sm z-10 sticky top-0">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <Link href="/" className="hover:text-white transition-colors">Docodo</Link>
                        <ChevronRight size={12} />
                        <Link href="/dashboard" className="hover:text-white transition-colors">Intelligence</Link>
                        {title && title !== 'Overview' && (
                            <>
                                <ChevronRight size={12} />
                                <span className="text-cyan-400">{title}</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse" />
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Active</span>
                        </div>
                        <button
                            className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>

                <footer className="shrink-0 px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-[#07060A]">
                    <p>© {new Date().getFullYear()} Docodo Intelligence Suite</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </footer>
            </main>
        </div>
    );
}
