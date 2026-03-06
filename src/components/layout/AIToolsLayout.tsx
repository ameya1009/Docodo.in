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
import styles from './AIToolsLayout.module.css';
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
            icon: <LayoutDashboard className={styles.navIcon} />,
            label: 'Marketplace',
            href: '/dashboard'
        },
        {
            icon: <Sparkles className={styles.navIcon} />,
            label: 'AI Agents',
            href: '/dashboard/agents'
        },
        {
            icon: <Brain className={styles.navIcon} />,
            label: 'Audit History',
            href: '/dashboard/audits'
        },
        {
            icon: <Settings className={styles.navIcon} />,
            label: 'Billing',
            href: '/dashboard/billing'
        }
    ];

    return (
        <div className={styles.layout}>
            {/* Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[48] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                styles.sidebar,
                isMobileMenuOpen && styles.mobileSidebarOpen
            )}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoIcon}>
                        <Sparkles size={20} />
                    </div>
                    <span className={styles.logoText}>Intelligence</span>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                styles.navItem,
                                pathname === item.href && styles.activeNavItem
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}

                    <div className="mt-auto pt-4 flex flex-col gap-1">
                        <Link href="/settings" className={styles.navItem}>
                            <Settings className={styles.navIcon} />
                            Settings
                        </Link>
                        <Link href="/" className={styles.navItem}>
                            <LogOut className={styles.navIcon} />
                            Exit
                        </Link>
                    </div>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.upgradePrompt}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase">Balance</span>
                            <span className="text-sm font-bold text-cyan-400">{credits} Credits</span>
                        </div>
                        <Link href="/pricing" className="w-full block text-center py-1.5 bg-cyan-500 text-black text-[10px] font-bold rounded-md hover:opacity-90 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                            Recharge Now
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.breadcrumb}>
                        <Link href="/" className={styles.breadcrumbLink}>Docodo</Link>
                        <ChevronRight size={10} />
                        <Link href="/ai-tools" className={styles.breadcrumbLink}>Intelligence</Link>
                        {title && title !== 'Overview' && (
                            <>
                                <ChevronRight size={10} />
                                <span className="text-white font-semibold">{title}</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active</span>
                        </div>
                        <button
                            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </header>

                <div className={styles.content}>
                    {children}
                </div>

                <footer className={styles.footer}>
                    <p>© 2026 Docodo Intelligence Suite</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </footer>
            </main>
        </div>
    );
}
