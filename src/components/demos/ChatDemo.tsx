'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Send, Bot, User } from 'lucide-react';

export function ChatDemo() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Docodo AI assistant. How can I help grow your business today?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', content: input }]);
        setInput('');

        // Simulate response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "That's a great goal! I can help you automate your content strategy to achieve that. Would you like to see a sample content calendar?"
            }]);
        }, 1000);
    };

    return (
        <Card className="max-w-xl mx-auto h-[500px] flex flex-col p-0 overflow-hidden border-zinc-800">
            <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">Docodo AI Agent</span>
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
                    placeholder="Ask me anything..."
                    className="flex-1 bg-black border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button size="sm" onClick={handleSend}><Send size={16} /></Button>
            </div>
        </Card>
    );
}
