'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Tools Market', href: '/tools' },
    { name: 'Cases', href: '/cases' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Resources', href: '/blog' },
    { name: 'Global Story', href: '/about' },
];

export function Logo3D() {
    return (
        <motion.div
            className="flex items-center gap-2.5 cursor-pointer"
            style={{ perspective: '1000px' }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
            {/* 3D Rotating Isometric Icon */}
            <motion.div
                className="relative w-8 h-8 flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]">
                    <path 
                        d="M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z" 
                        fill="none" 
                        stroke="url(#logoGrad)" 
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    <circle cx="50" cy="50" r="14" fill="#10B981" className="animate-pulse" />
                    <defs>
                        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>

            {/* Wordmark with sliding video shimmer effect */}
            <span className="relative font-extrabold tracking-tighter text-2xl select-none">
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-mint-400 blur-sm opacity-40">
                    DOCODO
                </span>
                <span 
                    className="relative text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-mint-400"
                    style={{
                        backgroundImage: 'linear-gradient(90deg, #8B5CF6, #6366F1, #10B981, #8B5CF6)',
                        backgroundSize: '200% auto',
                        animation: 'shimmer 4s linear infinite',
                    }}
                >
                    DOCODO
                </span>
                <span className="absolute -top-0.5 -right-2 w-1.5 h-1.5 rounded-full bg-mint-400 shadow-[0_0_8px_#10B981]" />
            </span>
        </motion.div>
    );
}

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
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b border-transparent",
                isScrolled ? "bg-[#07060A]/80 backdrop-blur-xl border-white/10 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-transparent py-6"
            )}
        >
            <div className="container max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link href="/">
                    <Logo3D />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative px-4 py-2 text-sm font-bold text-zinc-400 transition-colors hover:text-white rounded-full hover:bg-white/5",
                                pathname === item.href && "text-white bg-white/5"
                            )}
                        >
                            {item.name}
                            {pathname === item.href && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-mint-400 shadow-[0_0_8px_#10B981]"
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hidden sm:block">
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-white/30 hover:bg-white/5">Dashboard</Button>
                    </Link>
                    <Link href="/tools" className="hidden sm:block">
                        <Button variant="primary" size="sm">Explore Tools</Button>
                    </Link>

                    <button
                        className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-[#07060A]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="container px-4 py-6 flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-4 rounded-xl text-lg font-bold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white",
                                        pathname === item.href && "text-white bg-white/10"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-6 mt-4 border-t border-white/10 flex flex-col gap-4">
                                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full h-12 flex items-center justify-center font-bold">
                                        Talk to the Founder
                                    </Button>
                                </Link>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full h-12 border-white/10 hover:border-white/30">Dashboard</Button>
                                    </Link>
                                    <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full h-12 border-white/10 hover:border-white/30">AI Tools</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
