'use client';

import { motion } from 'framer-motion';
import styles from './DifferentiationMatrix.module.css';
import { Check, X } from 'lucide-react';

const comparison = [
    {
        feature: "Engineering Rigor",
        docodo: true,
        agency: false,
        freelancer: "Maybe"
    },
    {
        feature: "Direct Founder Access",
        docodo: true,
        agency: false,
        freelancer: true
    },
    {
        feature: "Fixed-Price Guarantee",
        docodo: true,
        agency: false,
        freelancer: "Variable"
    },
    {
        feature: "Systems Thinking",
        docodo: true,
        agency: false,
        freelancer: false
    },
    {
        feature: "Retainer-Led Model",
        docodo: false,
        agency: true,
        freelancer: "Varies"
    }
];

export function DifferentiationMatrix() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Founders Choose <span className="text-gradient">Docodo.</span></h2>
                    <p className="text-zinc-400">Comparing the growth engineering approach against traditional models.</p>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th className={styles.highlight}>Docodo</th>
                                <th>Traditional Agency</th>
                                <th>Freelancer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparison.map((item, idx) => (
                                <tr key={idx}>
                                    <td className={styles.feature}>{item.feature}</td>
                                    <td className={styles.highlightCell}>
                                        {item.docodo ? <Check className="mx-auto text-primary" size={20} /> : <X className="mx-auto text-zinc-600" size={20} />}
                                    </td>
                                    <td>
                                        {item.agency ? <Check className="mx-auto text-zinc-400" size={20} /> : <X className="mx-auto text-zinc-600" size={20} />}
                                    </td>
                                    <td className={styles.freelancerText}>
                                        {typeof item.freelancer === 'string' ? item.freelancer : (item.freelancer ? <Check className="mx-auto text-zinc-400" size={20} /> : <X className="mx-auto text-zinc-600" size={20} />)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
