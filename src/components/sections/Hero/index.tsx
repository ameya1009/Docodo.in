'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FloatingShapes } from '@/components/ui/FloatingShapes';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import styles from './Hero.module.css';

export function Hero() {
    const router = useRouter();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Parallax mouse movements for the 3D dashboard card
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            if (dashboardRef.current) {
                const rect = dashboardRef.current.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                const mouseX = e.clientX - rect.left - width / 2;
                const mouseY = e.clientY - rect.top - height / 2;
                x.set(mouseX / width);
                y.set(mouseY / height);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [x, y]);

    return (
        <section className={styles.hero}>
            <div
                className={styles.mouseFollower}
                style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y}px`
                }}
            />

            {/* Cinematic 3D Looping Video & Gradient Background */}
            <div className={styles.bgLayers}>
                <div className="absolute inset-0 w-full h-full overflow-hidden z-[-1] opacity-35">
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover filter brightness-[0.3] saturate-[1.5]"
                    >
                        <source 
                            src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-particle-background-animation-3043-large.mp4" 
                            type="video/mp4" 
                        />
                    </video>
                </div>
                <div className={styles.skylineOverlay} />
                <div className={styles.videoMask}>
                    <div className={styles.abstractBlob} />
                </div>
                <div className={styles.lensFlare} />
            </div>

            <FloatingShapes />

            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center min-h-[90vh] pt-16">
                
                {/* Copy / Content Side */}
                <motion.div
                    className="lg:col-span-7 flex flex-col text-left items-start"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.15 }
                        }
                    }}
                >
                    <motion.div
                        className={styles.trustBadge}
                        variants={{
                            hidden: { opacity: 0, scale: 0.9, y: 10 },
                            visible: { opacity: 1, scale: 1, y: 0 }
                        }}
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400">Pune Built • Scaling Globally</span>
                        <div className="w-[1px] h-3 bg-zinc-800" />
                        <span className="text-[10px] text-zinc-400 font-bold">Trusted by 75+ Businesses</span>
                    </motion.div>

                    <motion.h1
                        className="text-5xl lg:text-7xl font-black tracking-tight mb-6 text-white leading-[1.05]"
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Pune's No.1 <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-sapphire-400 drop-shadow-[0_2px_20px_rgba(16,185,129,0.2)]">AI Growth OS</span> <br />
                        for Ambitious Brands.
                    </motion.h1>

                    <motion.p
                        className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-8 max-w-xl text-left"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        AI Websites • Smart WhatsApp Bots • Local to Global Scaling. <br />
                        Unlock <span className="text-white font-black underline decoration-emerald-500 decoration-2">₹50,000+ Extra Revenue Monthly</span> with Zero Tech Headache.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8"
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <Button 
                            size="lg" 
                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider text-[11px] h-14 px-8 rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 group transition-all"
                            onClick={() => router.push('/growth-grader')}
                        >
                            Get Free 50-Point Growth Audit
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-wider text-[11px] h-14 px-8 rounded-xl" 
                            onClick={() => router.push('/dashboard')}
                        >
                            Start Free — 50 Credits
                        </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div 
                        className="flex flex-wrap items-center gap-6 text-zinc-500 text-xs font-bold pt-4 border-t border-white/5 w-full"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 }
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            <span>Pune Built</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-cyan-400" />
                            <span>4.9/5 Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-sapphire-400" />
                            <span>AI-Native Ecosystem</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* 3D Holographic Dashboard Mockup Side */}
                <motion.div
                    className="lg:col-span-5 flex justify-center items-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <motion.div
                        ref={dashboardRef}
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="relative w-full max-w-[450px] aspect-[4/5] rounded-[2.5rem] bg-gradient-to-b from-white/10 via-white/5 to-transparent p-1.5 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-sapphire-500/10 opacity-60 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Glowing highlight effects */}
                        <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-emerald-500/20 blur-[60px] rounded-full" />
                        <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-sapphire-500/20 blur-[60px] rounded-full" />

                        <div className="w-full h-full rounded-[2.2rem] bg-zinc-950/80 border border-white/5 overflow-hidden flex flex-col relative">
                            {/* Inner Header Mockup */}
                            <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between bg-black/40">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                </div>
                                <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-black">DOCODO GROWTH ANALYTICS</span>
                                <div className="w-4 h-4 rounded bg-white/5" />
                            </div>

                            {/* Dashboard Image Content */}
                            <div className="flex-1 relative overflow-hidden p-6 flex flex-col justify-end">
                                <img
                                    src="/saas_dashboard_background.png"
                                    alt="Docodo Dashboard holographic preview"
                                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-500 scale-[1.02] group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                {/* Interactive Overlay Card */}
                                <div className="relative z-10 p-5 bg-black/80 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold">Pune Local to Global</p>
                                            <h4 className="text-sm font-black text-white">Viman Nagar Skin Clinic</h4>
                                        </div>
                                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-black rounded border border-emerald-500/30">+₹68,400</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed">AI Agent booked 24 appointments this week, converting 8 leads globally.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

            </div>

            <div className={styles.gradientOverlay} />
        </section>
    );
}

