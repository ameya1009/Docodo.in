'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const projects = [
    {
        title: "NYC Artisan Cafe",
        category: "Food & Beverage",
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1200",
        color: '#8B5CF6',
        description: 'Automated 60% of takeout orders via multi-lang WhatsApp agent for a high-volume Bleecker St. location.',
        stats: ['+$800/Mo Orders', 'ROI +150%', 'Bot Integrated'],
    },
    {
        title: "London Aesthetic Salon",
        category: "Health & Beauty",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200",
        color: '#10B981',
        description: 'Dynamic scheduling OS in Mayfair reduced no-shows by 75% and increased high-value service sales.',
        stats: ['+40% Bookings', '75% Less No-Shows', 'Global CRM'],
    },
    {
        title: "Singapore Fitness Hub",
        category: "Fitness & Wellness",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200",
        color: '#6366F1',
        description: 'Auto-optimized TikTok campaigns drove record memberships for an Orchard Road gym boutique.',
        stats: ['+$1,200/Mo', 'Viral Reach', 'AI Ads'],
    },
    {
        title: "Pune Wellness Clinic",
        category: "Healthcare SMB",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
        color: '#F59E0B',
        description: 'Built a patient-first ecosystem in Baner with integrated follow-up bots and medical SEO.',
        stats: ['+₹45k/Mo Profit', 'Top 3 SEO', 'Auto-nurture'],
    }
];

function ProjectModal({ project, onClose }: { project: typeof projects[0], onClose: () => void }) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-4xl bg-[#0E0C15] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0, y: 50, rotateX: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50, rotateX: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-white/10 text-white backdrop-blur-md transition-colors border border-white/10" 
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                {/* Left Image Section */}
                <div className="relative w-full md:w-1/2 h-[300px] md:h-auto">
                    <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C15] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0E0C15]" />
                </div>

                {/* Right Content Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto" style={{ borderTop: `4px solid ${project.color}` }}>
                    <span 
                        className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-fit"
                        style={{ backgroundColor: `${project.color}20`, color: project.color }}
                    >
                        {project.category}
                    </span>
                    
                    <h2 className="text-3xl font-black text-white mb-4">{project.title}</h2>
                    <p className="text-zinc-400 text-base leading-relaxed mb-8">{project.description}</p>

                    <div className="space-y-4 mb-10">
                        {project.stats.map((stat, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
                                <div className="w-3 h-3 rounded-full shadow-lg" style={{ background: project.color, boxShadow: `0 0 10px ${project.color}` }} />
                                <span className="text-zinc-200 font-bold">{stat}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto">
                        <Button 
                            className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black rounded-xl text-sm tracking-wider flex items-center justify-center gap-2"
                            onClick={() => window.location.href = '/contact'}
                        >
                            Get Similar Results <ExternalLink size={16} />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export function PortfolioSlider() {
    const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

    return (
        <section ref={sectionRef} className="relative h-[200vh] bg-[#07060A]">
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-20">
                <div className="container relative z-10 mb-12">
                    <div className="max-w-3xl">
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-violet-400 font-bold tracking-widest text-xs uppercase mb-4 block"
                        >
                            Global ROI Proof
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-white text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tighter"
                        >
                            Worldwide <br/><span className="text-gradient">Success Stories</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-zinc-400 text-lg md:text-xl max-w-2xl"
                        >
                            Sites + Apps + Marketing + Bots. See how Docodo delivers real growth from NYC to Singapore.
                        </motion.p>
                    </div>
                </div>

                <div className="pl-4 md:pl-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))]">
                    <motion.div style={{ x }} className="flex gap-6 md:gap-10 w-[200vw] sm:w-[150vw] md:w-[120vw]">
                        {projects.map((project, index) => (
                            <motion.div
                                key={index}
                                className="group relative flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] max-w-[600px] aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer"
                                whileHover={{ scale: 0.98 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                onClick={() => setSelectedProject(project)}
                            >
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    fill
                                    sizes="(max-width: 768px) 85vw, (max-width: 1200px) 60vw, 45vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                                <div className="absolute inset-0 mix-blend-color opacity-40 transition-opacity duration-500 group-hover:opacity-60" style={{ backgroundColor: project.color }} />
                                
                                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest mb-3 w-fit px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90">
                                        {project.category}
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2">{project.title}</h3>
                                    
                                    <div className="flex items-center gap-2 text-white/0 group-hover:text-white/100 transition-colors duration-500 font-bold text-sm mt-4">
                                        View Outcome <ArrowRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
