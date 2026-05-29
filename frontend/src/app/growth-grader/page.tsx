'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight, Zap, Target, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
    businessType: z.string().min(1, 'Please select your business type'),
    monthlyRevenue: z.string().min(1, 'Please select your revenue range'),
    growthGoal: z.string().min(1, 'Please select your primary goal'),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
    {
        id: 'businessType',
        title: "What type of business do you run?",
        options: ["Salon/Spa", "Medical Clinic", "Cafe/Restaurant", "Gym/Fitness", "Consulting", "Other SMB"]
    },
    {
        id: 'monthlyRevenue',
        title: "What is your current monthly revenue?",
        options: ["Below ₹1L", "₹1L - ₹5L", "₹5L - ₹15L", "Above ₹15L"]
    },
    {
        id: 'growthGoal',
        title: "What is your primary growth goal?",
        options: ["More Footfall", "Automate Bookings via WhatsApp", "Premium Brand Perception", "Rank #1 on Google Maps"]
    }
];

export default function GrowthGraderPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            businessType: '',
            monthlyRevenue: '',
            growthGoal: '',
        }
    });

    const watchAll = watch();

    const onSubmit = (data: FormData) => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setIsFinished(true);
        }, 2500);
    };

    const handleNext = () => {
        const currentFieldId = steps[currentStep].id as keyof FormData;
        if (!watchAll[currentFieldId]) return;

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit(onSubmit)();
        }
    };

    const handleOptionSelect = (option: string) => {
        const currentFieldId = steps[currentStep].id as keyof FormData;
        setValue(currentFieldId, option, { shouldValidate: true });
        // Automatically go to next step after slight delay for UX
        setTimeout(() => {
            handleNext();
        }, 300);
    };

    return (
        <main className="bg-[#0F0F0F] min-h-screen relative overflow-hidden">
            {/* 3D Video Background */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-10 pointer-events-none">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-hologram-of-a-planet-in-a-dark-room-4165-large.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="relative z-10">
                <Navbar />

                <div className="container min-h-[80vh] flex flex-col items-center justify-center pt-32 pb-20 px-4">
                    <AnimatePresence mode="wait">
                        {!isFinished && !isGenerating ? (
                            <motion.div
                                key="step"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-[#0F0F0F]/80 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-[0_0_50px_rgba(16,185,129,0.05)] max-w-3xl w-full"
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <span className="text-emerald-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        Step {currentStep + 1} of {steps.length}
                                    </span>
                                    <div className="flex gap-2">
                                        {steps.map((_, i) => (
                                            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-8 bg-emerald-400' : 'w-4 bg-white/10'}`} />
                                        ))}
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">{steps[currentStep].title}</h2>

                                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                    {steps[currentStep].options.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => handleOptionSelect(option)}
                                            className={`p-6 rounded-2xl border text-left font-medium transition-all duration-300 ${
                                                watchAll[steps[currentStep].id as keyof FormData] === option
                                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02]'
                                                    : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                
                                {errors[steps[currentStep].id as keyof FormData] && (
                                    <p className="text-red-400 text-sm mb-4">
                                        {errors[steps[currentStep].id as keyof FormData]?.message}
                                    </p>
                                )}

                                <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
                                    <button 
                                        className="text-zinc-500 hover:text-white font-medium disabled:opacity-50 transition-colors"
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                        disabled={currentStep === 0}
                                    >
                                        Back
                                    </button>
                                    <Button
                                        variant="primary"
                                        onClick={handleNext}
                                        className="gap-2 bg-emerald-500 text-black hover:bg-emerald-400"
                                        disabled={!watchAll[steps[currentStep].id as keyof FormData]}
                                    >
                                        {currentStep === steps.length - 1 ? 'Analyze Growth' : 'Continue'} <ArrowRight size={16} />
                                    </Button>
                                </div>
                            </motion.div>
                        ) : isGenerating ? (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center max-w-xl w-full p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl"
                            >
                                <div className="w-24 h-24 mx-auto relative mb-8">
                                    <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-emerald-400 rounded-full border-t-transparent animate-spin" />
                                    <Sparkles className="absolute inset-0 m-auto text-emerald-400 w-8 h-8 animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Analyzing Business Profile...</h3>
                                <p className="text-zinc-400">Our AI agents are scanning competitors and computing your total addressable market in Pune.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-4xl w-full"
                            >
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-6 ring-1 ring-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                                        <CheckCircle2 size={40} className="text-emerald-400" />
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                                        Your Potential: <br className="hidden md:block" />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">+₹85,000/mo</span>
                                    </h2>
                                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                        We analyzed your responses. You have a massive gap in <strong>WhatsApp Automation</strong> and <strong>Local SEO velocity</strong>. We can plug this within 14 days.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                    <div className="p-8 bg-[#0F0F0F] border border-white/10 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:bg-emerald-500/20 transition-colors" />
                                        <Zap className="text-emerald-400 mb-6 w-8 h-8" />
                                        <p className="text-white font-bold text-xl mb-2">Quick Win</p>
                                        <p className="text-zinc-400 text-sm leading-relaxed">Implement AI-driven WhatsApp booking flow to capture after-hours queries.</p>
                                    </div>
                                    <div className="p-8 bg-[#0F0F0F] border border-white/10 rounded-3xl relative overflow-hidden group hover:border-sapphire-500/50 transition-colors">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-sapphire-500/10 rounded-bl-full -z-10 group-hover:bg-sapphire-500/20 transition-colors" />
                                        <Target className="text-sapphire-400 mb-6 w-8 h-8" />
                                        <p className="text-white font-bold text-xl mb-2">Strategy</p>
                                        <p className="text-zinc-400 text-sm leading-relaxed">Dominate "near me" searches in Pune with our hyper-local SEO blueprint.</p>
                                    </div>
                                    <div className="p-8 bg-[#0F0F0F] border border-white/10 rounded-3xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full -z-10 group-hover:bg-cyan-500/20 transition-colors" />
                                        <TrendingUp className="text-cyan-400 mb-6 w-8 h-8" />
                                        <p className="text-white font-bold text-xl mb-2">Forecast</p>
                                        <p className="text-zinc-400 text-sm leading-relaxed">Based on similar {watchAll.businessType} clients, expect a 3.5x ROI within 60 days.</p>
                                    </div>
                                </div>

                                <div className="text-center p-8 md:p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
                                    <h3 className="text-2xl font-bold text-white mb-4">Ready to unlock this revenue?</h3>
                                    <p className="text-zinc-400 mb-8 max-w-lg mx-auto">Book a 15-minute alignment call with Ameya to review this exact blueprint for your business.</p>
                                    <Button size="lg" className="w-full sm:w-auto px-12 py-6 text-lg font-bold bg-emerald-500 text-black hover:bg-emerald-400" onClick={() => window.location.href = '/contact'}>
                                        Claim Your Growth Plan <ArrowRight className="ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Footer />
            </div>
        </main>
    );
}
