import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)] py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2 lg:pr-8">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Docodo" className="w-6 h-6 object-contain" />
              <span className="font-bold tracking-tight text-lg text-[var(--text-primary)]">Docodo</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mb-6">
              Docodo provides global SMBs with the tools to scale. AI sales agents, marketing workflows, and enterprise websites designed for growth.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">For Candidates</h4>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Overview</Link>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Startup Jobs</Link>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Web3 Jobs</Link>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Engineering Jobs</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">For Employers</h4>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Overview</Link>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Recruit Pro</Link>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Curated</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Company</h4>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">About</Link>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">AngelList Venture</Link>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Help Center</Link>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Docodo. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Twitter</Link>
            <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">LinkedIn</Link>
            <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
