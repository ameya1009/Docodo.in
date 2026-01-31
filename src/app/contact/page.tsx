'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        business: '',
        email: '',
        budget: '',
        goal: 'growth',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle submission logic
        console.log(formData);
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
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">

                        {/* Ambient Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="text-center mb-10 relative z-10">
                            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-zinc-400 mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                Start Your Transformation
                            </h1>
                            <p className="text-zinc-400 text-lg">
                                Tell us about your business, and we'll engineer your growth.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider pl-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder:text-zinc-600 hover:bg-black/50"
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider pl-1">Business Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Acme Inc."
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder:text-zinc-600 hover:bg-black/50"
                                        onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder:text-zinc-600 hover:bg-black/50"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Current Monthly Marketing Budget</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white appearance-none hover:bg-black/50 cursor-pointer"
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                >
                                    <option value="" className="bg-zinc-900 text-zinc-500">Select a budget range...</option>
                                    <option value="<1k" className="bg-zinc-900">Less than $1k</option>
                                    <option value="1k-5k" className="bg-zinc-900">$1k - $5k</option>
                                    <option value="5k-10k" className="bg-zinc-900">$5k - $10k</option>
                                    <option value="10k+" className="bg-zinc-900">$10k+</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">What is your primary goal?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Growth', 'Efficiency', 'Branding', 'Automation'].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, goal: g.toLowerCase() })}
                                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-300 ${formData.goal === g.toLowerCase()
                                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                                : 'bg-black/40 border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/20'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Tell us about your challenges...</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder:text-zinc-600 resize-none hover:bg-black/50"
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_30px_rgba(34,211,238,0.4)] border-none rounded-xl mt-4">
                                Get Your Growth Audit
                            </Button>

                            <p className="text-center text-xs text-zinc-600 mt-4">
                                By submitting, you agree to receive an automated analysis of your business via email/WhatsApp.
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
