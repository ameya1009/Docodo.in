"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCheck, User, Bot, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const WhatsAppDemo = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hi, I need a dental appointment", sender: 'user', timestamp: new Date() },
    { id: '2', text: "Hi! 😊 Welcome to Dr. Patangankar Clinic. Are you a new patient or existing?", sender: 'bot', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/v1/bot/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue, context: "Dr. Patangankar Dental Clinic in Pune" })
      });
      const data = await response.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Sorry, I'm having trouble connecting right now.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section className="bg-bg-deep py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Info Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <MessageSquare size={24} />
            </span>
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-widest">
              Most Popular
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-black mb-8 leading-tight">
            WhatsApp AI <br />
            <span className="text-gradient-lime">Nurturer</span>
          </h2>

          <div className="space-y-6 mb-12">
            {[
              "60-second average response time",
              "Hinglish & Local Slang supported",
              "Automated appointment booking",
              "Lead qualification on autopilot"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-4 text-gray-300">
                <div className="w-5 h-5 rounded-full bg-lime/20 flex items-center justify-center text-lime">
                  <CheckCheck size={12} />
                </div>
                {feature}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <NeonButton variant="primary" className="px-8">
              Start Free
            </NeonButton>
            <div className="text-sm">
              <span className="text-white font-bold block">Free Tier</span>
              <span className="text-gray-500">50 messages/mo</span>
            </div>
          </div>
        </motion.div>

        {/* Demo Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="relative"
        >
          {/* Phone Mockup */}
          <div className="relative mx-auto w-[320px] h-[640px] bg-[#070707] border-[8px] border-[#1a1a1a] rounded-[3rem] shadow-2xl overflow-hidden perspective-1000 rotate-y-[-5deg]">
            {/* WA Header */}
            <div className="bg-[#121b21] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Docodo Dental Bot</h4>
                <span className="text-green-500 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Online
                </span>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="h-[480px] overflow-y-auto p-4 space-y-4 bg-[#0b141a] scrollbar-hide"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "max-w-[85%] p-3 rounded-xl text-sm relative",
                    msg.sender === 'user' 
                      ? "ml-auto bg-[#005c4b] text-white rounded-tr-none" 
                      : "mr-auto bg-[#202c33] text-white rounded-tl-none"
                  )}
                >
                  {msg.text}
                  <div className="flex justify-end mt-1 opacity-50 text-[10px]">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.sender === 'user' && <CheckCheck size={12} className="ml-1 text-blue-400" />}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mr-auto bg-[#202c33] text-white p-3 rounded-xl rounded-tl-none text-sm"
                >
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* WA Footer */}
            <form 
              onSubmit={handleSendMessage}
              className="absolute bottom-0 left-0 right-0 p-4 bg-[#121b21] flex gap-2"
            >
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#2a3942] border-none rounded-full px-4 py-2 text-white text-sm focus:ring-1 focus:ring-lime"
              />
              <button 
                type="submit"
                disabled={isTyping}
                className="w-10 h-10 rounded-full bg-lime flex items-center justify-center text-bg-deep disabled:opacity-50"
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime/10 blur-[100px] rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};

import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
