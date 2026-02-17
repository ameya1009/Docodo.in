'use client';

import React from 'react';
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
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './AIToolsLayout.module.css';

interface AIToolsLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function AIToolsLayout({ children, title }: AIToolsLayoutProps) {
    const pathname = usePathname();

    const menuItems = [
        {
            icon: <LayoutDashboard className={styles.navIcon} />,
            label: 'Overview',
            href: '/ai-tools'
        },
        {
            icon: <Mail className={styles.navIcon} />,
            label: 'Email Automation',
            href: '/ai-tools/email-automation'
        },
        {
            icon: <Users className={styles.navIcon} />,
            label: 'Patient Registry',
            href: '/ai-tools/patients-list'
        },
        {
            icon: <Dumbbell className={styles.navIcon} />,
            label: 'FitFlow Manager',
            href: '/ai-tools/gym-management'
        }
    ];

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
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
                        <p className={styles.upgradeText}>
                            Get advanced agent capabilities with Pro.
                        </p>
                        <button className="w-full py-1.5 bg-white text-black text-[10px] font-bold rounded-md hover:opacity-90 transition-all">
                            Upgrade Now
                        </button>
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
                        <button className="lg:hidden p-2 text-zinc-400">
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
