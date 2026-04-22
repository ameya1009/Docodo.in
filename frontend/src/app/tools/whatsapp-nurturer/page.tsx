"use client";

import React, { useState } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Button, Input, GlassCard } from '@/components/ui/core';

export default function WhatsAppTool() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hi! I am your AI assistant. How can I help you grow today?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/v1/bot/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: 'Docodo SaaS Platform' })
      });
      
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Error connecting to AI.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Network Error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-24">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-h2 font-cabinet mb-4 text-center">WhatsApp AI Nurturer (Live Demo)</h1>
        <p className="text-center text-[var(--color-text-secondary)] mb-12">Experience the 5-second response time yourself.</p>

        <GlassCard className="max-w-md mx-auto h-[500px] flex flex-col relative overflow-hidden bg-[#0b141a]">
          <div className="bg-[#202c33] p-4 flex items-center gap-3 border-b border-[#313d45]">
            <div className="w-10 h-10 bg-[var(--color-accent-primary)] rounded-full flex items-center justify-center font-bold text-black">AI</div>
            <div>
              <div className="text-white font-semibold">Docodo Bot</div>
              <div className="text-[#8696a0] text-xs">online</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-[#005c4b] text-[#e9edef] self-end rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] self-start rounded-tl-none'}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-[#202c33] text-[#8696a0] self-start rounded-lg rounded-tl-none p-3 text-sm animate-pulse">
                typing...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-[#202c33] flex gap-2">
            <Input 
              value={input} 
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message" 
              className="bg-[#2a3942] border-none rounded-full h-10"
            />
            <Button type="submit" variant="whatsapp" className="w-10 h-10 rounded-full p-0 flex items-center justify-center shrink-0" disabled={loading}>
              <span className="sr-only">Send</span>
              ➤
            </Button>
          </form>
        </GlassCard>

        <div className="mt-16 text-center">
          <h2 className="text-xl font-cabinet mb-4">Ready to deploy this for your business?</h2>
          <Button variant="primary" onClick={() => window.location.href = '/care-plans'}>View Pricing & Subscribe</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
