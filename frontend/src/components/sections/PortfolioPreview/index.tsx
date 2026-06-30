'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';

const works = [
    {
        title: 'Dr. Patangankar',
        category: 'Medical Infrastructure',
        image: '/images/clients/dr-patangankar.jpg'
    },
    {
        title: "BIOgram",
        category: "Branding",
        image: "/images/clients/biogram.png"
    },
    {
        title: "Clearth",
        category: "Strategy",
        image: "/images/clients/clearth.jpg"
    },
    {
        title: "KKY",
        category: "Positioning",
        image: "/images/clients/kky.png"
    }
];

export function PortfolioPreview() {
    return (
        <section className="py-24 px-4 bg-[#07060A]">
            <div className="container max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                    <h2 className="text-4xl md:text-5xl font-black text-white">Strategic <span className="text-gradient">Impact</span></h2>
                    <Button variant="outline" className="border-white/10 hover:border-white/30">Browse Case Studies</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {works.map((work, index) => (
                        <Card key={index} className="group overflow-hidden rounded-2xl p-0 h-[300px] border border-white/5 bg-[#0E0C15]/50">
                            <div className="relative h-full w-full bg-zinc-900 overflow-hidden">
                                <Image
                                    src={work.image}
                                    alt={work.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C15] via-[#0E0C15]/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6 z-10 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-xl font-bold text-white mb-1">{work.title}</h3>
                                    <p className="text-sm font-medium text-mint-400">{work.category}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
