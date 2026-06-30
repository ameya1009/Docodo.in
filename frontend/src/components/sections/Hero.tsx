'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Hero() {
  const [activeTab, setActiveTab] = useState<'build' | 'discover'>('build');

  return (
    <section className="relative pt-[120px] pb-24 md:pt-[160px] md:pb-32 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          
          <div className="flex-1 text-left">
            <div className="inline-flex items-center p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded mb-10">
              <button 
                onClick={() => setActiveTab('build')}
                className={`px-6 py-2 text-sm font-semibold rounded transition-colors ${activeTab === 'build' ? 'bg-[var(--text-primary)] text-[var(--color-bg)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                For Builders
              </button>
              <button 
                onClick={() => setActiveTab('discover')}
                className={`px-6 py-2 text-sm font-semibold rounded transition-colors ${activeTab === 'discover' ? 'bg-[var(--text-primary)] text-[var(--color-bg)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                For Talent
              </button>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[88px] font-extrabold tracking-tighter text-[var(--text-primary)] leading-[0.95] mb-8">
              {activeTab === 'build' ? 'Back the world’s best teams.' : 'Find the right startup job.'}
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed mb-10 font-medium">
              {activeTab === 'build' 
                ? 'Join over 100,000 startups and agencies building intelligent workflows. Launch faster with our managed infrastructure.'
                : 'Connect with top-tier AI startups and product agencies hiring right now. No recruiters, just direct access.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="#"
                className="w-full sm:w-auto flex items-center justify-center h-14 px-8 bg-[var(--text-primary)] text-[var(--color-bg)] text-base font-semibold rounded hover:bg-black/80 transition-colors"
              >
                {activeTab === 'build' ? 'Start Building' : 'Create Profile'}
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md hidden md:block">
            <div className="w-full aspect-[4/5] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-12 border-b border-[var(--color-border)] flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full border border-[var(--color-border)]" />
                    <div className="w-3 h-3 rounded-full border border-[var(--color-border)]" />
                    <div className="w-3 h-3 rounded-full border border-[var(--color-border)]" />
                </div>
                <div className="p-8 mt-12 flex flex-col gap-4">
                    <div className="w-3/4 h-8 bg-[var(--color-bg)] border border-[var(--color-border)] rounded" />
                    <div className="w-full h-24 bg-[var(--color-bg)] border border-[var(--color-border)] rounded" />
                    <div className="flex gap-4">
                        <div className="flex-1 h-32 bg-[var(--color-bg)] border border-[var(--color-border)] rounded" />
                        <div className="flex-1 h-32 bg-[var(--color-bg)] border border-[var(--color-border)] rounded" />
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
