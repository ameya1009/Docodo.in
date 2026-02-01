'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Send, Bot, User } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatDemo() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your Docodo AI assistant. How can I help grow your business today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
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

            if (data.error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.error.includes('API key')
                        ? "I'm not fully configured yet. Please ask the site administrator to set up the API key."
                        : "I'm having trouble responding right now. Please try again!"
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having connection issues. Please try again in a moment!"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-xl mx-auto h-[500px] flex flex-col p-0 overflow-hidden border-zinc-800">
            <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
                <span className="font-medium">{isLoading ? 'Docodo AI Agent (thinking...)' : 'Docodo AI Agent'}</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/40">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-indigo-600' : 'bg-zinc-700'}`}>
                            {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.role === 'assistant' ? 'bg-zinc-800 text-zinc-100' : 'bg-primary text-black'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about Docodo's services..."
                    className="flex-1 bg-black border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                />
                <Button size="sm" onClick={handleSend} disabled={isLoading}>
                    <Send size={16} />
                </Button>
            </div>
        </Card>
    );
}
