'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const items = [
    "AI GROWTH ENGINES",
    "GTM STRATEGY",
    "REVENUE OPERATIONS",
    "SAAS SCALING",
    "ACCOUNT-BASED MARKETING",
    "CONVERSION ARCHITECTURE",
    "FOUNDER-LED GROWTH",
    "DATA-DRIVEN DESIGN"
];

export function InfiniteMarquee() {
    return (
        <div className="relative w-full py-8 overflow-hidden bg-black/40 border-y border-white/5 backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-r from-[#07060A] via-transparent to-[#07060A] z-10 pointer-events-none" />
            
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex items-center gap-10"
                    animate={{ x: [0, -1035] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 25,
                            ease: "linear",
                        },
                    }}
                >
                    {[...items, ...items, ...items, ...items].map((item, index) => (
                        <div key={index} className="flex items-center gap-10 group">
                            <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700 group-hover:from-violet-400 group-hover:to-mint-400 transition-colors duration-500 tracking-wider">
                                {item}
                            </span>
                            <Zap className="text-violet-500/30 group-hover:text-mint-500 transition-colors duration-500" size={16} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
