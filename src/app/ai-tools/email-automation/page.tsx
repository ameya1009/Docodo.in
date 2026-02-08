'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Send, Sparkles, Copy, Check } from 'lucide-react';

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
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <section className="pt-32 pb-20 container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">
                            AI Workflow
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Smart <span className="text-primary">Email Composer</span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Transform bullet points into perfectly crafted emails in seconds.
                            Select your tone and let our agents handle the nuance.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <Card className="p-6 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">1</span>
                                Draft Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Recipient Name</label>
                                    <input
                                        type="text"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Subject Context</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                        placeholder="e.g. Q4 Marketing Strategy"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Key Points</label>
                                    <textarea
                                        value={points}
                                        onChange={(e) => setPoints(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors h-32 resize-none"
                                        placeholder="- Budget approval needed&#10;- Timeline extended by 1 week&#10;- New creative assets attached"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Tone</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Professional', 'Friendly', 'Urgent'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTone(t)}
                                                className={`px-3 py-2 rounded-lg text-sm border transition-all ${tone === t
                                                        ? 'bg-primary/20 border-primary text-primary'
                                                        : 'bg-black/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full mt-4"
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !points}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="animate-spin mr-2">⟳</span> Writing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" /> Generate Draft
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>

                        {/* Output Section */}
                        <div className="relative">
                            <Card className="p-6 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm h-full flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">2</span>
                                        AI Output
                                    </h2>
                                    {generatedEmail && (
                                        <button
                                            onClick={handleCopy}
                                            className="text-zinc-400 hover:text-white transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                        </button>
                                    )}
                                </div>

                                <div className={`flex-1 rounded-xl border border-zinc-800 bg-black/50 p-6 whitespace-pre-wrap leading-relaxed ${!generatedEmail ? 'flex items-center justify-center text-zinc-600' : 'text-zinc-300'}`}>
                                    {generatedEmail || "Your generated email will appear here..."}
                                </div>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </section>
            <Footer />
        </main>
    );
}
