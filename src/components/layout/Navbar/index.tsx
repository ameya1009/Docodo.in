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
    { name: 'Services', href: '/services' },
    { name: 'AI Tools', href: '/ai-tools' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
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
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoText}>Docodo</span>
                    <span className={styles.logoDot}>.</span>
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
                    <Link href="/contact" className={styles.hideMobile}>
                        <Button variant="ghost" size="sm">Contact</Button>
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
                                    <Button variant="outline" className="w-full">
                                        Contact Sales
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
