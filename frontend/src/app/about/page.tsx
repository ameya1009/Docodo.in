'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Linkedin, Target, Zap, Rocket, Users, ArrowRight, Github, Sparkles } from 'lucide-react';

export default function AboutPage() {
    const router = useRouter();
    
    return (
        <main className="bg-[#07060A] min-h-screen relative overflow-hidden">
            {/* 3D Grid & Noise Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    transformOrigin: 'top center',
                }}
            />
            
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B5CF6] rounded-full blur-[150px] opacity-[0.15] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#10B981] rounded-full blur-[120px] opacity-[0.1] mix-blend-screen pointer-events-none" />

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
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/20 mb-6 text-[#10B981] font-bold uppercase tracking-widest text-xs">
                                    <Sparkles size={14} /> Docodo Global Vision
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                                    Your #1 AI <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#10B981]">Growth OS.</span>
                                </h1>
                                <p className="text-zinc-400 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                    Integrated Websites, Digital Marketing, and AI Automations
                                    engineered to give global clinics, cafes, and salons
                                    the power of a tech giant. (Without the tech bro attitude).
                                </p>
                            </motion.div>
                            <motion.div 
                                className="flex-1 hidden lg:block relative"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <div className="absolute inset-0 bg-[#8B5CF6]/20 blur-[100px] rounded-full" />
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
                                <div className="bg-[#0E0C15]/60 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 relative overflow-hidden group perspective-[1000px]">
                                    <div className="transform-style-3d transition-transform duration-500 group-hover:rotate-x-6 group-hover:-rotate-y-6 group-hover:translate-z-10">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/20 rounded-bl-full -z-10 group-hover:bg-[#10B981]/20 transition-colors" />
                                        
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#10B981] p-1 mb-6">
                                            <div className="w-full h-full bg-[#07060A] rounded-full flex items-center justify-center border-4 border-[#07060A]">
                                                <span className="text-2xl font-black text-white">AK</span>
                                            </div>
                                        </div>

                                        <h2 className="text-2xl font-bold text-white mb-1">Ameya Kshirsagar</h2>
                                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#22D3EE] font-bold text-sm mb-6">Founder & Chief Hustle Officer</p>

                                        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                                            Building the Top 1% SaaS products for ambitious SMBs. Surviving on Pune's finest misal and 100x dreams. Formerly engineered high-stakes systems; now democratizing AI growth.
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
                                    <div className="absolute top-0 left-0 w-1 h-12 bg-[#8B5CF6] -translate-x-[2px] rounded-full" />
                                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4 block">01 / Origin Story</span>
                                    <h3 className="text-3xl font-bold text-white mb-6">From Tech Labs to Local Streets</h3>
                                    
                                    <blockquote className="text-xl md:text-2xl font-medium text-[#10B981] italic mb-8 border-l-4 border-[#10B981] pl-6 py-2 bg-[#10B981]/10 rounded-r-xl">
                                        "Democratizing $2,000/Mo ROI for every global SMB, starting with Pune."
                                    </blockquote>
                                    
                                    <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
                                        <p>
                                            I spent years in high-stakes engineering, where precision is paramount.
                                            I saw millions of SMBs worldwide—from Mumbai to NYC—struggling with
                                            expensive, fragmented agencies that lack a true technical core (and overcharge for basic WordPress sites).
                                        </p>
                                        <p>
                                            Docodo is my response: A unified 'Growth OS' where any salon, clinic, or gym
                                            gets premium AI-powered ROI starting at just ₹4,999. No tech barriers, just scalable wins and unapologetic hustle.
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="relative pl-8 md:pl-12 border-l border-white/10"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-12 bg-[#10B981] -translate-x-[2px] rounded-full" />
                                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4 block">02 / The Philosophy</span>
                                    <h3 className="text-3xl font-bold text-white mb-6">Systems Over Splashes (and Vibes)</h3>
                                    
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
                <section className="py-24 px-4 bg-[#0E0C15] border-y border-white/10">
                    <div className="container max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How We Engineer Growth</h2>
                            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">A precise, four-stage protocol for scaling systems without friction.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    id: "01",
                                    title: "Brutal Audit",
                                    desc: "No fluffy pitch decks. We dive into your current stack and roast the leaks in your funnel that are costing you money.",
                                    icon: <Target className="w-8 h-8" />,
                                    theme: "text-[#8B5CF6]"
                                },
                                {
                                    id: "02",
                                    title: "Blueprint Phase",
                                    desc: "We deliver a technical architecture map within 48 hours. You see the solution before we write a single line of code.",
                                    icon: <Zap className="w-8 h-8" />,
                                    theme: "text-[#10B981]"
                                },
                                {
                                    id: "03",
                                    title: "Velocity Buildout",
                                    desc: "Weekly drops. Live staging. Immediate feedback loops. We build in the open so you know we aren't just sleeping on the job.",
                                    icon: <Rocket className="w-8 h-8" />,
                                    theme: "text-[#6366F1]"
                                },
                                {
                                    id: "04",
                                    title: "Hyper-Optimization",
                                    desc: "We don't hand over and leave. We monitor, refine, and optimize the AI to ensure you can afford that new car.",
                                    icon: <Users className="w-8 h-8" />,
                                    theme: "text-[#8B5CF6]"
                                }
                            ].map((step, idx) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white/5 border border-white/20 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden group hover:bg-white/10 transition-colors"
                                >
                                    <div className="text-[120px] font-black text-white/5 absolute -top-10 -right-4 select-none group-hover:text-white/10 transition-colors">
                                        {step.id}
                                    </div>
                                    <div className={`mb-6 relative z-10 ${step.theme}`}>
                                        {step.icon}
                                    </div>
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
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#10B981]">start engineering?</span>
                        </motion.h2>
                        <motion.button 
                            className="px-10 py-5 bg-[#10B981] text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-[#10B981]/90 hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all inline-flex items-center gap-2"
                            onClick={() => router.push('/contact')}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Start Your Free AI Audit <ArrowRight size={18} />
                        </motion.button>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
