'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import styles from './WhoThisIsFor.module.css';

const criteria = {
    for: [
        "Founders with <10 employees",
        "Businesses needing systems, not just tasks",
        "Teams that value speed over bureaucracy",
        "Founders willing to invest in long-term growth"
    ],
    notFor: [
        "Enterprise-scale infrastructure needs",
        "Companies wanting a full-time in-house team",
        "Low-budget/price-only shoppers",
        "Anyone expecting overnight results"
    ]
};

export function WhoThisIsFor() {
    return (
        <section className="section">
            <div className="container">
                <div className={styles.header}>
                    <h2 className="text-gradient">Is Docodo Right for You?</h2>
                    <p className={styles.subtitle}>
                        We build trust through clarity. We&apos;re not the right fit for everyone,
                        and we&apos;re okay with that.
                    </p>
                </div>

                <div className={styles.grid}>
                    <motion.div
                        className={styles.card}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className={styles.cardTitle}>This is for you if:</h3>
                        <ul className={styles.list}>
                            {criteria.for.map((item, i) => (
                                <li key={i} className={styles.listItem}>
                                    <Check className="w-5 h-5 text-primary shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        className={styles.card}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className={styles.cardTitle}>This is NOT for you if:</h3>
                        <ul className={styles.list}>
                            {criteria.notFor.map((item, i) => (
                                <li key={i} className={styles.listItem}>
                                    <X className="w-5 h-5 text-red-500 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
