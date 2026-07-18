'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Activity, Settings, ArrowLeft, Send, Sparkles } from 'lucide-react';
import styles from './campaigns.module.css';
import UpgradeModal from '@/components/UpgradeModal';

export default function CampaignsPage() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    // Simulate AI Generation
    setTimeout(() => {
      setGeneratedEmail(`Subject: Supercharge Your Workflow with Docodo\n\nHi {{Name}},\n\nI noticed that {{Company}} is scaling quickly, but might be hitting roadblocks with manual tasks. \n\nAt Docodo, we build custom AI Agents that can automate your support and sales pipelines. \n\nWould you be open to a quick 10-minute demo this week? \n\nBest,\nDocodo Sales Team`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSend = () => {
    // Trigger Paywall instead of sending!
    setShowPaywall(true);
  };

  return (
    <main className={styles.main}>
      <div className={styles.sidebar}>
        <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          <div className="textLogo" style={{ fontSize: '1.25rem' }}>Docodo<span className="textLogoDot">.</span></div>
        </Link>
        <nav className={styles.nav}>
          <Link href="/dashboard"><LayoutDashboard size={20} /> Docodo CRM</Link>
          <Link href="/dashboard/agents"><Users size={20} /> AI Agents</Link>
          <Link href="/dashboard/campaigns" className={styles.active}><Activity size={20} /> Campaigns</Link>
          <Link href="/dashboard/settings"><Settings size={20} /> Settings</Link>
        </nav>
      </div>
      
      <div className={styles.content}>
        <header className={styles.header}>
          <h2>AI Marketing Campaigns</h2>
          <span className={styles.badge}>FREE TIER</span>
        </header>

        <div className={styles.campaignGrid}>
          {/* AI Generator Panel */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--primary-color)" /> AI Copywriter
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Describe your goal, and our AI will draft a highly-converting email sequence.</p>
            
            <textarea 
              className={styles.aiInput} 
              placeholder="E.g., Write a cold outreach email to B2B SaaS companies pitching our new AI Chatbot service..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <button className="btn btn-primary" onClick={handleGenerate} disabled={isGenerating} style={{ width: '100%', marginBottom: '2rem' }}>
              {isGenerating ? 'Generating...' : 'Generate AI Copy'}
            </button>

            {generatedEmail && (
              <div className={styles.emailPreview}>
                <div className={styles.previewHeader}>Preview</div>
                <pre className={styles.previewContent}>{generatedEmail}</pre>
                
                <button className={styles.sendBtn} onClick={handleSend}>
                  <Send size={18} /> Launch Campaign to CRM Leads
                </button>
              </div>
            )}
          </div>

          {/* Stats Panel */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Active Campaigns</h3>
            <div className={styles.emptyState}>
              <Activity size={48} color="var(--card-border)" style={{ marginBottom: '1rem' }} />
              <p>No active campaigns.</p>
              <span style={{ fontSize: '0.85rem' }}>Generate an email and launch a campaign to see real-time open rates and analytics.</span>
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        featureName="AI Email Campaigns" 
      />
    </main>
  );
}
