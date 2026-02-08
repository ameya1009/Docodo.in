'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatDemo } from '@/components/demos/ChatDemo';
import { motion } from 'framer-motion';
import { Brain, Cpu, Shield, Workflow, Sparkles } from 'lucide-react';
import styles from './AiTools.module.css';

const agents = [
    {
        icon: <Brain />,
        title: 'Strategic Reasoning',
        description: 'Our agents don\'t just follow scripts. They understand context, intent, and complex business logic.'
    },
    {
        icon: <Cpu />,
        title: 'Autonomous Execution',
        description: 'From research to execution, Docodo tools handle the horizontal complexity of growth operations.'
    },
    {
        icon: <Shield />,
        title: 'Trust-First AI',
        description: 'Private, secure, and accurate. We prioritize data integrity and honest AI representation.'
    }
];

export default function AIToolsPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            <section className={styles.hero}>
                <div className="container">
                    <motion.span
                        className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Intelligence Suite
                    </motion.span>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Truth + <span className="text-gradient">Intent.</span>
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Experience the power of autonomous agents engineered for professional growth.
                        No hype, just high-performance execution.
                    </motion.p>
                </div>
            </section>

            <div className="container">
                <motion.section
                    className={styles.demoSection}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="glass rounded-[2rem] p-4 md:p-8">
                        <ChatDemo />
                    </div>
                </motion.section>

                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <a href="/ai-tools/email-automation" className="block group">
                            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-primary/50 transition-all h-full">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Email Automation</h3>
                                <p className="text-zinc-400 text-sm">Instantly draft professional emails with tone control and key point expansion.</p>
                            </div>
                        </a>
                    </motion.div>

                    {/* Placeholder for Patients List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <a href="/ai-tools/patients-list" className="block group">
                            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-primary/50 transition-all h-full">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">Patient Management</h3>
                                <p className="text-zinc-400 text-sm">Securely manage patient records, history, and prescriptions with AI assistance.</p>
                            </div>
                        </a>
                    </motion.div>

                    {/* Placeholder for Gym Management */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <a href="/ai-tools/gym-management" className="block group">
                            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-primary/50 transition-all h-full">
                                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                                    <Cpu size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">FitFlow Manager</h3>
                                <p className="text-zinc-400 text-sm">Automate gym memberships, track attendance, and manage growth.</p>
                            </div>
                        </a>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center py-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6">Beyond Mockups. <span className="text-primary">Actual Results.</span></h2>
                        <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                            Docodo agents are built on proprietary growth kernels. They don&apos;t just predict text;
                            they execute workflows that move the needle.
                        </p>
                        <div className="space-y-6">
                            {agents.map((agent, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        {agent.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">{agent.title}</h4>
                                        <p className="text-zinc-500 text-sm">{agent.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.visualWrapper}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className={styles.visualGlow} />
                        <Workflow className="w-24 h-24 text-primary opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 border border-primary/20 rounded-full animate-ping opacity-10" />
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

