'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

const works = [
    { title: 'Neon Fintech', cat: 'SaaS', color: '#00E5FF' },
    { title: 'Aura Wellness', cat: 'Brand', color: '#7C3AED' },
    { title: 'Nexus AI', cat: 'Product', color: '#F59E0B' },
    { title: 'Urban Estate', cat: 'Web', color: '#10B981' },
    { title: 'Flow Automate', cat: 'SaaS', color: '#3B82F6' },
    { title: 'Zenith', cat: 'Brand', color: '#EC4899' },
];

export default function PortfolioPage() {
    return (
        <main>
            <Navbar />
            <div className="pt-32 pb-20 container">
                <h1 className="text-center mb-12">Our Work</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {works.map((work, i) => (
                        <Card key={i} className="group cursor-pointer border-0 p-0 bg-transparent">
                            <div className="aspect-video rounded-xl overflow-hidden relative mb-4">
                                <div
                                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                    style={{ background: `linear-gradient(45deg, ${work.color}40, ${work.color}90)` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                                    <span className="text-white font-medium border border-white/30 px-4 py-2 rounded-full">View Case Study</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold">{work.title}</h3>
                            <p className="text-zinc-500">{work.cat}</p>
                        </Card>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
