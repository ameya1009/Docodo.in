"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, FileText, Linkedin, Mail, MessageSquare, Loader2, Download, Zap } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

export const ContentRepurposer = () => {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('medium');

  const handleProcess = () => {
    if (!url) return;
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 3000);
  };

  const assets = {
    medium: {
      title: "How AI is Changing Pune SMBs",
      content: "The landscape of business in Pune is undergoing a massive shift. With the rise of AI Growth OS like Docodo, small businesses are no longer limited by human bandwidth...",
      icon: FileText
    },
    reels: {
      title: "5 Reel Scripts",
      content: "1. The 3am Lead Problem (0-5s)\n2. Why your CRM is failing (5-15s)\n3. The Docodo Solution (15-25s)...",
      icon: Youtube
    },
    linkedin: {
      title: "LinkedIn Carousel",
      content: "Slide 1: Why 40% of leads are missed.\nSlide 2: The cost of slow response.\nSlide 3: Enter Docodo AI...",
      icon: Linkedin
    },
    email: {
      title: "Email Newsletter",
      content: "Subject: Stop losing leads while you sleep\n\nHi [Name],\n\nI noticed you're still handling WhatsApp messages manually. Here's why that's costing you ₹20k/mo...",
      icon: Mail
    },
    whatsapp: {
      title: "WhatsApp Broadcast",
      content: "Hi! 😊 Just wanted to share a quick update on how our latest AI bot helped a local salon double their reviews in 30 days...",
      icon: MessageSquare
    }
  };

  return (
    <section className="bg-bg-surface py-32 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6">
            Content <span className="text-gradient-lime">Repurposer</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            1 Video → 30 Assets. Automatically. Stop wasting time on manual content creation.
          </p>
        </div>

        <GlassCard className="max-w-4xl mx-auto p-8 md:p-12 overflow-hidden">
          {step === 1 ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-widest text-gray-500">Paste YouTube or Podcast URL</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-lime outline-none transition-all pr-32"
                  />
                  <div className="absolute right-2 top-2">
                    <NeonButton 
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="px-6 py-2"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" size={20} /> : "Process"}
                    </NeonButton>
                  </div>
                </div>
              </div>

              {/* Step indicators */}
              <div className="flex justify-between items-center opacity-30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center font-bold">1</div>
                  <span className="text-xs font-bold uppercase tracking-widest">Input URL</span>
                </div>
                <div className="h-px w-12 bg-white" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center font-bold">2</div>
                  <span className="text-xs font-bold uppercase tracking-widest">AI Processing</span>
                </div>
                <div className="h-px w-12 bg-white" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center font-bold">3</div>
                  <span className="text-xs font-bold uppercase tracking-widest">Get Assets</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-wrap gap-2">
                {Object.keys(assets).map((key) => {
                  const asset = assets[key as keyof typeof assets];
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        activeTab === key ? 'bg-lime text-bg-deep' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <asset.icon size={14} />
                      {key.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              <div className="bg-bg-deep/50 rounded-2xl p-6 md:p-10 border border-white/5 min-h-[300px]">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-xl font-display font-bold text-lime">
                    {assets[activeTab as keyof typeof assets].title}
                  </h4>
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <Download size={20} />
                  </button>
                </div>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {assets[activeTab as keyof typeof assets].content}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center text-lime">
                    <Zap size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-widest block font-bold">Credits Cost</span>
                    <span className="text-white font-bold">10 Credits</span>
                  </div>
                </div>
                <NeonButton variant="primary" className="w-full sm:w-auto px-8">
                  Sign Up to Download All
                </NeonButton>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
      
      {/* Decorative Blur */}
      <div className="absolute -z-10 bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-lime/5 blur-[120px] rounded-full" />
    </section>
  );
};
