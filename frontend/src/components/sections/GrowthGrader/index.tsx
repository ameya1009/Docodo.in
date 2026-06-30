'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Target, Zap, TrendingUp, BarChart3, CheckCircle2, ArrowRight, Activity, Loader2 } from 'lucide-react';

const questions = [
    {
        id: 'q1',
        title: "How do you currently acquire new leads?",
        options: [
            { label: "Referrals & Word of Mouth", score: 10 },
            { label: "Cold Outreach / Manual Sales", score: 20 },
            { label: "Basic Ads (Meta/Google)", score: 30 },
            { label: "Automated Funnels & AI Bots", score: 50 },
        ]
    },
    {
        id: 'q2',
        title: "What is your main bottleneck right now?",
        options: [
            { label: "Not enough traffic", score: 20 },
            { label: "Low conversion rate", score: 15 },
            { label: "High customer acquisition cost", score: 30 },
            { label: "Manual operational overhead", score: 40 },
        ]
    },
    {
        id: 'q3',
        title: "Are you using AI in your daily operations?",
        options: [
            { label: "Not at all", score: 5 },
            { label: "Just ChatGPT occasionally", score: 15 },
            { label: "Some automated workflows", score: 35 },
            { label: "Fully agentic AI systems", score: 50 },
        ]
    }
];

export function GrowthGrader() {
    const [step, setStep] = useState<'intro' | 'quiz' | 'analyzing' | 'result'>('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);

    const handleStart = () => setStep('quiz');

    const handleAnswer = (points: number) => {
        setScore(prev => prev + points);
        if (currentQ < questions.length - 1) {
            setCurrentQ(prev => prev + 1);
        } else {
            setStep('analyzing');
            setTimeout(() => {
                setStep('result');
            }, 2500);
        }
    };

    return (
        <section className="section bg-[#07060A] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-mint-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0E0C15]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden min-h-[500px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {/* INTRO STEP */}
                            {step === 'intro' && (
                                <motion.div
                                    key="intro"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    className="text-center w-full"
                                >
                                    <div className="flex justify-center gap-3 mb-8">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint-500/10 border border-mint-500/20 text-mint-400 text-xs font-bold uppercase tracking-widest">
                                            <Zap size={14} /> Strategic
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest">
                                            <Target size={14} /> Precise
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                                        Stop guessing. <br className="hidden md:block" />Start <span className="text-gradient">Scaling.</span>
                                    </h2>
                                    
                                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                                        Take our interactive 3-step Growth Audit. Discover exactly where your business is bleeding revenue and unlock your AI-driven growth potential.
                                    </p>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
                                        <div className="flex items-center gap-3 text-zinc-300">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                                <TrendingUp size={18} className="text-mint-400" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">2 Minutes</div>
                                                <div className="text-xs text-zinc-500">To Complete</div>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block w-[1px] h-10 bg-white/10" />
                                        <div className="flex items-center gap-3 text-zinc-300">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                                <BarChart3 size={18} className="text-violet-400" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">Instant ROI</div>
                                                <div className="text-xs text-zinc-500">Custom Action Plan</div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        className="bg-white text-black hover:bg-zinc-200 font-black px-10 h-14 rounded-xl text-lg tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                                        onClick={handleStart}
                                    >
                                        Start Free Audit <ArrowRight className="ml-2" />
                                    </Button>
                                </motion.div>
                            )}

                            {/* QUIZ STEP */}
                            {step === 'quiz' && (
                                <motion.div
                                    key="quiz"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="w-full max-w-2xl mx-auto"
                                >
                                    <div className="mb-8">
                                        <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                                            <span>Question {currentQ + 1} of {questions.length}</span>
                                            <span className="text-mint-400">{Math.round(((currentQ) / questions.length) * 100)}% Completed</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-gradient-to-r from-mint-500 to-violet-500"
                                                initial={{ width: `${(currentQ / questions.length) * 100}%` }}
                                                animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-black text-white mb-10 leading-tight">
                                        {questions[currentQ].title}
                                    </h3>

                                    <div className="grid gap-4">
                                        {questions[currentQ].options.map((opt, i) => (
                                            <motion.button
                                                key={i}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleAnswer(opt.score)}
                                                className="w-full text-left p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group flex items-center justify-between"
                                            >
                                                <span className="text-lg font-semibold text-zinc-300 group-hover:text-white transition-colors">
                                                    {opt.label}
                                                </span>
                                                <div className="w-6 h-6 rounded-full border-2 border-white/20 group-hover:border-mint-400 group-hover:bg-mint-400/20 transition-all flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-mint-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* ANALYZING STEP */}
                            {step === 'analyzing' && (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="text-center w-full"
                                >
                                    <div className="relative w-32 h-32 mx-auto mb-8">
                                        <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                                        <motion.div 
                                            className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center text-violet-400">
                                            <Activity size={40} />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4">Running Neural Analysis...</h3>
                                    <p className="text-zinc-400 text-lg">Synthesizing data points and calculating growth vectors.</p>
                                    
                                    <div className="mt-8 space-y-3 max-w-sm mx-auto text-left">
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-3 text-sm text-zinc-500"><CheckCircle2 size={16} className="text-mint-400" /> Analyzing lead velocity</motion.div>
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="flex items-center gap-3 text-sm text-zinc-500"><CheckCircle2 size={16} className="text-mint-400" /> Checking conversion bottlenecks</motion.div>
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex items-center gap-3 text-sm text-zinc-500"><CheckCircle2 size={16} className="text-mint-400" /> Compiling AI readiness score</motion.div>
                                    </div>
                                </motion.div>
                            )}

                            {/* RESULT STEP */}
                            {step === 'result' && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center w-full"
                                >
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-mint-400 to-emerald-600 mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                                        <span className="text-4xl font-black text-white">{Math.min(score, 99)}</span>
                                    </div>
                                    
                                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                                        Your Growth Score is <span className="text-mint-400">Solid, but Leaking.</span>
                                    </h3>
                                    
                                    <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                                        Our analysis indicates you have a <strong className="text-white">high potential for scale</strong>, but you are losing approximately 35% of revenue to manual bottlenecks and un-optimized funnels.
                                    </p>

                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-lg mx-auto mb-10 text-left">
                                        <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Target size={18} className="text-violet-400" /> Recommended Action Plan:</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-sm text-zinc-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                                                Implement AI Lead Qualification Agents to instantly engage traffic.
                                            </li>
                                            <li className="flex items-start gap-3 text-sm text-zinc-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                                                Transition from manual sales to an automated B2B pipeline.
                                            </li>
                                        </ul>
                                    </div>

                                    <Button 
                                        className="bg-white text-black hover:bg-zinc-200 font-black px-10 h-14 rounded-xl text-lg tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.2)] w-full sm:w-auto"
                                        onClick={() => window.location.href = '/contact'}
                                    >
                                        Claim Your Full PDF Report
                                    </Button>
                                    <button 
                                        onClick={() => { setStep('intro'); setScore(0); setCurrentQ(0); }}
                                        className="block mx-auto mt-6 text-sm text-zinc-500 hover:text-white transition-colors"
                                    >
                                        Retake Audit
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
