'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Linkedin, Newspaper, Headphones, Loader2, Twitter, Instagram } from 'lucide-react';

export function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async () => {
        if (!email || status === 'submitting') return;

        setStatus('submitting');
        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (_error) {
            console.error('Subscription error:', _error);
            setStatus('error');
            setMessage('Failed to subscribe. Please try again.');
        }
    };

    return (
        <footer className="bg-[#07060A] border-t border-white/10 pt-20 pb-10">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="flex flex-col gap-6 lg:pr-8">
                        <Link href="/" className="text-3xl font-black text-white relative w-fit">
                            Docodo<span className="absolute -top-1 -right-3 w-2 h-2 rounded-full bg-mint-400 shadow-[0_0_8px_#10B981]"></span>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            <strong className="text-white">#1 Global AI Growth OS for SMBs</strong>
                            <br />Websites, Apps, Marketing & Bots.
                            <br /><span className="text-mint-400 font-bold">Unlocking $500–$2,000/Month ROI.</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold mb-2">Platform</h4>
                        <Link href="/services" className="text-zinc-400 hover:text-white transition-colors text-sm">Services</Link>
                        <Link href="/cases" className="text-zinc-400 hover:text-white transition-colors text-sm">Case Studies</Link>
                        <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors text-sm">Pricing</Link>
                        <Link href="/dashboard/marketplace" className="text-zinc-400 hover:text-white transition-colors text-sm">AI Marketplace</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold mb-2">Company</h4>
                        <Link href="/about" className="text-zinc-400 hover:text-white transition-colors text-sm">About</Link>
                        <Link href="/blog" className="text-zinc-400 hover:text-white transition-colors text-sm">Blog</Link>
                        <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors text-sm">Contact</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold mb-2">Stay Updated</h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-mint-400 transition-colors placeholder:text-zinc-600 disabled:opacity-50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'submitting' || status === 'success'}
                            />
                            <Button
                                size="sm"
                                onClick={handleSubscribe}
                                disabled={status === 'submitting' || status === 'success'}
                                className="sm:w-auto w-full"
                            >
                                {status === 'submitting' ? <Loader2 className="animate-spin w-4 h-4" /> : 'Subscribe'}
                            </Button>
                        </div>
                        {message && (
                            <p className={`text-sm mt-2 ${status === 'error' ? 'text-red-400' : 'text-mint-400'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-500 text-sm">&copy; {new Date().getFullYear()} Docodo. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <a href="https://linkedin.com/company/docodo_global" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title="LinkedIn">
                            <Linkedin size={18} />
                        </a>
                        <a href="https://twitter.com/docodo_global" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title="Twitter/X">
                            <Twitter size={18} />
                        </a>
                        <a href="https://instagram.com/docodo_global" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title="Instagram">
                            <Instagram size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
