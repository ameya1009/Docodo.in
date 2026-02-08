'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Send, Bot, User, Sparkles } from 'lucide-react';

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
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having a hard time connecting to my brain right now. Please check your internet or try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-xl mx-auto h-[550px] flex flex-col p-0 overflow-hidden border-zinc-800 shadow-2xl">
            <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
                    <span className="font-medium text-zinc-200">{isLoading ? 'Docodo AI Agent (thinking...)' : 'Docodo AI Assistant'}</span>
                </div>
                <Sparkles size={16} className="text-primary opacity-50" />
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/60">
                {messages.length === 1 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {EXAMPLE_PROMPTS.map((prompt, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(prompt)}
                                className="text-left p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 hover:border-primary hover:text-primary transition-all"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                            {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-zinc-900 border border-zinc-800 text-zinc-100' : 'bg-primary text-black font-medium'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary border border-primary/30">
                            <Bot size={16} />
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm flex gap-1">
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                />
                <Button size="md" onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="rounded-xl">
                    <Send size={18} />
                </Button>
            </div>
        </Card>
    );
}
