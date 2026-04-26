"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button, Badge } from './ui/core';
import { Send, UploadCloud, MessageSquare } from 'lucide-react';

export const ProductTools = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: 'Hi! I am Docodo AI. Try chatting with me below to see how I qualify leads 24/7.' }
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Optimistic update
    const newHistory = [...chatHistory, { role: 'user', text: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage("");

    // Temporary mock reply (Real API integration in Phase 3)
    setTimeout(() => {
      setChatHistory([
        ...newHistory, 
        { role: 'bot', text: "That's great! Our backend proxy to Claude API will process this in production." }
      ]);
    }, 1000);
  };

  return (
    <section className="py-24 bg-[var(--color-bg-primary)] relative" id="tools">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-cabinet mb-4 glow-text">Docodo OS Suite</h2>
          <p className="text-[var(--color-text-secondary)]">Experience the automation firsthand.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Tool 1: WhatsApp AI Nurturer */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="perspective-[1000px]"
          >
            <GlassCard className="h-full flex flex-col p-8 transform-gpu hover:rotate-y-2 transition-transform duration-500 border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Badge className="bg-[#25D366]/20 text-[#25D366] border-[#25D366]/50 mb-2">WhatsApp Bot</Badge>
                  <h3 className="text-2xl font-cabinet font-bold">AI Nurturer</h3>
                </div>
                <MessageSquare className="text-[#25D366]" size={32} />
              </div>
              <p className="text-[var(--color-text-secondary)] mb-6 text-sm">
                Connects to your WhatsApp. Answers FAQs, qualifies leads, and books appointments automatically.
              </p>

              {/* Chat Simulator */}
              <div className="bg-[#0b141a] rounded-xl flex-grow flex flex-col border border-neutral-800 overflow-hidden mb-6 h-[250px]">
                <div className="bg-[#202c33] p-3 border-b border-neutral-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center text-black font-bold text-xs">D</div>
                  <span className="text-white font-medium text-sm">Docodo Bot Demo</span>
                </div>
                <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.role === 'bot' ? 'bg-[#202c33] text-white self-start rounded-tl-none' : 'bg-[#005c4b] text-white self-end rounded-tr-none'}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-2 bg-[#202c33] flex gap-2">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow bg-[#2a3942] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                  />
                  <button type="submit" className="p-2 text-[#8696a0] hover:text-[#25D366] transition-colors">
                    <Send size={20} />
                  </button>
                </form>
              </div>

              <Button variant="whatsapp" className="w-full">Try Free (Claim 50 Credits)</Button>
            </GlassCard>
          </motion.div>

          {/* Tool 2: Content Repurposer */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="perspective-[1000px]"
          >
            <GlassCard className="h-full flex flex-col p-8 transform-gpu hover:-rotate-y-2 transition-transform duration-500 border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Badge className="mb-2">Content Engine</Badge>
                  <h3 className="text-2xl font-cabinet font-bold">Repurposer</h3>
                </div>
                <UploadCloud className="text-[var(--color-accent-primary)]" size={32} />
              </div>
              <p className="text-[var(--color-text-secondary)] mb-6 text-sm">
                Upload 1 podcast or YouTube video. Get 30+ LinkedIn posts, tweets, and blog articles instantly.
              </p>

              {/* Drag & Drop Zone */}
              <div className="bg-[var(--color-bg-tertiary)] border-2 border-dashed border-[var(--color-border)] rounded-xl flex-grow flex flex-col items-center justify-center mb-6 hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-glass)] transition-all cursor-pointer h-[250px] relative overflow-hidden group">
                
                {/* Simulated processing animation on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-primary)]/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
                
                <UploadCloud size={48} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-primary)] mb-4 transition-colors" />
                <span className="text-white font-medium mb-1">Drag & Drop Audio/Video</span>
                <span className="text-[var(--color-text-secondary)] text-xs">Supports MP4, MP3, WAV up to 1GB</span>
              </div>

              <Button variant="primary" className="w-full">Repurpose Free</Button>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
