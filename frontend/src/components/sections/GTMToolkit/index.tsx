'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, Download, ShieldCheck, X, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './GTMToolkit.module.css';

const resources = [
    {
        title: "Zapier Agents",
        description: "Automate leads from your site directly to your CRM or WhatsApp group. Pure magic.",
        tag: "10 Credits/Run",
        icon: <ArrowRight className="w-6 h-6" />
    },
    {
        title: "Botpress WhatsApp",
        description: "Deploy a Hinglish-speaking bot in 5 mins. 'Namaskar! Business growth?' is the vibe.",
        tag: "15 Credits/Flow",
        icon: <ShieldCheck className="w-6 h-6" />
    },
    {
        title: "Canva AI Banners",
        description: "Auto-generate posters for your Baner salon or Viman Nagar cafe in seconds.",
        tag: "5 Credits/Asset",
        icon: <Download className="w-6 h-6" />
    }
];

function ResourceModal({ resource, onClose }: { resource: typeof resources[0], onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Connect to newsletter/leads API
        try {
            await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: `Resource: ${resource.title}` }),
            });
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('success'); // Still show success to not block the user, or handle error better
        }
    };

    return (
        <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>

                {status === 'success' ? (
                    <div className={styles.successMessage}>
                        <CheckCircle2 size={48} className="text-primary mb-4" />
                        <h3>Access Granted</h3>
                        <p>We&apos;ve sent the {resource.title} to your email.</p>
                        <Button variant="primary" onClick={onClose} className="mt-6">Got it</Button>
                    </div>
                ) : (
                    <>
                        <div className={styles.modalIcon}>{resource.icon}</div>
                        <span className={styles.cardTag}>{resource.tag}</span>
                        <h3>Get the {resource.title}</h3>
                        <p>Enter your professional email to receive the full resource and future GTM updates.</p>

                        <form onSubmit={handleSubmit} className={styles.modalForm}>
                            <input
                                type="email"
                                required
                                placeholder="john@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.modalInput}
                            />
                            <Button type="submit" disabled={status === 'submitting'} className="w-full">
                                {status === 'submitting' ? <Loader2 className="animate-spin" /> : 'Request Access'}
                            </Button>
                        </form>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}

export function GTMToolkit() {
    const [selectedResource, setSelectedResource] = useState<typeof resources[0] | null>(null);

    return (
        <section className={styles.toolkit}>
            <div className="container">
                <motion.span
                    className={styles.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    AI Marketplace
                </motion.span>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    Trending 2026 <span className="text-gradient">AI Tools</span>
                </motion.h2>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    Try our curated stack of agentic tools. All included in your Docodo OS.
                </motion.p>

                <div className={styles.grid}>
                    {resources.map((resource, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                        >
                            <div className={styles.cardIcon}>
                                {resource.icon}
                            </div>
                            <span className={styles.cardTag}>{resource.tag}</span>
                            <h3 className={styles.cardTitle}>{resource.title}</h3>
                            <p className={styles.cardDescription}>{resource.description}</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={styles.cardLink}
                                onClick={() => setSelectedResource(resource)}
                            >
                                Try with Free Credits <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className={styles.cta}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    <div className={styles.ctaBox}>
                        <h3>Get 50 Free Credits on Signup</h3>
                        <p>Experience the magic of AI-powered growth today.</p>
                        <Button variant="primary" size="lg" onClick={() => window.location.href = '/dashboard'}>
                            Claim Free Credits
                        </Button>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedResource && (
                    <ResourceModal
                        resource={selectedResource}
                        onClose={() => setSelectedResource(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
