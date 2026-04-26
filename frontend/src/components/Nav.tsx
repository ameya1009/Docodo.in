"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { NeonButton } from './ui/NeonButton';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Tools', href: '/tools' },
  { name: 'Care Plans', href: '#pricing' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Blog', href: '/blog' },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 flex items-center",
        scrolled 
          ? "bg-bg-deep/80 backdrop-blur-xl border-b border-white/5" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display font-black text-2xl tracking-tighter text-white">
            DOCODO<span className="text-lime animate-pulse">.</span>
          </span>
        </Link>

        {/* Center: Desktop Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-lime transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/audit">
            <NeonButton variant="secondary" className="px-6 py-2 text-sm">
              Get Free Audit
            </NeonButton>
          </Link>
          <Link href="/signup">
            <NeonButton variant="primary" className="px-6 py-2 text-sm">
              Sign Up Free
            </NeonButton>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden text-white p-2" 
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-bg-deep p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-display font-black text-2xl tracking-tighter text-white">
                DOCODO<span className="text-lime">.</span>
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-4xl font-display font-bold text-white hover:text-lime transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <Link href="/audit" onClick={() => setMobileMenuOpen(false)}>
                <NeonButton variant="secondary" className="w-full py-4 text-lg">
                  Get Free Audit
                </NeonButton>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <NeonButton variant="primary" className="w-full py-4 text-lg">
                  Sign Up Free
                </NeonButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
