'use client';

import React from 'react';

export function Stats() {
  return (
    <section className="py-24 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            
          <div className="flex flex-col border-l-2 border-[var(--color-border)] pl-6">
            <span className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-2">130K+</span>
            <span className="text-[var(--text-secondary)] font-medium">Startups funded</span>
          </div>

          <div className="flex flex-col border-l-2 border-[var(--color-border)] pl-6">
            <span className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-2">$14B</span>
            <span className="text-[var(--text-secondary)] font-medium">Assets under management</span>
          </div>

          <div className="flex flex-col border-l-2 border-[var(--color-border)] pl-6">
            <span className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-2">8M+</span>
            <span className="text-[var(--text-secondary)] font-medium">Candidates active</span>
          </div>

          <div className="flex flex-col border-l-2 border-[var(--color-border)] pl-6">
            <span className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-2">120+</span>
            <span className="text-[var(--text-secondary)] font-medium">Unicorns backed</span>
          </div>

        </div>
      </div>
    </section>
  );
}
