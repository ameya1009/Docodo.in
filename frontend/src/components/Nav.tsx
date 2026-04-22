"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Button } from '@/components/ui/core';
import { Menu, X } from 'lucide-react';

// Basic 3D Orb for Nav
const NavOrb = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3] }} style={{ width: 40, height: 40 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#00FF41" wireframe />
      </mesh>
    </Canvas>
  );
};

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Tools', href: '/tools' },
  { name: 'Care Plans', href: '/care-plans' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Growth Stack', href: '/growth-stack' },
  { name: 'Blog', href: '/blog' },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[var(--color-bg-glass)] backdrop-blur-xl border-b border-[var(--color-border)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative group-hover:scale-110 transition-transform">
            <NavOrb />
          </div>
          <span className="font-cabinet font-extrabold text-xl tracking-tight">Docodo.</span>
        </Link>

        {/* Center: Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors relative group">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent-primary)] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/audit">
            <Button variant="whatsapp" size="sm">Get Free Audit</Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-[var(--color-text-primary)]" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[var(--color-bg-primary)] p-6 flex flex-col"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)} className="text-[var(--color-text-primary)]">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6 mt-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.2 }}
                >
                  <Link href={link.href} className="text-2xl font-cabinet font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)]" onClick={() => setMobileMenuOpen(false)}>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-4">
              <Link href="/audit" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="whatsapp" className="w-full">Get Free Audit</Button>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" className="w-full">Login</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
