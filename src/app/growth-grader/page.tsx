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
        { q: "Current Monthly Recurring Revenue (ARR)?", options: ["<$100k", "$100k - $500k", "$500k - $1M", "$1M+"] },
        { q: "Your primary customer acquisition channel?", options: ["Organic/SEO", "Paid Ads", "Outbound/Sales", "Referrals"] },
        { q: "Average Customer Acquisition Cost (CAC)?", options: ["High/Unknown", "Sustainable", "Very Efficient", "N/A"] },
        { q: "Is your GTM strategy documented?", options: ["No", "Partially", "Yes, fully", "Currently refining"] },
        { q: "Landing page conversion rate?", options: ["<1%", "1-3%", "3-5%", ">5%"] },
        { q: "Number of qualified leads per month?", options: ["<10", "10-50", "50-200", ">200"] },
        { q: "Are your sales processes automated?", options: ["Manual mostly", "Some automation", "Highly optimized", "N/A"] },
        { q: "Current tech stack complexity?", options: ["Simple/Standard", "Complex/Fragmented", "Enterprise grade", "N/A"] },
        { q: "Do you have a dedicated growth team?", options: ["Just me (Founder)", "Small team", "Full department", "Outsourced"] },
        { q: "Time to launch new marketing assets?", options: ["Days", "Weeks", "Months", "N/A"] },
        { q: "Confidence in current growth data?", options: ["Low", "Moderate", "High", "Crystal Clear"] },
        { q: "What's the biggest bottleneck right now?", options: ["Lead Gen", "Conversion", "Operations", "Strategy"] }
    ];

    const [answers, setAnswers] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'grading' | 'success' | 'error'>('grading');

    const handleAnswer = (option: string) => {
        setAnswers([...answers, option]);
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setStatus('grading');
        try {
            const res = await fetch('/api/growth-grader', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, answers })
            });
            if (res.ok) setStatus('success');
            else setStatus('error');
        } catch (err) {
            setStatus('error');
        }
    };

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
                                <h2 className="text-2xl font-bold">{questions[step].q}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {questions[step].options.map((option, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outline"
                                            className="h-16 justify-between px-6 text-left border-zinc-800 hover:border-primary/50"
                                            onClick={() => handleAnswer(option)}
                                        >
                                            {option} <ArrowRight size={16} />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-6">
                                {status === 'success' ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 size={32} className="text-primary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Analysis Ready!</h2>
                                        <p className="text-zinc-400">
                                            Your 5-page audit has been sent to <strong>{email}</strong>.
                                            Check your inbox (and spam just in case) for your Growth Grade.
                                        </p>
                                        <Button className="mt-6" onClick={() => window.location.href = '/'}>
                                            Return Home
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div className="max-w-md mx-auto space-y-4">
                                        <h2 className="text-2xl font-bold">Assessment Complete.</h2>
                                        <p className="text-zinc-400">
                                            We&apos;ve analyzed your responses. Entering your email below will generate your custom PDF report.
                                        </p>
                                        <input
                                            type="email"
                                            placeholder="Enter your work email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-14 bg-black border border-zinc-800 rounded-xl px-6 focus:border-primary outline-none transition-all"
                                        />
                                        <Button
                                            className="w-full h-14 text-lg font-bold"
                                            onClick={handleSubmit}
                                            disabled={status === 'grading' && email !== ''}
                                        >
                                            {status === 'grading' ? 'Analyzing...' : 'Generate Report'}
                                        </Button>
                                        <p className="text-[10px] text-zinc-500">
                                            We respect your privacy. No spam, only engineering-led growth insights.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
