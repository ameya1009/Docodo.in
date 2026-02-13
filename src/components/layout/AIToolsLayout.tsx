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

    const currentTool = menuItems.find(item => item.href === pathname);

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoIcon}>
                        <Sparkles size={24} />
                    </div>
                    <span className={styles.logoText}>Docodo Intelligence</span>
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
                            Exit Dashboard
                        </Link>
                    </div>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.upgradePrompt}>
                        <p className={styles.upgradeText}>
                            Unlock advanced agent capabilities with Pro plan.
                        </p>
                        <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all">
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
                        <ChevronRight size={14} />
                        <Link href="/ai-tools" className={styles.breadcrumbLink}>Intelligence</Link>
                        {title && (
                            <>
                                <ChevronRight size={14} />
                                <span className="text-white font-medium">{title}</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-zinc-400 font-medium">System Status: Active</span>
                        </div>
                        <button className="lg:hidden p-2 text-zinc-400">
                            <Menu size={20} />
                        </button>
                    </div>
                </header>

                <div className={styles.content}>
                    {children}
                </div>

                <footer className={styles.footer}>
                    <p>© 2026 Docodo Intelligence Suite. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </footer>
            </main>
        </div>
    );
}
