'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import styles from './Navbar.module.css';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Tools Market', href: '/tools' },
    { name: 'Cases', href: '/cases' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Resources', href: '/blog' },
    { name: 'Global Story', href: '/about' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(styles.header, isScrolled && styles.scrolled)}
        >
            <div className={cn('container', styles.navContainer)}>
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="relative flex items-center">
                        <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#10B981] to-[#3B82F6] drop-shadow-[0_2px_12px_rgba(16,185,129,0.4)] group-hover:from-emerald-300 group-hover:to-[#60a5fa] transition-all duration-300">DOCODO</span>
                        <span className="absolute -top-0.5 -right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className={styles.desktopNav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                styles.navLink,
                                pathname === item.href && styles.active
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className={styles.actions}>
                    <Link href="/dashboard" className={styles.hideMobile}>
                        <Button variant="outline" size="sm" className={styles.btnCoral}>Dashboard</Button>
                    </Link>
                    <Link href="/tools" className={styles.hideMobile}>
                        <Button variant="primary" size="sm" className={styles.btnNeon}>Explore Tools</Button>
                    </Link>

                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={styles.mobileNav}
                    >
                        <div className="container">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={styles.mobileNavLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className={styles.mobileActions}>
                                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full">
                                        Talk to the Founder
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
