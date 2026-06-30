'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const comparison = [
    {
        feature: "Engineering Rigor",
        docodo: true,
        agency: false,
        freelancer: "Maybe"
    },
    {
        feature: "Direct Founder Access",
        docodo: true,
        agency: false,
        freelancer: true
    },
    {
        feature: "Fixed-Price Guarantee",
        docodo: true,
        agency: false,
        freelancer: "Variable"
    },
    {
        feature: "Systems Thinking",
        docodo: true,
        agency: false,
        freelancer: false
    },
    {
        feature: "Retainer-Led Model",
        docodo: false,
        agency: true,
        freelancer: "Varies"
    }
];

export function DifferentiationMatrix() {
    return (
        <section className="section bg-[#07060A] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="container relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        The Alternatives
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    >
                        Why Founders Choose <span className="text-gradient">Docodo.</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-lg"
                    >
                        Comparing the growth engineering approach against traditional models.
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="bg-[#0E0C15]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr>
                                        <th className="p-6 md:p-8 text-zinc-400 font-semibold text-sm uppercase tracking-wider w-1/3 border-b border-white/5">
                                            Feature
                                        </th>
                                        <th className="p-6 md:p-8 text-center bg-violet-500/5 border-b border-white/5 relative">
                                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
                                            <span className="text-violet-400 font-black text-lg">Docodo</span>
                                        </th>
                                        <th className="p-6 md:p-8 text-center text-zinc-300 font-bold border-b border-white/5">
                                            Traditional Agency
                                        </th>
                                        <th className="p-6 md:p-8 text-center text-zinc-300 font-bold border-b border-white/5">
                                            Freelancer
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparison.map((item, idx) => (
                                        <tr 
                                            key={idx} 
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="p-6 md:p-8 border-b border-white/5 text-zinc-300 font-medium group-hover:text-white transition-colors">
                                                {item.feature}
                                            </td>
                                            <td className="p-6 md:p-8 border-b border-white/5 text-center bg-violet-500/[0.02] group-hover:bg-violet-500/[0.05] transition-colors relative">
                                                <div className="absolute inset-y-0 left-0 w-[1px] bg-white/5" />
                                                <div className="absolute inset-y-0 right-0 w-[1px] bg-white/5" />
                                                {item.docodo ? (
                                                    <div className="w-10 h-10 mx-auto rounded-full bg-mint-500/20 flex items-center justify-center">
                                                        <Check className="text-mint-400" size={20} />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                                                        <X className="text-zinc-500" size={20} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-6 md:p-8 border-b border-white/5 text-center">
                                                {item.agency ? (
                                                    <Check className="mx-auto text-zinc-500" size={20} />
                                                ) : (
                                                    <X className="mx-auto text-zinc-600" size={20} />
                                                )}
                                            </td>
                                            <td className="p-6 md:p-8 border-b border-white/5 text-center text-zinc-500 text-sm font-medium">
                                                {typeof item.freelancer === 'string' ? (
                                                    <span className="px-3 py-1 bg-white/5 rounded-full">{item.freelancer}</span>
                                                ) : item.freelancer ? (
                                                    <Check className="mx-auto text-zinc-500" size={20} />
                                                ) : (
                                                    <X className="mx-auto text-zinc-600" size={20} />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
