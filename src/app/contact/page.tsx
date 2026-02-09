'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import styles from './Contact.module.css';

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
        <main className={styles.pageWrapper}>
            <Navbar />

            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className={styles.card}>
                        <div className={styles.glowPrimary} />
                        <div className={styles.glowSecondary} />

                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    className={styles.successState}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className={styles.successIcon}>
                                        <CheckCircle2 className="w-12 h-12" />
                                    </div>
                                    <h2 className="text-4xl font-bold mb-4">Inquiry Received</h2>
                                    <p className="text-zinc-400 mb-10 max-w-md mx-auto text-lg">
                                        Our growth engineering team has been notified.
                                        The founder will reach out directly within 24 hours.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setStatus('idle')}
                                        className="rounded-xl px-8 h-12"
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
                                    <header className={styles.header}>
                                        <motion.span
                                            className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            Get Your Growth Audit
                                        </motion.span>
                                        <h1 className={styles.title}>
                                            Start Your <span className="text-gradient">Transformation.</span>
                                        </h1>
                                        <p className={styles.subtitle}>
                                            Tell us about your business, and we&apos;ll engineer
                                            the systems required for your next stage of growth.
                                        </p>
                                    </header>

                                    <form onSubmit={handleSubmit} className={styles.formGrid}>
                                        <div className={styles.fieldGroup}>
                                            <label className={styles.label}>Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                placeholder="John Doe"
                                                className={styles.input}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.fieldGroup}>
                                            <label className={styles.label}>Business Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.business}
                                                placeholder="Acme Inc."
                                                className={styles.input}
                                                onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.fieldGroup}>
                                            <label className={styles.label}>Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                placeholder="john@example.com"
                                                className={styles.input}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.fieldGroup}>
                                            <label className={styles.label}>Monthly Budget</label>
                                            <select
                                                required
                                                value={formData.budget}
                                                className={styles.select}
                                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                            >
                                                <option value="" disabled>Select a budget range...</option>
                                                <option value="<1k">Less than ₹1k</option>
                                                <option value="1k-5k">₹1k - ₹5k</option>
                                                <option value="5k-10k">₹5k - ₹10k</option>
                                                <option value="10k+">₹10k+</option>
                                            </select>
                                        </div>

                                        <div className={styles.fullWidth}>
                                            <div className={styles.fieldGroup}>
                                                <label className={styles.label}>Your Primary Goal</label>
                                                <div className={styles.goalGrid}>
                                                    {['Growth', 'Efficiency', 'Branding', 'Automation'].map((g) => (
                                                        <button
                                                            key={g}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, goal: g.toLowerCase() })}
                                                            className={`${styles.goalButton} ${formData.goal === g.toLowerCase() ? styles.goalButtonActive : ''}`}
                                                        >
                                                            {g}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.fullWidth}>
                                            <div className={styles.fieldGroup}>
                                                <label className={styles.label}>Challenges & Context</label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.message}
                                                    placeholder="Tell us about your current constraints..."
                                                    className={styles.textarea}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.fullWidth}>
                                            <button
                                                type="submit"
                                                disabled={status === 'submitting'}
                                                className={`${styles.submitButton} w-full flex items-center justify-center gap-3`}
                                            >
                                                {status === 'submitting' ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Deploy Growth Audit</span>
                                                        <ArrowRight className="w-6 h-6" />
                                                    </>
                                                )}
                                            </button>

                                            {status === 'error' && (
                                                <p className="text-red-400 text-sm text-center mt-4">
                                                    {errorMessage}
                                                </p>
                                            )}

                                            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-zinc-500">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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

            <Footer />
        </main>
    );
}
