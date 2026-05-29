'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Linkedin, Newspaper, Headphones, Target, Zap, Rocket, Users, ArrowRight, Github } from 'lucide-react';

export default function AboutPage() {
    const router = useRouter();
    
    return (
        <main className="bg-[#0F0F0F] min-h-screen relative overflow-hidden">
            {/* 3D Video Background */}
            <div className="absolute top-0 left-0 w-full h-[60vh] z-0 opacity-20 pointer-events-none">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F0F0F]/80 to-[#0F0F0F]" />
            </div>

            <div className="relative z-10">
                <Navbar />

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                            <motion.div
                                className="flex-1 text-center lg:text-left"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 inline-block">
                                    Docodo Global Vision 2026
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                                    Your #1 Global AI <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Growth OS for SMBs.</span>
                                </h1>
                                <p className="text-zinc-400 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                    Integrated Websites, Digital Marketing, and AI Automations
                                    engineered to give global clinics, cafes, and salons
                                    the power of a tech giant at an accessible, democratic price.
                                </p>
                            </motion.div>
                            <motion.div 
                                className="flex-1 hidden lg:block relative"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
                                <div className="text-[150px] font-black text-white/5 tracking-tighter leading-none select-none">
                                    GENESIS
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Founder Story */}
                <section className="py-24 px-4 relative">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                            {/* Sticky Founder Card */}
                            <motion.div 
                                className="w-full lg:w-1/3 lg:sticky lg:top-32"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:bg-emerald-500/20 transition-colors" />
                                    
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 p-1 mb-6">
                                        <div className="w-full h-full bg-[#0F0F0F] rounded-full flex items-center justify-center border-4 border-[#0F0F0F]">
                                            <span className="text-2xl font-black text-white">AK</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-white mb-1">Ameya Kshirsagar</h2>
                                    <p className="text-emerald-400 font-medium text-sm mb-6">Founder & Principal Architect</p>

                                    <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                                        Building the Top 1% SaaS products for ambitious SMBs. Formerly engineered high-stakes systems; now democratizing AI growth for local businesses.
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <a href="https://www.linkedin.com/in/ameya-kshirsagar-1002" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] rounded-xl transition-colors border border-[#0A66C2]/20 flex items-center justify-center gap-2 flex-1 font-bold text-sm">
                                            <Linkedin size={18} /> Connect
                                        </a>
                                        <a href="https://github.com/ameya1009" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10">
                                            <Github size={18} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Manifesto Content */}
                            <div className="w-full lg:w-2/3 space-y-16">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="relative pl-8 md:pl-12 border-l border-white/10"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-12 bg-emerald-400 -translate-x-[2px] rounded-full" />
                                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4 block">01 / Origin Story</span>
                                    <h3 className="text-3xl font-bold text-white mb-6">From Engineering Labs to World Scale</h3>
                                    
                                    <blockquote className="text-xl md:text-2xl font-medium text-emerald-400 italic mb-8 border-l-4 border-emerald-400/30 pl-6 py-2">
                                        "Democratizing $2,000/Mo ROI for every global SMB."
                                    </blockquote>
                                    
                                    <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
                                        <p>
                                            I spent years in high-stakes engineering, where precision is paramount.
                                            I saw millions of SMBs worldwide—from Mumbai to NYC—struggling with
                                            expensive, fragmented agencies that lack a true technical core.
                                        </p>
                                        <p>
                                            Docodo is my response: A unified 'Growth OS' where any salon, clinic, or gym
                                            gets premium AI-powered ROI starting at just ₹4,999. No tech barriers, just scalable wins.
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="relative pl-8 md:pl-12 border-l border-white/10"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-12 bg-sapphire-400 -translate-x-[2px] rounded-full" />
                                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4 block">02 / The Philosophy</span>
                                    <h3 className="text-3xl font-bold text-white mb-6">Systems Over Splashes</h3>
                                    
                                    <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
                                        <p>
                                            Traditional marketing is built on "splashes"—momentary bursts of attention. We build steady-state engines.
                                            Every line of code and every automation node we build has a singular intent: <strong className="text-white">measurable revenue efficiency.</strong>
                                        </p>
                                        <p>
                                            We leverage proprietary AI-engineers that automate 80% of the manual coding process, allowing us to pass the savings directly to business owners worldwide while maintaining Apple-level quality.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workflow */}
                <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
                    <div className="container max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How We Engineer Growth</h2>
                            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">A precise, four-stage protocol for scaling systems without friction.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    id: "01",
                                    title: "Systems Audit",
                                    desc: "No pitch decks. We dive into your current stack to find leaks in your funnel that are costing you CAC efficiency.",
                                    icon: <Target className="w-8 h-8" />
                                },
                                {
                                    id: "02",
                                    title: "Blueprint Phase",
                                    desc: "We deliver a technical architecture map within 48 hours. You see the solution before we write a single line of code.",
                                    icon: <Zap className="w-8 h-8" />
                                },
                                {
                                    id: "03",
                                    title: "Velocity Buildout",
                                    desc: "Weekly drops. Live staging. Immediate feedback loops. We build in the open so you always know where your investment is.",
                                    icon: <Rocket className="w-8 h-8" />
                                },
                                {
                                    id: "04",
                                    title: "Optimization",
                                    desc: "We don't hand over and leave. We monitor, refine, and optimize the automation to ensure long-term ROI.",
                                    icon: <Users className="w-8 h-8" />
                                }
                            ].map((step, idx) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:bg-white/10 transition-colors"
                                >
                                    <div className="text-[120px] font-black text-white/5 absolute -top-10 -right-4 select-none group-hover:text-white/10 transition-colors">
                                        {step.id}
                                    </div>
                                    <div className="text-emerald-400 mb-6 relative z-10">{step.icon}</div>
                                    <h4 className="text-xl font-bold text-white mb-4 relative z-10">{step.title}</h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed relative z-10">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 px-4 text-center">
                    <div className="container max-w-4xl mx-auto">
                        <motion.h2 
                            className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            Ready to stop guessing and<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">start engineering?</span>
                        </motion.h2>
                        <motion.button 
                            className="px-10 py-5 bg-emerald-500 text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-emerald-400 transition-colors inline-flex items-center gap-2"
                            onClick={() => router.push('/growth-grader')}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Start Your Free 50-Point Audit <ArrowRight size={18} />
                        </motion.button>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
