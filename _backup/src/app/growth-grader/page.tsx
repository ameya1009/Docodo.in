'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

const steps = [
    {
        title: "Your Business Type",
        options: ["Salon/Spa", "Medical Clinic", "Cafe/Restaurant", "Gym/Fitness", "Other SMB"]
    },
    {
        title: "Current Monthly Revenue",
        options: ["Below ₹1L", "₹1L - ₹5L", "₹5L - ₹20L", "Above ₹20L"]
    },
    {
        title: "Primary Growth Goal",
        options: ["More Walk-ins", "WhatsApp Automation", "Premium Branding", "SEO Domination"]
    }
];

export default function GrowthGraderPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsFinished(true);
        }
    };

    return (
        <main className="bg-black min-h-screen">
            <Navbar />

            <div className="container py-32 flex flex-col items-center">
                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div
                            key="step"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-zinc-900/40 border border-white/10 p-12 rounded-3xl max-w-2xl w-full"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</span>
                                <div className="flex gap-1">
                                    {steps.map((_, i) => (
                                        <div key={i} className={`h-1 w-8 rounded-full ${i <= currentStep ? 'bg-cyan-500' : 'bg-white/10'}`} />
                                    ))}
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-8">{steps[currentStep].title}</h2>

                            <div className="grid gap-4 mb-10">
                                {steps[currentStep].options.map(option => (
                                    <button
                                        key={option}
                                        onClick={handleNext}
                                        className="p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-left text-zinc-300 hover:text-cyan-400 transition-all font-medium"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center max-w-2xl"
                        >
                            <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mx-auto mb-8 shadow-[0_0_50px_rgba(0,255,255,0.2)]">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">Your Potential: <span className="text-gradient">+₹65,000/mo</span></h2>
                            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                                Our engineers analyzed your responses. You have a massive gap in **WhatsApp Automation** and **Local SEO velocity**. We can help you plug this within 14 days.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-6 mb-12">
                                <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-2xl">
                                    <Zap className="text-amber-400 mb-2 mx-auto" />
                                    <p className="text-white font-bold">Quick Win</p>
                                    <p className="text-zinc-500 text-xs text-center">Bot Automation</p>
                                </div>
                                <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-2xl">
                                    <Target className="text-cyan-400 mb-2 mx-auto" />
                                    <p className="text-white font-bold">Strategy</p>
                                    <p className="text-zinc-500 text-xs text-center">Pune Local SEO</p>
                                </div>
                                <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-2xl">
                                    <TrendingUp className="text-emerald-400 mb-2 mx-auto" />
                                    <p className="text-white font-bold">ROI</p>
                                    <p className="text-zinc-500 text-xs text-center">3.5x Forecast</p>
                                </div>
                            </div>

                            <Button size="lg" className="px-12 py-8 text-xl font-bold" onClick={() => window.location.href = '/contact'}>
                                Claim Your Growth Plan <ArrowRight className="ml-2" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </main>
    );
}
