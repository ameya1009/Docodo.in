'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from './PortfolioPreview.module.css';

const projects = [
    {
        title: 'Neon Fintech Portal',
        category: 'SaaS Design',
        color: '#00E5FF',
    },
    {
        title: 'Aura Wellness',
        category: 'Brand Identity',
        color: '#7C3AED',
    },
    {
        title: 'Nexus AI Dashboard',
        category: 'Product Design',
        color: '#F59E0B',
    },
];

export function PortfolioPreview() {
    return (
        <section className="section">
            <div className="container">
                <div className={styles.header}>
                    <h2 className="text-gradient">Recent Work</h2>
                    <Button variant="outline">View All Work</Button>
                </div>

                <div className={styles.grid}>
                    {projects.map((project, index) => (
                        <Card key={index} className={styles.projectCard}>
                            <div
                                className={styles.projectImage}
                                style={{ background: `linear-gradient(135deg, ${project.color}20, ${project.color}80)` }}
                            />
                            <div className={styles.projectInfo}>
                                <h3>{project.title}</h3>
                                <p>{project.category}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
