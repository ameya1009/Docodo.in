'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowRight, TrendingUp, Users, Target } from 'lucide-react';

const cases = [
    {
        title: "BIOgram Health Clinic",
        location: "Koregaon Park, Pune",
        metric: "+200% Leads",
        description: "Automated the patient booking flow and implemented a hyper-local SEO strategy, resulting in a 3x increase in monthly inquiries.",
        tags: ["SEO", "Automations", "GTM"],
        image: "/images/clients/biogram.png",
        color: "cyan"
    },
    {
        title: "Dr. Patangankar Neuro",
        location: "Shivajinagar, Pune",
        metric: "₹45k+ New Rev/mo",
        description: "Built a authority-led digital presence that positioned the center as the leading neuro-spine facility in Maharashtra.",
        tags: ["Branding", "Web App"],
        image: "/images/clients/dr-patangankar.jpg",
        color: "pink"
    },
    {
        title: "Viman Nagar Gourmet Cafe",
        location: "Viman Nagar, Pune",
        metric: "50+ Daily Orders",
        description: "Implemented a custom WhatsApp ordering bot that removed the need for manual order taking and reduced errors by 90%.",
        tags: ["WhatsApp Bot", "Automation"],
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
        color: "amber"
    }
];

export default function CasesPage() {
    return (
        <main className="bg-black min-h-screen">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container">
                    <div className="text-center mb-24">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-white text-7xl font-extrabold mb-6 tracking-tighter"
                        >
                            Engineered <span className="text-gradient">ROI.</span>
                        </motion.h1>
                        <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
                            We don&apos;t settle for vanity metrics. We measure our success by the growth we deliver to our Pune SMB partners.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {cases.map((project, idx) => (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-zinc-900/40 border border-white/5 rounded-[40px] overflow-hidden group hover:border-white/20 transition-all"
                            >
                                <div className="aspect-[16/10] bg-zinc-800 relative overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                                            <span className="text-white font-bold text-sm tracking-tight">{project.metric}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-10">
                                    <div className="flex gap-2 mb-6">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 border border-white/10 px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4">{project.title}</h2>
                                    <p className="text-zinc-500 text-sm mb-4 font-medium uppercase tracking-wide">{project.location}</p>
                                    <p className="text-zinc-400 leading-relaxed mb-8">
                                        {project.description}
                                    </p>
                                    <Button variant="outline" className="w-full py-6 group">
                                        View Full Outcome <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-32 p-16 bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-[50px] text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">Your Business is Next.</h2>
                        <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto"> Join the elite Pune businesses scaling with Docodo&apos;s Integrated Growth OS.</p>
                        <Button variant="primary" size="lg" className="px-12 py-7 text-xl">Book Your Free Audit</Button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
