'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './AIChatBubble.module.css';

export function AIChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Namaskar! Pune business? Free growth audit demo chahiye?' }
    ]);
    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages([...messages, userMsg]);
        setInput('');

        // Mock bot response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: 'Sahi hai! Humara AI growth audit aapko ₹50k/mo revenue lift dikha sakta hai. Book a call for demo?'
            }]);
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.chatWindow}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    >
                        <div className={styles.header}>
                            <div className="flex items-center gap-2">
                                <Bot size={20} className="text-cyan-400" />
                                <div>
                                    <h4 className="text-sm font-bold text-white">Docodo AI</h4>
                                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={toggleChat} className={styles.closeBtn}><X size={18} /></button>
                        </div>

                        <div className={styles.messages}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`${styles.message} ${msg.role === 'bot' ? styles.bot : styles.user}`}>
                                    {msg.content}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSend} className={styles.inputArea}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className={styles.input}
                            />
                            <button type="submit" className={styles.sendBtn}><Send size={18} /></button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className={styles.bubble}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {!isOpen && (
                    <span className={styles.notification}>1</span>
                )}
            </motion.button>
        </div>
    );
}
