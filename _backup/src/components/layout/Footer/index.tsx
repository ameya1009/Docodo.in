'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Linkedin, Newspaper, Headphones, Loader2, Twitter, Instagram } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async () => {
        if (!email || status === 'submitting') return;

        setStatus('submitting');
        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (_error) {
            console.error('Subscription error:', _error);
            setStatus('error');
            setMessage('Failed to subscribe. Please try again.');
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            Docodo<span className={styles.circuitAccent}></span>
                        </Link>
                        <p className={styles.tagline}>
                            <strong>AI Growth OS for Pune SMBs</strong>
                            <br />Sites, Apps, Marketing & Bots.
                            <br /><span className={styles.roi}>Delivering ₹50k+/Month ROI.</span>
                        </p>
                    </div>

                    <div className={styles.links}>
                        <h4>Platform</h4>
                        <Link href="/services">Services</Link>
                        <Link href="/cases">Case Studies</Link>
                        <Link href="/pricing">Pricing</Link>
                        <Link href="/dashboard/marketplace">AI Marketplace</Link>
                    </div>

                    <div className={styles.links}>
                        <h4>Company</h4>
                        <Link href="/about">About</Link>
                        <Link href="/blog">Blog</Link>
                        <Link href="/contact">Contact</Link>
                    </div>

                    <div className={styles.newsletter}>
                        <h4>Stay Updated</h4>
                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'submitting' || status === 'success'}
                            />
                            <Button
                                size="sm"
                                onClick={handleSubscribe}
                                disabled={status === 'submitting' || status === 'success'}
                            >
                                {status === 'submitting' ? <Loader2 className="animate-spin w-4 h-4" /> : 'Subscribe'}
                            </Button>
                        </div>
                        {message && (
                            <p className={`${styles.statusMessage} ${status === 'error' ? styles.error : styles.success}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Docodo. All rights reserved.</p>
                    <div className={styles.socials}>
                        <a href="https://linkedin.com/company/docodo_in" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="LinkedIn">
                            <Linkedin size={20} />
                        </a>
                        <a href="https://twitter.com/docodo_in" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Twitter/X">
                            <Twitter size={20} />
                        </a>
                        <a href="https://instagram.com/docodo_in" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Instagram">
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
