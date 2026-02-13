'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Linkedin, Newspaper, Headphones, ChevronRight, Award, Shield, Zap, Target, Rocket, Users } from 'lucide-react';
import styles from './About.module.css';

export default function AboutPage() {
    const router = useRouter();
    return (
        <main className={styles.aboutPage}>
            <Navbar />

            {/* Smarketers-Grade Hero: Huge Spacing & Asymmetric Intro */}
            <section className={styles.heroSection}>
                <div className="container">
                    <div className={styles.heroLayout}>
                        <motion.div
                            className={styles.heroContent}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className={styles.kicker}>The Docodo Story</span>
                            <h1 className={styles.headline}>
                                We're not an agency.<br />
                                We're your <span className="text-gradient">Growth Engineers.</span>
                            </h1>
                            <p className={styles.introPara}>
                                Founded by an electronics engineer, Docodo was built on a simple premise:
                                Marketing is just another system to be optimized. We've stripped away the fluff
                                and high-agency overhead to build high-velocity growth engines for founders.
                            </p>
                        </motion.div>
                        <div className={styles.heroVisualSpace}>
                            <div className={styles.watermarkText}>GENESIS</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder Manifesto: Split Screen Asymmetry */}
            <section className={styles.founderSection}>
                <div className="container">
                    <div className={styles.manifestoGrid}>
                        <div className={styles.founderBio}>
                            <div className={styles.stickyBio}>
                                <div className={styles.headshotContainer}>
                                    <div className={styles.headshotInner}>
                                        <span className={styles.initials}>AK</span>
                                    </div>
                                </div>
                                <h2 className={styles.bioName}>Ameya Kshirsagar</h2>
                                <p className={styles.bioTitle}>Founder & Principal Architect</p>
                                <div className={styles.bioSocial}>
                                    <a href="https://www.linkedin.com/in/ameya-kshirsagar-1002" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
                                    <a href="https://medium.com/@ameyakshirsagar02" target="_blank" rel="noopener noreferrer"><Newspaper size={20} /></a>
                                    <a href="https://open.spotify.com/episode/1ycc6RT0WXrw8yGM6yzcJk" target="_blank" rel="noopener noreferrer"><Headphones size={20} /></a>
                                </div>
                            </div>
                        </div>
                        <div className={styles.manifestoContent}>
                            <div className={styles.contentBlock}>
                                <span className={styles.blockLabel}>01 / Origin Story</span>
                                <h3 className={styles.blockTitle}>From Electronics to Growth Engines</h3>
                                <div className={styles.manifestoQuote}>
                                    <p className={styles.leadText}>
                                        "Marketing is just a circuit that hasn't been optimized yet."
                                    </p>
                                    <p>
                                        I spent years designing electronics where a single loose connection means failure.
                                        I carry that same rigor into digital growth. At Docodo, we don't guess. We architect.
                                    </p>
                                    <p className={styles.placeholderNote}>
                                        {/* Founder: Replace this block with your 300-word origin story regarding Docodo's genesis and your engineering advantage. */}
                                        The agency model is broken. Founders don't need more "creative brainstorming"—they need predictable revenue systems that scale without breaking.
                                        Docodo was founded to bridge the gap between product excellence and market dominance through engineering-led GTM.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.contentBlock}>
                                <span className={styles.blockLabel}>02 / The Philosophy</span>
                                <h3 className={styles.blockTitle}>Systems Over Splashes</h3>
                                <p>
                                    Traditional marketing is built on "splashes"—momentary bursts of attention. We build steady-state engines.
                                    Every line of code and every automation node we build has a singular intent: <strong>measurable revenue efficiency.</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vertical Timeline: Smarketers Style Workflow */}
            <section className={styles.timelineSection}>
                <div className="container">
                    <div className={styles.sectionHeading}>
                        <h2 className="text-gradient">How We Engineer Growth</h2>
                        <p className={styles.headingSubtitle}>A precise, four-stage protocol for scaling systems without friction.</p>
                    </div>

                    <div className={styles.timelineWrapper}>
                        <div className={styles.timelineLine} />

                        {[
                            {
                                id: "01",
                                title: "Systems Audit",
                                desc: "No pitch decks. We dive into your current stack to find leaks in your funnel that are costing you CAC efficiency.",
                                icon: <Target className="w-6 h-6" />
                            },
                            {
                                id: "02",
                                title: "Blueprint Phase",
                                desc: "We deliver a technical architecture map within 48 hours. You see the solution before we write a single line of code.",
                                icon: <Zap className="w-6 h-6" />
                            },
                            {
                                id: "03",
                                title: "High-Velocity Buildout",
                                desc: "Weekly drops. Live staging. Immediate feedback loops. We build in the open so you always know where your investment is.",
                                icon: <Rocket className="w-6 h-6" />
                            },
                            {
                                id: "04",
                                title: "Growth Optimization",
                                desc: "We don't hand over and leave. We monitor, refine, and optimize the automation to ensure long-term ROI.",
                                icon: <Users className="w-6 h-6" />
                            }
                        ].map((step, idx) => (
                            <motion.div
                                key={step.id}
                                className={`${styles.timelineItem} ${idx % 2 === 0 ? styles.itemLeft : styles.itemRight}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className={styles.timelinePoint}>
                                    <div className={styles.pointInner}>{step.icon}</div>
                                </div>
                                <div className={styles.timelineCard}>
                                    <span className={styles.stepId}>{step.id}</span>
                                    <h4>{step.title}</h4>
                                    <p>{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Trust Layout: Huge Typography */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <div className={styles.ctaWrapper}>
                        <h2 className={styles.ctaHeadline}>
                            Ready to stop guessing and<br />
                            <span className="text-gradient">start engineering?</span>
                        </h2>
                        <div className={styles.ctaButtons}>
                            <button className="btn btn-primary" onClick={() => router.push('/contact')}>
                                Book a Growth Audit
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
