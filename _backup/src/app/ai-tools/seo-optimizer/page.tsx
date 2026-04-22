'use client';

import { useState } from 'react';
import { AIToolsLayout } from '@/components/layout/AIToolsLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileText, Search, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function SEOOptimizerPage() {
    const { data: session } = useSession();
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!description) return;
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch('/api/tools/seo-optimizer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            });
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.error || 'Something went wrong');
            } else {
                setResult(data.result);
                // Assume an event triggered somewhere to update credits in UI, or wait for refresh.
            }
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AIToolsLayout title="SEO Optimizer">
            <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-10">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">AI SEO Optimizer</h1>
                    <p className="text-zinc-500 font-medium">Generate market-ready Meta Titles and Descriptions instantly.</p>
                </div>

                <Card className="p-8 bg-zinc-900/40 border-zinc-800/50 backdrop-blur-2xl rounded-[2.5rem]">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Context or URL Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your product, page, or post..."
                                className="w-full h-32 bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-zinc-700 resize-none"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <Button 
                            onClick={handleGenerate} 
                            disabled={isLoading || !description}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black h-14 rounded-2xl font-black tracking-tight text-base shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
                            {isLoading ? 'Optimizing...' : 'Generate SEO Data (Costs 2 Credits)'}
                        </Button>
                    </div>

                    {result && (
                        <div className="mt-8 pt-8 border-t border-zinc-800/50 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Meta Title</h3>
                                <div className="p-4 bg-black border border-zinc-800 rounded-xl text-white font-mono text-sm">
                                    {result.title || result.result || 'No title generated'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Meta Description</h3>
                                <div className="p-4 bg-black border border-zinc-800 rounded-xl text-white font-mono text-sm leading-relaxed">
                                    {result.description || 'No description generated'}
                                </div>
                            </div>
                            {result.keywords && Array.isArray(result.keywords) && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Target Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.keywords.map((kw: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-bold uppercase tracking-widest">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </AIToolsLayout>
    );
}
