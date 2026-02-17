'use client';

import { AIToolsLayout } from '@/components/layout/AIToolsLayout';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Mail, Users, Dumbbell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './AiTools.module.css';

const tools = [
    {
        id: 'email-automation',
        title: 'Email Composer',
        description: 'Transform bullet points into perfectly crafted emails in seconds. Select your tone and let agents handle the nuance.',
        icon: <Mail className="w-6 h-6" />,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        href: '/ai-tools/email-automation',
        status: 'Active',
        category: 'Communication'
    },
    {
        id: 'patients-list',
        title: 'Patient Registry',
        description: 'Securely manage patient records, history, and prescriptions with AI assistance. Built for healthcare professionals.',
        icon: <Users className="w-6 h-6" />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        href: '/ai-tools/patients-list',
        status: 'Active',
        category: 'Medical'
    },
    {
        id: 'gym-management',
        title: 'FitFlow Manager',
        description: 'Automate gym memberships, track attendance, and manage growth. Streamline your facility operations.',
        icon: <Dumbbell className="w-6 h-6" />,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        href: '/ai-tools/gym-management',
        status: 'Active',
        category: 'Facility'
    }
];

const stats = [
    { label: 'Active Agents', value: '12', trend: '+2' },
    { label: 'Workflows', value: '1.2k', trend: '+12%' },
    { label: 'Time Saved', value: '450h', trend: '+8%' }
];

export default function AIToolsPage() {
    return (
        <AIToolsLayout title="Overview">
            <div className={styles.hero}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Welcome to <span className="text-primary">Intelligence</span>
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Unlock autonomous execution with Docodo agents.
                </motion.p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        className={styles.statCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                    >
                        <div className={styles.statLabel}>{stat.label}</div>
                        <div className={styles.statValue}>
                            {stat.value}
                            <span className={styles.statTrend}>{stat.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tools Section */}
            <div>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Active Applications</h2>
                    <button className="text-xs font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1 uppercase tracking-widest">
                        Browse all <ArrowRight size={14} />
                    </button>
                </div>

                <div className={styles.toolGrid}>
                    {tools.map((tool, i) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                        >
                            <Link href={tool.href} className={styles.toolCard}>
                                <div className={styles.toolCategory}>{tool.category}</div>

                                <div className={styles.toolIconWrapper}>
                                    <div className={tool.color}>{tool.icon}</div>
                                </div>

                                <div>
                                    <h3 className={styles.toolTitle}>{tool.title}</h3>
                                    <p className={styles.toolDescription}>{tool.description}</p>
                                </div>

                                <div className={styles.toolFooter}>
                                    <div className={styles.toolStatus}>
                                        <div className={`${styles.statusDot} ${styles.statusDotActive}`} />
                                        {tool.status}
                                    </div>
                                    <div className={styles.toolAction}>
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Automation Spotlight */}
            <motion.div
                className={styles.spotlightCard}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className={styles.spotlightHeader}>
                    <Sparkles className="text-primary" size={18} />
                    <span className={styles.spotlightLabel}>Pro Feature</span>
                </div>
                <h2 className={styles.spotlightTitle}>Proprietary Growth Kernels</h2>
                <p className={styles.spotlightDescription}>
                    Docodo agents are built on kernels that don&apos;t just predict text—they execute workflows.
                    Connect your tools and let the agents handle the routine.
                </p>
                <button className={styles.spotlightButton}>
                    Configure Workflows
                </button>

                <div className={styles.spotlightIcon}>
                    <Brain className="w-full h-full" />
                </div>
            </motion.div>
        </AIToolsLayout>
    );
}

