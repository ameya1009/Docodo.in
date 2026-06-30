'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, Loader2, ArrowRight, Sparkles } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        business: '',
        email: '',
        budget: '',
        goal: 'growth',
        message: ''
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await response.json();
                setStatus('success');
                setFormData({
                    name: '',
                    business: '',
                    email: '',
                    budget: '',
                    goal: 'growth',
                    message: ''
                });
            } else {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    const rawText = await response.text();
                    console.error('Non-JSON error response:', rawText);
                    setErrorMessage(`Server Error (${response.status}): ${rawText.slice(0, 50)}...`);
                    setStatus('error');
                    return;
                }

                setStatus('error');
                setErrorMessage(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
        } catch (error: unknown) {
            console.error('Submission error:', error);
            setStatus('error');
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setErrorMessage(`Network error: ${errorMessage}`);
        }
    };

    return (
        <main className="bg-[var(--color-bg)] min-h-screen relative overflow-x-hidden">
            {/* 3D Grid & Noise Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    transformOrigin: 'top center',
                }}
            />
            
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--violet)] rounded-full blur-[150px] opacity-[0.1] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--mint)] rounded-full blur-[120px] opacity-[0.1] mix-blend-screen pointer-events-none" />

            <div className="relative z-10">
                <Navbar />

                <div className="pt-32 pb-24 px-4 container max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="glass rounded-[2.5rem] p-6 md:p-12 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[var(--mint-glow)] rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[var(--violet-glow)] rounded-full blur-3xl pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        className="text-center py-16"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <div className="w-20 h-20 bg-[var(--mint-glow)] text-[var(--mint)] rounded-full flex items-center justify-center mx-auto mb-8 border border-[var(--mint)]">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <h2 className="text-4xl font-bold mb-4 text-white">Inquiry Received</h2>
                                        <p className="text-[var(--text-secondary)] mb-10 max-w-md mx-auto text-lg">
                                            Our growth engineering team has been notified. 
                                            We'll stop playing ping-pong and reach out within 24 hours.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setStatus('idle')}
                                            className="rounded-xl px-8 h-12"
                                        >
                                            Send Another Request
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative z-10"
                                    >
                                        <header className="text-center mb-12">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-bright border-[var(--color-border-bright)] mb-6 text-[var(--mint)] font-bold uppercase tracking-widest text-xs"
                                            >
                                                <Sparkles size={14} /> Audit Application
                                            </motion.div>
                                            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white">
                                                Ready to <span className="text-gradient">Scale?</span>
                                            </h1>
                                            <p className="text-[var(--text-secondary)] text-lg max-w-lg mx-auto">
                                                Tell us about your business, and we'll engineer the systems required so you can finally take a vacation.
                                            </p>
                                        </header>

                                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] pl-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    placeholder="John Doe"
                                                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[var(--mint)] focus:bg-white/[0.04] transition-all"
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] pl-2">Business Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.business}
                                                    placeholder="Acme Inc."
                                                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[var(--mint)] focus:bg-white/[0.04] transition-all"
                                                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] pl-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    placeholder="john@example.com"
                                                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[var(--mint)] focus:bg-white/[0.04] transition-all"
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] pl-2">Monthly Budget</label>
                                                <select
                                                    required
                                                    value={formData.budget}
                                                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 text-white focus:outline-none focus:border-[var(--mint)] focus:bg-white/[0.04] transition-all appearance-none cursor-pointer"
                                                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                                >
                                                    <option value="" disabled className="bg-[var(--color-bg)]">Select a budget range...</option>
                                                    <option value="<5k" className="bg-[var(--color-bg)]">Less than ₹5k (Bootstrapper)</option>
                                                    <option value="5k-15k" className="bg-[var(--color-bg)]">₹5k - ₹15k (Hustler)</option>
                                                    <option value="15k-40k" className="bg-[var(--color-bg)]">₹15k - ₹40k (Unicorn)</option>
                                                    <option value="40k+" className="bg-[var(--color-bg)]">₹40k+ (Enterprise)</option>
                                                </select>
                                            </div>

                                            <div className="col-span-1 md:col-span-2 flex flex-col gap-2 mt-2">
                                                <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] pl-2">Your Primary Goal</label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {['Revenue Growth', 'Cost Efficiency', 'Brand Dominance', 'Stop Manual Replies'].map((g) => (
                                                        <button
                                                            key={g}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, goal: g.toLowerCase() })}
                                                            className={`p-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center text-center
                                                                ${formData.goal === g.toLowerCase() 
                                                                    ? 'bg-[var(--mint-glow)] border-[var(--mint)] text-[var(--mint)] shadow-[0_0_15px_var(--mint-glow)]' 
                                                                    : 'bg-white/[0.02] border-white/[0.08] text-[var(--text-muted)] hover:border-white/20'}`}
                                                        >
                                                            {g}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="col-span-1 md:col-span-2 flex flex-col gap-2 mt-2">
                                                <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] pl-2">Challenges & Context</label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.message}
                                                    placeholder="Tell us why your competitors are beating you right now..."
                                                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[var(--mint)] focus:bg-white/[0.04] transition-all resize-y"
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                />
                                            </div>

                                            <div className="col-span-1 md:col-span-2 mt-6">
                                                <button
                                                    type="submit"
                                                    disabled={status === 'submitting'}
                                                    className="w-full h-16 bg-[var(--mint)] text-black font-bold text-lg rounded-2xl hover:bg-[var(--mint)]/90 hover:scale-[1.01] transition-all shadow-[0_10px_30px_var(--mint-glow)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                >
                                                    {status === 'submitting' ? (
                                                        <>
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                            <span>Engineering...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Deploy Growth Audit</span>
                                                            <ArrowRight className="w-6 h-6" />
                                                        </>
                                                    )}
                                                </button>

                                                {status === 'error' && (
                                                    <p className="text-red-400 text-sm text-center mt-4 bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                                                        {errorMessage}
                                                    </p>
                                                )}

                                                <div className="mt-8 flex items-center justify-center gap-3 text-sm text-[var(--text-muted)]">
                                                    <div className="w-2 h-2 rounded-full bg-[var(--mint)] animate-pulse shadow-[0_0_10px_var(--mint)]" />
                                                    Direct Founder Response within 24 Hours
                                                </div>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
