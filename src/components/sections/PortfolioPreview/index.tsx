'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from './PortfolioPreview.module.css';

const projects = [
    {
        title: 'Scaling Neon Fintech (+40% CAC Efficiency)',
        category: 'High-Velocity GTM System',
        color: '#00E5FF',
    },
    {
        title: '3x Direct Revenue for Aura Wellness',
        category: 'Authority & Brand Transformation',
        color: '#7C3AED',
    },
    {
        title: 'Nexus AI: Engineered for Product-Led Growth',
        category: 'Full-Stack Performance Architecture',
        color: '#F59E0B',
    },
];

export function PortfolioPreview() {
    return (
        <section className="section">
            <div className="container">
                <div className={styles.header}>
                    <h2 className="text-gradient">Strategic Impact</h2>
                    <Button variant="outline">Browse Case Studies</Button>
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
