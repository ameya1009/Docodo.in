'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Activity, Settings, ArrowLeft, Bot, Palette, Code, MessageSquare } from 'lucide-react';
import styles from './agents.module.css';
import UpgradeModal from '@/components/UpgradeModal';

export default function AgentsPage() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [botName, setBotName] = useState('Docodo Sales Agent');
  const [themeColor, setThemeColor] = useState('#2bd4ac');
  const [welcomeMsg, setWelcomeMsg] = useState('Hi! How can I help you today?');
  
  // Preview Chat State
  const [previewChat, setPreviewChat] = useState<{role: string, text: string}[]>([
    { role: 'bot', text: welcomeMsg }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Auto-update preview welcome message when typing
  React.useEffect(() => {
    setPreviewChat([{ role: 'bot', text: welcomeMsg }]);
  }, [welcomeMsg]);

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;
    
    setPreviewChat([...previewChat, { role: 'user', text: chatInput }]);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setPreviewChat(prev => [...prev, { role: 'bot', text: "I'm a prototype agent! Upgrade to premium to connect me to your real data." }]);
    }, 1000);
  };

  const handleDeploy = () => {
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
          <Link href="/dashboard/agents" className={styles.active}><Users size={20} /> AI Agents</Link>
          <Link href="/dashboard/campaigns"><Activity size={20} /> Campaigns</Link>
          <Link href="/dashboard/settings"><Settings size={20} /> Settings</Link>
        </nav>
      </div>
      
      <div className={styles.content}>
        <header className={styles.header}>
          <h2>AI Agent Builder</h2>
          <span className={styles.badge}>FREE TIER</span>
        </header>

        <div className={styles.builderGrid}>
          {/* Customization Panel */}
          <div className={styles.controlsPanel}>
            <div className="card" style={{ height: '100%' }}>
              <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={20} color="var(--primary-color)" /> Configuration
              </h3>
              
              <div className={styles.formGroup}>
                <label>Agent Name</label>
                <input type="text" value={botName} onChange={e => setBotName(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label>Theme Color</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className={styles.colorPicker} />
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{themeColor}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Welcome Message</label>
                <textarea 
                  value={welcomeMsg} 
                  onChange={e => setWelcomeMsg(e.target.value)}
                  style={{ height: '80px', resize: 'none' }}
                />
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <button className={styles.deployBtn} onClick={handleDeploy}>
                  <Code size={18} /> Get Embed Script
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className={styles.previewPanel}>
            <div className={styles.previewContainer}>
              <div className={styles.chatWidget} style={{ borderColor: themeColor }}>
                <div className={styles.chatHeader} style={{ background: themeColor }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className={styles.botAvatar}><Bot size={20} /></div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{botName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Online</div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.chatBody}>
                  {previewChat.map((msg, idx) => (
                    <div key={idx} className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.messageUser : styles.messageBot}`}>
                      <div className={styles.messageBubble} style={msg.role === 'user' ? { background: themeColor, color: '#fff' } : {}}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form className={styles.chatInput} onSubmit={handleChat}>
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                  />
                  <button type="submit" style={{ color: themeColor }}><MessageSquare size={20} /></button>
                </form>
                
                <div className={styles.watermark}>
                  ⚡ Powered by Docodo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        featureName="AI Chatbot Deployment" 
      />
    </main>
  );
}
