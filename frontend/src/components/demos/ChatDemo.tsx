'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const EXAMPLE_PROMPTS = [
    "What are your service packages?",
    "How do you use AI for marketing?",
    "Tell me about Ameya Kshirsagar.",
    "Do you offer SEO services?"
];

export function ChatDemo() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your Docodo AI assistant. How can I help grow your business today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (text: string = input) => {
        const messageToSend = text.trim();
        if (!messageToSend || isLoading) return;

        const userMessage: Message = { role: 'user', content: messageToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.error?.includes('API key')
                        ? "I'm currently in 'Demo Mode' because the Google Gemini API key isn't configured yet. Ask the admin to set GOOGLE_GEMINI_API_KEY in the environment."
                        : "I hit a snag. Let's try that again?"
                }]);
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having a hard time connecting to my brain right now. Please check your internet or try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto h-[650px] flex flex-col p-0 overflow-hidden border-zinc-800/80 shadow-2xl bg-black/80 backdrop-blur-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-black p-5 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-emerald-500'} animate-pulse`} />
                        <div className={`absolute inset-0 w-3 h-3 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-emerald-500'} animate-ping opacity-20`} />
                    </div>
                    <div>
                        <span className="font-bold text-zinc-100 block text-sm tracking-wide">DOCODO INTELLIGENCE</span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{isLoading ? 'Processing Context...' : 'System Online'}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMessages([{ role: 'assistant', content: 'Hello! I am your Docodo AI assistant. How can I help grow your business today?' }])}
                        className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
                        title="Reset Chat"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <Sparkles size={18} className="text-primary opacity-60" />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {messages.length === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                        {EXAMPLE_PROMPTS.map((prompt, i) => (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                onClick={() => handleSend(prompt)}
                                className="text-left p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 text-xs text-zinc-400 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300 group"
                            >
                                <span className="block mb-1 group-hover:translate-x-1 transition-transform">{prompt}</span>
                            </motion.button>
                        ))}
                    </div>
                )}

                <AnimatePresence mode="popLayout">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'assistant'
                                ? 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20'
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                }`}>
                                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                            </div>

                            <div className={`p-5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-md ${msg.role === 'assistant'
                                ? 'bg-zinc-900/80 border border-zinc-800 text-zinc-100 rounded-tl-none'
                                : 'bg-zinc-100 text-black font-medium rounded-tr-none'
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                            <Bot size={20} />
                        </div>
                        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-zinc-500 text-sm flex gap-1 rounded-tl-none items-center">
                            <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" />
                            <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce delay-100" />
                            <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce delay-200" />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-black/60 backdrop-blur-xl border-t border-zinc-800">
                <div className="relative flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about Docodo or your growth strategy..."
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-5 pr-14 py-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600 shadow-inner"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button
                            size="sm"
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            className={`rounded-lg w-10 h-10 transition-all ${!input.trim() ? 'opacity-50' : 'hover:scale-105'}`}
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
                <div className="text-center mt-3">
                    <p className="text-[10px] text-zinc-600">AI can make mistakes. Verify critical growth data.</p>
                </div>
            </div>
        </Card>
    );
}
