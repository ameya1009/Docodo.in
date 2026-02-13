'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';
import styles from './PortfolioPreview.module.css';

const works = [
    {
        title: 'Dr. Patangankar',
        category: 'Medical Infrastructure',
        image: '/images/clients/dr-patangankar.jpg'
    },
    {
        title: "BIOgram",
        category: "Branding",
        image: "/images/clients/clearth-biogram-kky.jpg"
    },
    {
        title: "Clearth",
        category: "Strategy",
        image: "/images/clients/clearth-biogram-kky.jpg"
    },
    {
        title: "KKY",
        category: "Positioning",
        image: "/images/clients/clearth-biogram-kky.jpg"
    }
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
                    {works.map((work, index) => (
                        <Card key={index} className={styles.projectCard}>
                            <div className={styles.projectImageWrapper} style={{ position: 'relative', height: '100%', width: '100%' }}>
                                <Image
                                    src={work.image}
                                    alt={work.title}
                                    fill
                                    className={styles.projectImage}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                                />
                            </div>
                            <div className={styles.projectInfo}>
                                <h3>{work.title}</h3>
                                <p>{work.category}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
