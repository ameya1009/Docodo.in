'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Linkedin, Newspaper, Headphones, ChevronRight, Award, Shield, Zap } from 'lucide-react';
import styles from './About.module.css';

export default function AboutPage() {
    return (
        <main className={styles.aboutMain}>
            <Navbar />

            <div className="container">
                {/* Hero Section */}
                <header className={styles.hero}>
                    <motion.span
                        className={styles.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Our Genesis
                    </motion.span>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Built by Engineers.<br />
                        <span className="text-gradient">Designed for Growth.</span>
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Docodo is a strategic digital growth studio. We help founders adopt
                        scale-ready AI and automation systems without the enterprise overhead.
                    </motion.p>
                </header>

                {/* Founder Manifesto Card */}
                <section className={styles.manifestoSection}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Card className={`${styles.manifestoCard} glass`}>
                            <CardContent className={styles.manifestoLayout}>
                                <div className={styles.founderSidebar}>
                                    <div className={styles.avatarWrapper}>
                                        <div className={styles.avatarInner}>
                                            <span className={styles.avatarText}>AK</span>
                                        </div>
                                    </div>
                                    <h2 className={styles.founderName}>Ameya Kshirsagar</h2>
                                    <p className={styles.founderTitle}>Founder & Principal Engineer</p>

                                    <div className={styles.credentials}>
                                        <div className={styles.credentialItem}>
                                            <Award className="w-4 h-4 text-primary" />
                                            <span>Electronics & Telecom Engineer</span>
                                        </div>
                                        <div className={styles.credentialItem}>
                                            <Shield className="w-4 h-4 text-primary" />
                                            <span>System Architecture Specialist</span>
                                        </div>
                                    </div>

                                    <div className={styles.socialLinks}>
                                        <a href="https://www.linkedin.com/in/ameya-kshirsagar-1002" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                            <Linkedin size={20} />
                                        </a>
                                        <a href="https://medium.com/@ameyakshirsagar02" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                            <Newspaper size={20} />
                                        </a>
                                        <a href="https://open.spotify.com/episode/1ycc6RT0WXrw8yGM6yzcJk" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                            <Headphones size={20} />
                                        </a>
                                    </div>
                                </div>

                                <div className={styles.manifestoBody}>
                                    <h3 className={styles.bodyTitle}>"Hi, I’m Ameya."</h3>
                                    <p className={styles.paragraph}>
                                        I’m an engineer who transitioned from circuit design to growth architecture. I noticed a massive gap: small businesses were being sold "flashy" tools they didn't need, while missing the fundamental systems they did.
                                    </p>
                                    <p className={styles.paragraph}>
                                        I don't believe in "magic pills." I believe in <strong>Truth + Intent</strong>. My background taught me that reliability is non-negotiable. If a system isn't predictable, it's not a system—it's a liability.
                                    </p>

                                    <div className={styles.advantageBox}>
                                        <div className={styles.advantageIcon}><Zap className="w-5 h-5" /></div>
                                        <div>
                                            <h4 className={styles.advantageTitle}>The Direct-to-Founder Advantage</h4>
                                            <p className={styles.advantageDesc}>
                                                When you work with Docodo, you work with me. No layers, no account managers, and no junior interns. We move at the speed of thought.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </section>

                {/* How We Work - Card Grid */}
                <section id="how-we-work" className={styles.workflowSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className="text-gradient">High-Velocity Workflow</h2>
                        <p className={styles.sectionSubtitle}>
                            Engineering transparency into every step of our partnership.
                        </p>
                    </div>

                    <div className={styles.workflowGrid}>
                        {[
                            { step: "01", title: "Strategic Audit", desc: "A deep-dive analysis of your current pipeline to identify high-leverage growth levers." },
                            { step: "02", title: "Custom Blueprint", desc: "A fixed-price, fixed-scope architecture plan delivered within 48 hours." },
                            { step: "03", title: "Rapid Buildout", desc: "Weekly Loom updates and live staging links. You're never in the dark." },
                            { step: "04", title: "Growth Loop", desc: "Continuous refinement based on real conversion data and user behavior." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className={styles.workflowCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <span className={styles.stepNum}>{item.step}</span>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Ownership vs Avoidance */}
                <section className={styles.trustSection}>
                    <div className={styles.trustGrid}>
                        <div className={`${styles.trustBox} ${styles.trustBoxPositive}`}>
                            <h3 className={styles.boxTitle}>Total Ownership</h3>
                            <ul className={styles.checkList}>
                                {["100% IP & Source Code", "Original Figma Designs", "Self-Hosted Infrastructure", "Clean Documentation"].map((text, i) => (
                                    <li key={i}><ChevronRight className="w-4 h-4 text-primary" /> {text}</li>
                                ))}
                            </ul>
                        </div>
                        <div className={`${styles.trustBox} ${styles.trustBoxNegative}`}>
                            <h3 className={styles.boxTitle}>Fixed Principles</h3>
                            <ul className={styles.checkList}>
                                {["No Junior Outsourcing", "No Proprietary Lock-ins", "No Hidden Retainers", "No Inflated Claims"].map((text, i) => (
                                    <li key={i}><ChevronRight className="w-4 h-4 text-red-400" /> {text}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
