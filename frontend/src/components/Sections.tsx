import React from 'react';
import { GlassCard, Button, Badge } from './ui/core';

export const Services = () => (
  <section className="py-24 bg-[var(--color-bg-secondary)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-h2 font-cabinet mb-12">AI Growth Engines</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard className="h-[300px] flex flex-col justify-center items-center">
          <Badge className="mb-4">Websites & Apps</Badge>
          <p className="text-[var(--color-text-secondary)]">3D Interactive Experiences</p>
        </GlassCard>
        <GlassCard className="h-[300px] flex flex-col justify-center items-center">
          <Badge className="mb-4">Marketing & SEO</Badge>
          <p className="text-[var(--color-text-secondary)]">Automated Lead Gen</p>
        </GlassCard>
        <GlassCard className="h-[300px] flex flex-col justify-center items-center">
          <Badge className="mb-4">AI Automations</Badge>
          <p className="text-[var(--color-text-secondary)]">WhatsApp Bots & CRM</p>
        </GlassCard>
      </div>
    </div>
  </section>
);

export const GrowthStack = () => (
  <section className="py-24 bg-[var(--color-bg-primary)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-h2 font-cabinet mb-12">Founder-First Growth Stack™</h2>
      <div className="h-[400px] flex items-center justify-center border border-[var(--color-border)] rounded-xl bg-[var(--color-bg-glass)]">
        <p className="text-[var(--color-text-secondary)]">[3D Pyramid Rendered Here]</p>
      </div>
    </div>
  </section>
);

export const CarePlans = () => (
  <section className="py-24 bg-[var(--color-bg-secondary)]" id="pricing">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-h2 font-cabinet text-center mb-12">Docodo Care Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard>
          <h3 className="text-xl font-bold mb-2">Starter</h3>
          <p className="text-3xl font-cabinet font-bold text-[var(--color-accent-primary)] mb-6">₹2,499<span className="text-sm text-[var(--color-text-secondary)] font-sans">/mo</span></p>
          <Button variant="secondary" className="w-full">Get Started</Button>
        </GlassCard>
        <GlassCard className="border-[var(--color-accent-primary)] relative transform scale-105 shadow-[var(--shadow-glow-card)]">
          <Badge variant="popular" className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
          <h3 className="text-xl font-bold mb-2">Growth</h3>
          <p className="text-3xl font-cabinet font-bold text-[var(--color-accent-primary)] mb-6">₹4,999<span className="text-sm text-[var(--color-text-secondary)] font-sans">/mo</span></p>
          <Button variant="primary" className="w-full">Get Started</Button>
        </GlassCard>
        <GlassCard>
          <h3 className="text-xl font-bold mb-2">Pro</h3>
          <p className="text-3xl font-cabinet font-bold text-[var(--color-accent-primary)] mb-6">₹9,999<span className="text-sm text-[var(--color-text-secondary)] font-sans">/mo</span></p>
          <Button variant="secondary" className="w-full">Get Started</Button>
        </GlassCard>
      </div>
    </div>
  </section>
);

export const AuditCTA = () => (
  <section className="py-24 bg-[var(--color-accent-primary)] text-black" id="audit-section">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-h2 font-cabinet font-extrabold mb-6">Get Your Free 50-Point AI Growth Audit</h2>
      <p className="text-lg font-medium mb-8">We'll find ₹50,000+ of hidden revenue in your business in 24 hours. No sales call. No nonsense.</p>
      <Button className="bg-black text-[var(--color-accent-primary)] hover:bg-neutral-900 shadow-xl border-none">Start Free Audit</Button>
    </div>
  </section>
);

export const CaseStudies = () => <div />;
export const Differentiators = () => <div />;
export const SocialProof = () => <div />;
export const Tools = () => <div />;
