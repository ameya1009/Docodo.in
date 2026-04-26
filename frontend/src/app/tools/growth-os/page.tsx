"use client";

import React, { useState } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Button, Input, GlassCard, Badge } from '@/components/ui/core';

export default function GrowthOSTool() {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && (!businessName || !industry)) return;
    
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-24 flex flex-col">
      <Nav />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full flex flex-col">
        <div className="text-center mb-12">
          <Badge variant="popular" className="mb-4 inline-block">Flagship AI Service</Badge>
          <h1 className="text-h2 font-cabinet mb-4 text-[var(--color-text-primary)]">Growth OS in a Box</h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
            Experience how we build your entire digital ecosystem in seconds. From a high-converting website to 24/7 AI lead nurturing.
          </p>
        </div>

        <GlassCard className="max-w-3xl mx-auto w-full min-h-[400px] relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-bg-tertiary)]">
            <div 
              className="h-full bg-[var(--color-accent-primary)] transition-all duration-1000 ease-in-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-cabinet mb-2">Step 1: Your Business Profile</h2>
                <p className="text-[var(--color-text-secondary)] mb-8">Tell us a bit about your business so our AI can customize your Growth OS.</p>
                
                <form onSubmit={handleNext} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-2">
                      Business Name
                    </label>
                    <Input 
                      value={businessName} 
                      onChange={e => setBusinessName(e.target.value)}
                      placeholder="e.g. Acme Corp" 
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-2">
                      Industry / Niche
                    </label>
                    <Input 
                      value={industry} 
                      onChange={e => setIndustry(e.target.value)}
                      placeholder="e.g. Real Estate, SaaS, Fitness..." 
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 mt-4"
                    isLoading={loading}
                  >
                    {loading ? 'Initializing AI Architect...' : 'Generate My Growth OS'}
                  </Button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-cabinet mb-2">Step 2: AI Blueprint Generation</h2>
                <p className="text-[var(--color-text-secondary)] mb-8">Here is the proposed architecture for <strong>{businessName}</strong>.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-bg-tertiary)]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">🌐</div>
                      <h3 className="font-bold">Next.js 15 Website</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">A 60fps, SEO-optimized landing page tailored for the {industry} market.</p>
                  </div>
                  
                  <div className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-bg-tertiary)]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">💬</div>
                      <h3 className="font-bold">WhatsApp AI Bot</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">24/7 lead qualification and appointment booking agent.</p>
                  </div>

                  <div className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-bg-tertiary)]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">📊</div>
                      <h3 className="font-bold">CRM Integration</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Automated pipeline management so no lead slips through.</p>
                  </div>

                  <div className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-bg-tertiary)]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">📧</div>
                      <h3 className="font-bold">Email Nurture</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Automated drip campaigns to convert prospects into buyers.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                  <Button variant="primary" onClick={() => {
                    setLoading(true);
                    setTimeout(() => { setLoading(false); setStep(3); }, 1500);
                  }} className="flex-1" isLoading={loading}>
                    {loading ? 'Finalizing...' : 'Deploy Blueprint'}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-center py-8">
                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  ✨
                </div>
                <h2 className="text-3xl font-cabinet mb-4 text-[var(--color-accent-primary)]">Blueprint Ready for Deployment</h2>
                <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
                  Your custom Growth OS architecture is ready. Deploying this manually would take 3-4 weeks. With Docodo, we can have you live in 72 hours.
                </p>
                
                <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-2xl p-6 max-w-sm mx-auto mb-8">
                  <h3 className="text-xl font-bold mb-2">Start Your Growth OS</h3>
                  <div className="text-3xl font-cabinet mb-4">₹50,000<span className="text-sm text-[var(--color-text-secondary)] font-normal">/mo</span></div>
                  <ul className="text-sm text-[var(--color-text-secondary)] text-left space-y-2 mb-6">
                    <li>✓ Custom Next.js 15 Website</li>
                    <li>✓ AI WhatsApp Lead Agent</li>
                    <li>✓ Full CRM Setup & Automation</li>
                    <li>✓ Dedicated Account Manager</li>
                  </ul>
                  <Button className="w-full" onClick={() => window.location.href = '/care-plans'}>
                    Subscribe & Start Build
                  </Button>
                </div>
                
                <button onClick={() => setStep(1)} className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors underline underline-offset-4">
                  Start Over
                </button>
              </div>
            )}
          </div>
        </GlassCard>
      </main>
      <Footer />
    </div>
  );
}
