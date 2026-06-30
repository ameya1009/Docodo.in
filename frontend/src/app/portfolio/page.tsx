'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

const works = [
    {
        title: 'Dr. Patangankar',
        category: 'HEALTHCARE ARCHITECTURE',
        description: 'A comprehensive digital ecosystem for a specialized medical centre, streamlining patient acquisition and authority.',
        image: '/images/clients/dr-patangankar.jpg',
        color: 'var(--color-primary)'
    },
    {
        title: "BIOgram",
        category: "Growth & Branding",
        image: "/images/clients/biogram.png",
        stats: "+240% Engagement",
        description: "Repositioning a health-tech brand for the European market."
    },
    {
        title: "Clearth",
        category: "GTM Strategy",
        image: "/images/clients/clearth.jpg",
        stats: "$1.2M Pipeline",
        description: "Engineering a scalable GTM engine for a sustainability startup."
    },
    {
        title: "KKY",
        category: "Founder Branding",
        image: "/images/clients/kky.png",
        stats: "12 Prime Interviews",
        description: "Building a personal brand system for a high-profile tech founder."
    }
];

export default function PortfolioPage() {
    return (
        <main className="min-h-screen bg-[#07060A]">
            <Navbar />

            <section className="pt-40 pb-20 px-4 md:px-6">
                <div className="container max-w-7xl mx-auto">
                    <motion.span
                        className="text-mint-400 font-bold tracking-widest text-xs uppercase mb-4 block"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Success Stories
                    </motion.span>
                    <motion.h1
                        className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Our <span className="text-gradient">Portfolio.</span>
                    </motion.h1>
                    <motion.p
                        className="text-xl text-zinc-400 leading-relaxed max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        We don't just build websites; we engineer demand-generation engines
                        and brand ecosystems that drive measurable growth.
                    </motion.p>
                </div>
            </section>

            <div className="container max-w-7xl mx-auto px-4 md:px-6 pb-32">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    {works.map((work, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="group rounded-[2rem] bg-[#0E0C15]/80 backdrop-blur-xl border border-white/5 overflow-hidden relative">
                                <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden bg-zinc-900">
                                    <Image
                                        src={work.image}
                                        alt={work.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C15] via-[#0E0C15]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                    <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">{work.category}</span>
                                            {work.stats && (
                                                <span className="text-[10px] font-black text-mint-400 bg-mint-400/10 px-2 py-0.5 rounded border border-mint-400/20 uppercase tracking-widest">
                                                    {work.stats}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-2">{work.title}</h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">{work.description}</p>
                                        <Button variant="outline" size="sm" className="w-fit border-white/10 hover:bg-white hover:text-black group-hover:border-white transition-all duration-500">
                                            Case Study <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}

