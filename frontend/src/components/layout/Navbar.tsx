'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-[var(--header-height)] flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.png" alt="Docodo" className="w-6 h-6 object-contain" />
            <span className="font-bold tracking-tight text-lg text-[var(--text-primary)]">Docodo</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Discover
            </Link>
            <Link href="#" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Invest
            </Link>
            <Link href="#" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Build
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center relative mr-2">
            <Search className="absolute left-3 w-4 h-4 text-[var(--text-muted)]" />
            <input 
                type="text" 
                placeholder="Search startups, jobs..." 
                className="h-9 pl-9 pr-4 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>
          <Link href="#" className="hidden sm:block text-sm font-semibold text-[var(--text-primary)] hover:opacity-70 transition-opacity">
            Log In
          </Link>
          <Link href="#" className="hidden sm:inline-flex items-center justify-center h-9 px-4 bg-[var(--text-primary)] text-[var(--color-bg)] text-sm font-semibold rounded hover:bg-black/80 transition-colors">
            Sign Up
          </Link>

          <button
            className="md:hidden p-1.5 text-[var(--text-primary)] hover:bg-[var(--color-surface)] rounded transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[var(--header-height)] left-0 w-full bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-sm">
          <div className="flex flex-col p-4 gap-4">
            <Link href="#" className="text-sm font-semibold text-[var(--text-primary)]">Discover</Link>
            <Link href="#" className="text-sm font-semibold text-[var(--text-primary)]">Invest</Link>
            <Link href="#" className="text-sm font-semibold text-[var(--text-primary)]">Build</Link>
            <hr className="border-[var(--color-border)]" />
            <Link href="#" className="text-sm font-semibold text-[var(--text-primary)]">Log In</Link>
            <Link href="#" className="text-sm font-semibold text-[var(--text-primary)]">Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
}
