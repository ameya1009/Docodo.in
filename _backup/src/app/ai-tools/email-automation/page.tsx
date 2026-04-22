'use client';

import { useState } from 'react';
import { AIToolsLayout } from '@/components/layout/AIToolsLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Send, Sparkles, Copy, Check, Info } from 'lucide-react';

export default function EmailAutomationPage() {
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [points, setPoints] = useState('');
    const [tone, setTone] = useState('Professional');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedEmail('');

        // Mock AI generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        let emailBody = '';

        if (tone === 'Professional') {
            emailBody = `Dear ${recipient || '[Recipient Name]'},\n\nI hope this email finds you well.\n\nRegarding ${subject || '[Subject]'}:\n\n${points ? points.split('\n').map(p => `• ${p}`).join('\n') : '[Key points will be elaborated here.]'}\n\nPlease let me know if you have any questions or require further information.\n\nBest regards,\n[Your Name]`;
        } else if (tone === 'Friendly') {
            emailBody = `Hi ${recipient || '[Name]'},\n\nHope you're having a great day!\n\nI wanted to chat about ${subject || '[Subject]'}.\n\n${points}\n\nLet me know what you think!\n\nCheers,\n[Your Name]`;
        } else if (tone === 'Urgent') {
            emailBody = `URGENT: ${subject || '[Subject]'}\n\nHi ${recipient || '[Name]'},\n\nI need your immediate attention on this:\n\n${points}\n\nPlease respond as soon as possible.\n\nThanks,\n[Your Name]`;
        } else {
            emailBody = `Subject: ${subject}\n\nHi ${recipient},\n\n${points}\n\nBest,\n[Your Name]`;
        }

        setGeneratedEmail(emailBody);
        setIsGenerating(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AIToolsLayout title="Email Automation">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Smart Email Composer</h1>
                        <p className="text-zinc-500 text-sm">Draft professional emails with tone control and agents assistance.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-500 text-xs font-medium">
                        <Info size={14} />
                        Usage: 12/100 credits this month
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <Card className="p-6 border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">1</span>
                            Composer Context
                        </h2>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Recipient</label>
                                    <input
                                        type="text"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-all"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-all"
                                        placeholder="Project Update"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Key Points (One per line)</label>
                                <textarea
                                    value={points}
                                    onChange={(e) => setPoints(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-all h-32 resize-none"
                                    placeholder="- Budget approved&#10;- Timeline extended&#10;- Assets attached"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Drafting Tone</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Professional', 'Friendly', 'Urgent'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTone(t)}
                                            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${tone === t
                                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]'
                                                : 'bg-black/40 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full h-12 rounded-xl"
                                onClick={handleGenerate}
                                disabled={isGenerating || !points}
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="animate-spin mr-2">⟳</span> Writing Draft...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>

                    {/* Output Section */}
                    <div className="flex flex-col h-full">
                        <Card className="p-0 border-zinc-800 bg-zinc-900/40 backdrop-blur-sm h-full flex flex-col overflow-hidden">
                            <div className="p-4 border-bottom border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                                <h2 className="text-sm font-bold flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">2</span>
                                    Generated Preview
                                </h2>
                                {generatedEmail && (
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700"
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={14} className="text-green-500" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} />
                                                <span>Copy Draft</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className={`flex-1 p-6 font-mono text-sm leading-relaxed ${!generatedEmail ? 'flex items-center justify-center' : 'text-zinc-300'}`}>
                                {generatedEmail ? (
                                    <div className="whitespace-pre-wrap">{generatedEmail}</div>
                                ) : (
                                    <div className="text-center space-y-3">
                                        <Send className="mx-auto text-zinc-700 mb-2" size={32} />
                                        <p className="text-zinc-600 max-w-[200px]">Fill in the details and generate your first draft.</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AIToolsLayout>
    );
}
