'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';

export function AIChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Namaskar! Pune business? Looking to scale beyond manual operations?' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Mock bot response
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                role: 'bot',
                content: 'Sahi hai! Our AI-driven growth audit typically uncovers ₹50k+/mo in lost revenue for local service businesses. Ready for a quick demo call?'
            }]);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-[#0E0C15]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                        initial={{ opacity: 0, y: 20, scale: 0.95, originX: 1, originY: 1 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent pointer-events-none" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 p-[1px]">
                                        <div className="w-full h-full bg-[#0E0C15] rounded-xl flex items-center justify-center">
                                            <Bot size={20} className="text-violet-400" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-mint-500 border-2 border-[#0E0C15] rounded-full" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white flex items-center gap-1">
                                        Docodo AI <Sparkles size={12} className="text-violet-400" />
                                    </h4>
                                    <p className="text-[10px] text-zinc-400 font-medium">Growth Engineering Assistant</p>
                                </div>
                            </div>
                            <button 
                                onClick={toggleChat} 
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors relative z-10"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((msg, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-violet-600 text-white rounded-tr-sm shadow-[0_4px_14px_rgba(124,58,237,0.3)]' 
                                            : 'bg-white/5 border border-white/5 text-zinc-200 rounded-tl-sm'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                                        <motion.div className="w-1.5 h-1.5 rounded-full bg-zinc-500" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                                        <motion.div className="w-1.5 h-1.5 rounded-full bg-zinc-500" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                                        <motion.div className="w-1.5 h-1.5 rounded-full bg-zinc-500" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#0E0C15] border-t border-white/5">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!input.trim()}
                                    className="absolute right-1.5 w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center transition-colors"
                                >
                                    <Send size={14} className={input.trim() ? "ml-0.5" : ""} />
                                </button>
                            </form>
                            <div className="text-center mt-2">
                                <span className="text-[9px] text-zinc-600 font-medium uppercase tracking-widest">Docodo AI Agent • v2.0</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center justify-center text-white relative z-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChat}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                        >
                            <MessageSquare size={24} />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {!isOpen && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#07060A] flex items-center justify-center"
                    >
                        <span className="text-[9px] font-bold">1</span>
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
}
