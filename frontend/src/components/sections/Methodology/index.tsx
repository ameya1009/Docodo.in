'use client';

import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Layers, Cpu, Zap, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
    {
        icon: <Layers className="w-6 h-6 text-violet-400" />,
        title: "Layer 01: Systems Audit",
        description: "We deconstruct your current tech stack and funnel to identify technical debt and conversion leaks.",
        details: ["Funnel Mapping", "Tech Stack Audit", "CAC Analysis"]
    },
    {
        icon: <Cpu className="w-6 h-6 text-mint-400" />,
        title: "Layer 02: Infrastructure Engineering",
        description: "Building the high-velocity foundation. Landing pages, CMS, and data tracking layers.",
        details: ["Next.js Buildout", "Headless CMS Setup", "Analytics Rig"]
    },
    {
        icon: <Zap className="w-6 h-6 text-amber-400" />,
        title: "Layer 03: Growth Automation",
        description: "Removing human friction. Lead routing, CRM sync, and automated nurturing sequences.",
        details: ["WhatsApp CRM", "Lead Intelligence", "Email Sequences"]
    },
    {
        icon: <BarChart3 className="w-6 h-6 text-indigo-400" />,
        title: "Layer 04: Velocity Optimization",
        description: "Continuous iteration based on real-world data to drive exponential ROI.",
        details: ["A/B Testing", "Heatmap Analysis", "Scaling Playbook"]
    }
];

function MethodologyCard({ step, idx }: { step: typeof steps[0], idx: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            onMouseMove={handleMouseMove}
            className="group relative rounded-3xl bg-white/5 border border-white/10 overflow-hidden flex flex-col h-full"
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(139, 92, 246, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            
            <div className="p-8 flex flex-col h-full relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
                    {step.description}
                </p>
                
                <div className="space-y-3 pt-6 border-t border-white/5">
                    {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500/50 group-hover:bg-mint-400 transition-colors" />
                            {detail}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export function Methodology() {
    return (
        <section id="methodology" className="section relative overflow-hidden">
            {/* Background flares */}
            <div className="absolute top-40 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-40 right-0 w-96 h-96 bg-mint-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="container relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <Zap size={12} className="animate-pulse" />
                        Our Protocol
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                        The Founder-First <br />
                        <span className="text-gradient">Growth Stack™</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        A deterministic engineering protocol for scaling B2B SaaS from $1M to $10M ARR without adding agency overhead.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, idx) => (
                        <MethodologyCard key={idx} step={step} idx={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
