'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function GrowthGraderPage() {
    const [step, setStep] = useState(0);

    const questions = [
        "What is your current monthly recurring revenue (ARR)?",
        "How many qualified leads are you generating monthly?",
        "What is your primary customer acquisition channel?",
        "Do you have a documented GTM strategy?"
    ];

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="container max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">
                            Interactive Assessment
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Grade Your <span className="text-gradient">Growth Engine.</span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Answer 12 specific questions and get a personalized 5-page audit
                            outlining where your funnel is leaking.
                        </p>
                    </motion.div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                        {step < questions.length ? (
                            <div className="space-y-8">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-zinc-500 text-sm font-medium">Question {step + 1} of 12</span>
                                    <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500"
                                            style={{ width: `${((step + 1) / 12) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold">{questions[step]}</h2>
                                <div className="grid gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-16 justify-between px-6 text-left border-zinc-800 hover:border-primary/50"
                                        onClick={() => setStep(step + 1)}
                                    >
                                        Option placeholder A <ArrowRight size={16} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-16 justify-between px-6 text-left border-zinc-800 hover:border-primary/50"
                                        onClick={() => setStep(step + 1)}
                                    >
                                        Option placeholder B <ArrowRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} className="text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Assessment Complete.</h2>
                                <p className="text-zinc-400">
                                    We've analyzed your responses. Entering your email below will generate your custom PDF report and Growth Grade.
                                </p>
                                <div className="max-w-md mx-auto space-y-4">
                                    <input
                                        type="email"
                                        placeholder="Enter your work email"
                                        className="w-full h-14 bg-black border border-zinc-800 rounded-xl px-6 focus:border-primary outline-none transition-all"
                                    />
                                    <Button className="w-full h-14 text-lg font-bold">
                                        Generate Report
                                    </Button>
                                    <p className="text-[10px] text-zinc-500">
                                        We respect your privacy. No spam, only engineering-led growth insights.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
