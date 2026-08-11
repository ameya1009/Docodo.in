"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/FeedbackElements";
import { Button } from "@/components/ui/Button";
import { ChatBubble } from "@/components/ui/SpecialtyComponents";
import { simulateWhatsAppMessage } from "@/lib/actions/ai";

export const WhatsAppDemo = () => {
  const [messages, setMessages] = useState([
    { text: "Hi, I need to book a dental appointment", type: "in", timestamp: "11:47 PM" },
    { 
      text: "Hi! 👋 Welcome to Dr. Patangankar Dental Clinic. Are you a new patient or have you visited us before?", 
      type: "out", 
      timestamp: "11:47 PM" 
    },
    { text: "New patient", type: "in", timestamp: "11:48 PM" },
    { 
      text: "Great! I can check available slots for you. Which area are you based in — Viman Nagar, Baner, or Kothrud?", 
      type: "out", 
      timestamp: "11:48 PM" 
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = { text: inputValue, type: "in", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const currentHistory = [...messages];
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const result = await simulateWhatsAppMessage(inputValue, currentHistory.map(m => ({ role: m.type, text: m.text })));
    
    if (result.response) {
      setMessages((prev) => [...prev, { 
        text: result.response, 
        type: "out", 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } else {
      setMessages((prev) => [...prev, { 
        text: "Sorry, I'm having trouble connecting to my brain right now.", 
        type: "out", 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    }
    
    setIsTyping(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <section className="py-24 bg-[var(--bg-void)] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--lime)]/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="container grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Copy */}
        <div>
          <Badge variant="lime" className="mb-6">WhatsApp AI Nurturer · Most Popular</Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Replies at 3am.<br />So you don't have to.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-xl">
            Every lead gets an instant, intelligent reply. Qualified, logged, and followed up. All automatically.
          </p>

          <div className="space-y-4 mb-10">
            {[
              "60-second average first reply",
              "Hinglish + English supported",
              "Logs every lead to Google Sheet",
              "Sends review request 14 days later"
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-[var(--text-primary)] font-medium"
              >
                <CheckCircle2 size={18} className="text-[var(--lime)]" />
                {feature}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Start Free — 50 Credits Included
            </Button>
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold text-center sm:text-left">
              No card required · 48-hr setup · Cancel anytime
            </div>
          </div>
        </div>

        {/* Right Column: Phone Simulator */}
        <div className="relative mx-auto lg:ml-auto w-full max-w-[380px]">
          {/* Phone Frame */}
          <div className="relative border-[8px] border-black rounded-[3rem] bg-black shadow-2xl overflow-hidden aspect-[9/19]">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-2xl z-20" />
            
            {/* WhatsApp Header */}
            <div className="bg-[#128C7E] p-4 pt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[var(--lime)]"
                />
              </div>
              <div>
                <div className="text-white font-bold text-sm">Docodo AI</div>
                <div className="text-white/70 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)]" /> Online
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="bg-[#0B0E11] h-[calc(100%-120px)] p-4 overflow-y-auto flex flex-col custom-scrollbar">
              {messages.map((msg, i) => (
                <ChatBubble key={i} direction={msg.type as any} timestamp={msg.timestamp}>
                  {msg.text}
                </ChatBubble>
              ))}
              {isTyping && <ChatBubble direction="out" typing />}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-[#1e2428] flex gap-2 items-center">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-grow bg-[#2a2f32] text-white text-sm py-2 px-4 rounded-full outline-none border border-white/5"
              />
              <button 
                onClick={handleSend}
                className="w-10 h-10 rounded-full bg-[var(--lime)] flex items-center justify-center text-black"
              >
                <Send size={18} />
              </button>
            </div>

            {/* Demo Overlay Prompt */}
            <AnimatePresence>
              {messages.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 text-center"
                >
                  <div>
                    <h4 className="text-xl font-bold mb-4">You've seen it in action.</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                      This bot runs 24/7 on WhatsApp for your business.
                    </p>
                    <Button variant="primary" className="w-full">Set This Up Now</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
