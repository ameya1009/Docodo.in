'use client';

import React from 'react';
import { motion } from 'framer-motion';

const nodes = [
    { city: 'Mumbai', x: 236, y: 154 },
    { city: 'NYC', x: 74, y: 105 },
    { city: 'London', x: 191, y: 81 },
    { city: 'Singapore', x: 265, y: 172 },
    { city: 'Tokyo', x: 295, y: 110 },
    { city: 'Dubai', x: 216, y: 140 },
];

export function GlobalMap() {
    return (
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
            <svg viewBox="0 0 360 200" className="w-full h-full">
                {/* Simplified World Path Placeholder */}
                <path
                    d="M30,100 Q60,80 90,110 T150,100 T210,90 T270,110 T330,100"
                    stroke="var(--color-primary)"
                    strokeWidth="0.2"
                    fill="none"
                    className="opacity-20"
                />

                {nodes.map((node, i) => (
                    <g key={node.city}>
                        <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r="1.5"
                            fill="var(--color-primary)"
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 2, 1] }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                        />
                        <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r="4"
                            stroke="var(--color-primary)"
                            strokeWidth="0.5"
                            fill="none"
                            initial={{ scale: 0.5, opacity: 0.8 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                        />
                        <text
                            x={node.x + 4}
                            y={node.y + 2}
                            fill="rgba(255,255,255,0.3)"
                            fontSize="3"
                            className="font-black uppercase tracking-widest"
                        >
                            {node.city}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
