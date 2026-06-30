'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const criteria = {
    for: [
        "Founder-led B2B SaaS ($1M - $10M ARR)",
        "Technical founders scaling beyond their personal network",
        "Teams needing a growth 'engine', not just a landing page",
        "Founders who value engineering rigor over agency fluff"
    ],
    notFor: [
        "Pre-revenue startups looking for 'hacks'",
        "Enterprise-scale companies with massive internal silos",
        "Founders looking for the cheapest hourly retainer",
        "Anyone who views marketing as separate from engineering"
    ]
};

export function WhoThisIsFor() {
    return (
        <section className="section bg-[#07060A]">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    >
                        Is Docodo <span className="text-gradient">Right for You?</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 text-lg"
                    >
                        We build trust through clarity. We're not the right fit for everyone,
                        and we're okay with that.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-mint-500/5 border border-mint-500/20 rounded-[2rem] p-8 md:p-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-mint-500/10 rounded-full blur-[80px] pointer-events-none" />
                        
                        <div className="w-12 h-12 rounded-2xl bg-mint-500/20 flex items-center justify-center mb-8 border border-mint-500/30">
                            <Check className="w-6 h-6 text-mint-400" />
                        </div>
                        
                        <h3 className="text-2xl font-black text-white mb-8">This is for you if:</h3>
                        
                        <ul className="space-y-6 relative z-10">
                            {criteria.for.map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-zinc-300">
                                    <div className="w-6 h-6 rounded-full bg-mint-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-3.5 h-3.5 text-mint-400" />
                                    </div>
                                    <span className="leading-relaxed font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-8 md:p-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
                        
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center mb-8 border border-red-500/30">
                            <X className="w-6 h-6 text-red-400" />
                        </div>
                        
                        <h3 className="text-2xl font-black text-white mb-8">This is NOT for you if:</h3>
                        
                        <ul className="space-y-6 relative z-10">
                            {criteria.notFor.map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-zinc-300">
                                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <X className="w-3.5 h-3.5 text-red-400" />
                                    </div>
                                    <span className="leading-relaxed font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
