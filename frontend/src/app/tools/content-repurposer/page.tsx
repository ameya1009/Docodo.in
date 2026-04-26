"use client";

import React, { useState } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Button, Input, GlassCard, Badge } from '@/components/ui/core';

export default function ContentRepurposerTool() {
  const [url, setUrl] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ platform: string, content: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRepurpose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults(null);

    // Simulated API call for the real-time demo
    try {
      // In production, this would call our Express backend to scrape and use Anthropic
      // We will simulate the delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setResults([
        {
          platform: 'LinkedIn',
          content: `🚀 Just published a new piece on how AI is transforming SMB growth!\n\nIf you're a founder spending 10+ hours a week on operations, you need to read this.\n\nKey takeaways:\n1️⃣ Automate repetitive tasks\n2️⃣ Nurture leads 24/7\n3️⃣ Scale without hiring\n\nRead the full breakdown in the comments below! 👇\n\n#AI #Growth #SMBs #FounderLife`
        },
        {
          platform: 'Twitter / X',
          content: `Tired of spending hours on ops instead of growth? 🤔\n\nAI is the ultimate lever for SMB founders.\n\nAutomate tasks, capture leads 24/7, and scale efficiently.\n\nCheck out the full guide here: [Link] 📈 #SaaS #AI #Founders`
        },
        {
          platform: 'Email Newsletter',
          content: `Subject: How to win back 10 hours a week ⏳\n\nHi {{Name}},\n\nAs a founder, your time is your most valuable asset. But how much of it is spent on manual data entry or following up with leads?\n\nIn our latest guide, we break down exactly how you can use AI to automate your workflows and focus on what matters most: growing your business.\n\nClick here to read the full breakdown.\n\nBest,\nYour Name`
        }
      ]);
    } catch (err) {
      setError("Failed to repurpose content. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-24 flex flex-col">
      <Nav />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full flex flex-col">
        <div className="text-center mb-12">
          <Badge variant="new" className="mb-4 inline-block">Live Tool</Badge>
          <h1 className="text-h2 font-cabinet mb-4 text-[var(--color-text-primary)]">AI Content Repurposer</h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
            Turn one blog post or video into a week's worth of viral LinkedIn posts, Twitter threads, and email newsletters in 5 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Section */}
          <div className="lg:col-span-5">
            <GlassCard className="sticky top-28">
              <form onSubmit={handleRepurpose} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-2">
                    Source Content URL
                  </label>
                  <Input 
                    value={url} 
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://yourblog.com/post or YouTube link" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-2">
                    Source Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setContentType('blog')}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        contentType === 'blog' 
                          ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]' 
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
                      }`}
                    >
                      Article / Blog
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentType('video')}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        contentType === 'video' 
                          ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]' 
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
                      }`}
                    >
                      YouTube Video
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg" 
                  isLoading={loading}
                >
                  {loading ? 'Analyzing Content...' : 'Generate 10x Content Magic'}
                </Button>
                
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}
                
                <p className="text-xs text-center text-[var(--color-text-secondary)]">
                  Consumes 1 Docodo Credit per generation.
                </p>
              </form>
            </GlassCard>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {loading ? (
              <GlassCard className="h-[500px] flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-4 border-[var(--color-accent-primary)]/30 border-t-[var(--color-accent-primary)] rounded-full animate-spin"></div>
                <div className="text-[var(--color-text-secondary)] animate-pulse font-medium">Extracting key insights and writing copy...</div>
              </GlassCard>
            ) : results ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {results.map((res, i) => (
                  <GlassCard key={i} className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
                      <h3 className="font-bold text-[var(--color-accent-primary)] uppercase tracking-wider text-sm">{res.platform}</h3>
                      <button 
                        onClick={() => navigator.clipboard.writeText(res.content)}
                        className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-white bg-[var(--color-bg-tertiary)] px-3 py-1.5 rounded-full transition-colors"
                      >
                        Copy Text
                      </button>
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-[var(--color-text-primary)] leading-relaxed font-mono">
                      {res.content}
                    </div>
                  </GlassCard>
                ))}
                
                <GlassCard className="bg-gradient-to-r from-[var(--color-accent-primary)]/10 to-transparent border-[var(--color-accent-primary)]/30 text-center py-8">
                  <h3 className="text-xl font-cabinet mb-2">Want to automate this entire workflow?</h3>
                  <p className="text-[var(--color-text-secondary)] mb-6 text-sm">Our "Growth OS in a Box" plan automatically posts this across your channels.</p>
                  <Button variant="primary" onClick={() => window.location.href = '/care-plans'}>Upgrade to Auto-Post</Button>
                </GlassCard>
              </div>
            ) : (
              <GlassCard className="h-[500px] flex flex-col items-center justify-center space-y-4 opacity-50">
                <div className="text-6xl">🪄</div>
                <h3 className="text-xl font-medium text-[var(--color-text-primary)]">Waiting for your content</h3>
                <p className="text-[var(--color-text-secondary)] text-center max-w-sm">
                  Paste a link on the left to see how Docodo instantly repurposes your content for maximum reach.
                </p>
              </GlassCard>
            )}
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}
