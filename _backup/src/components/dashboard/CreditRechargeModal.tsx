'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RechargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (amount: number) => void;
}

const packs = [
    { name: 'Starter Pack', credits: 100, price: '₹999', id: 'p1' },
    { name: 'Growth Pack', credits: 500, price: '₹3,999', id: 'p2', popular: true },
    { name: 'Enterprise Pack', credits: 1500, price: '₹9,999', id: 'p3' },
];

export function CreditRechargeModal({ isOpen, onClose, onSuccess }: RechargeModalProps) {
    const [loading, setLoading] = useState(false);

    const handleRecharge = (pack: typeof packs[0]) => {
        setLoading(true);
        // Simulate Razorpay Flow
        setTimeout(() => {
            setLoading(false);
            onSuccess(pack.credits);
            onClose();
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-zinc-950 border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Recharge Credits</h2>
                            <p className="text-zinc-400 text-sm">Empower your Growth OS with AI Tool credits via Razorpay.</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {packs.map(pack => (
                                <div
                                    key={pack.id}
                                    onClick={() => handleRecharge(pack)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${pack.popular ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-white/5 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold">{pack.name}</span>
                                            {pack.popular && <span className="text-[10px] bg-cyan-500 text-black font-extrabold px-2 py-0.5 rounded-full uppercase">Most Popular</span>}
                                        </div>
                                        <p className="text-zinc-400 text-xs">{pack.credits} AI Tool Credits</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-bold text-lg">{pack.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-center gap-6 text-zinc-500 mb-6">
                            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest"><ShieldCheck size={14} /> Secure</div>
                            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest"><CreditCard size={14} /> Razorpay</div>
                            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest"><Zap size={14} /> Instant</div>
                        </div>

                        {loading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-white font-bold">Securely connecting to Razorpay...</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
