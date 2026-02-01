'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, Loader2 } from 'lucide-react';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
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
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    return (
        <main className="min-h-screen bg-[#050510] relative text-white selection:bg-cyan-500/30">
            <Navbar />

            <div className="container mx-auto px-6 py-32 relative z-10 flex items-center justify-center min-h-[90vh]">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group glass">

                        {/* Ambient Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-700" />

                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    className="text-center py-20 relative z-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Inquiry Received!</h2>
                                    <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                                        Our growth engineering team is already analyzing your business.
                                        The founder will reach out directly within 24 hours.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setStatus('idle')}
                                        className="border-white/10 hover:bg-white/5"
                                    >
                                        Send Another Inquiry
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="text-center mb-10 relative z-10">
                                        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-zinc-400 mb-4 tracking-tight">
                                            Start Your Transformation
                                        </h1>
                                        <p className="text-zinc-400 text-lg">
                                            Tell us about your business, and we&apos;ll engineer your growth.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider pl-1 font-heading">Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    placeholder="John Doe"
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder:text-zinc-600 hover:bg-black/50 glass"
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider pl-1 font-heading">Business Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.business}
                                                    placeholder="Acme Inc."
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder:text-zinc-600 hover:bg-black/50 glass"
                                                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1 font-heading">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                placeholder="john@example.com"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder:text-zinc-600 hover:bg-black/50 glass"
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1 font-heading">Current Monthly Marketing Budget</label>
                                            <select
                                                required
                                                value={formData.budget}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white appearance-none hover:bg-black/50 cursor-pointer glass"
                                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                            >
                                                <option value="" className="bg-zinc-900 text-zinc-500">Select a budget range...</option>
                                                <option value="<1k" className="bg-zinc-900">Less than ₹1k</option>
                                                <option value="1k-5k" className="bg-zinc-900">₹1k - ₹5k</option>
                                                <option value="5k-10k" className="bg-zinc-900">₹5k - ₹10k</option>
                                                <option value="10k+" className="bg-zinc-900">₹10k+</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1 font-heading">Your Primary Goal</label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {['Growth', 'Efficiency', 'Branding', 'Automation'].map((g) => (
                                                    <button
                                                        key={g}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, goal: g.toLowerCase() })}
                                                        className={`py-3 px-4 rounded-xl border text-xs font-medium transition-all duration-300 ${formData.goal === g.toLowerCase()
                                                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                                            : 'bg-black/40 border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/20 glass'
                                                            }`}
                                                    >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1 font-heading">Tell us about your challenges...</label>
                                            <textarea
                                                rows={4}
                                                value={formData.message}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder:text-zinc-600 resize-none hover:bg-black/50 glass"
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={status === 'submitting'}
                                                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_30px_rgba(34,211,238,0.4)] border-none rounded-xl relative overflow-hidden group/btn disabled:opacity-70"
                                            >
                                                {status === 'submitting' ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Processing...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="relative z-10">Get Your Growth Audit</span>
                                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                                    </>
                                                )}
                                            </Button>

                                            {status === 'error' && (
                                                <p className="text-red-400 text-xs text-center mt-4">
                                                    An error occurred. Please try again or email us directly.
                                                </p>
                                            )}

                                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                Founder direct response within 24 hours
                                            </div>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}

