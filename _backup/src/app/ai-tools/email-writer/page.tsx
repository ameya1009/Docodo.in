'use client';

import { useState } from 'react';
import { AIToolsLayout } from '@/components/layout/AIToolsLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mail, Loader2 } from 'lucide-react';

export default function EmailWriterPage() {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('professional');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch('/api/tools/email-writer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, tone })
            });
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.error || 'Something went wrong');
            } else {
                setResult(data.result);
            }
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AIToolsLayout title="Email Writer">
            <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-10">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">AI Email Writer</h1>
                    <p className="text-zinc-500 font-medium">Generate professional business emails tailored to your needs.</p>
                </div>

                <Card className="p-8 bg-zinc-900/40 border-zinc-800/50 backdrop-blur-2xl rounded-[2.5rem]">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Email Topic</label>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="E.g., Following up with an enterprise client on a proposal..."
                                className="w-full h-32 bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-zinc-700 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Tone</label>
                            <select 
                                value={tone} 
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none transition-all"
                            >
                                <option value="professional">Professional</option>
                                <option value="friendly">Friendly</option>
                                <option value="persuasive">Persuasive (Sales)</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <Button 
                            onClick={handleGenerate} 
                            disabled={isLoading || !topic}
                            className="w-full bg-purple-500 hover:bg-purple-400 text-white h-14 rounded-2xl font-black tracking-tight text-base shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Mail className="w-5 h-5" />}
                            {isLoading ? 'Writing...' : 'Draft Email (Costs 1 Credit)'}
                        </Button>
                    </div>

                    {result && (
                        <div className="mt-8 pt-8 border-t border-zinc-800/50 space-y-4">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Generated Email</h3>
                            <div className="p-6 bg-black border border-zinc-800 rounded-xl text-white font-mono text-sm whitespace-pre-wrap leading-relaxed">
                                {result}
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={() => navigator.clipboard.writeText(result)}
                                className="w-full rounded-xl border-zinc-700 text-zinc-400 hover:text-white"
                            >
                                Copy to Clipboard
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </AIToolsLayout>
    );
}
