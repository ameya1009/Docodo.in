"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeonButton } from '../ui/NeonButton';
import { Play, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative w-full h-[100svh] flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Content Overlay */}
      <div className="relative z-20 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block px-4 py-1.5 rounded-full border border-lime/20 bg-lime/5 backdrop-blur-md mb-8"
        >
          <span className="text-lime text-sm font-medium tracking-wider uppercase">
            AI Growth OS · Pune, India · Now Live Globally
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-display font-black text-white leading-[1.1] mb-8"
        >
          Turn Your Business Into <br />
          <span className="text-gradient-lime">An AI Machine</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          WhatsApp AI that replies at 3am. Content that writes itself. 
          Reports that send automatically. Care Plans from ₹2,499/mo.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <Link href="/signup">
            <NeonButton variant="primary" className="text-lg px-8 py-4">
              Claim 50 Free Credits
            </NeonButton>
          </Link>
          <button 
            onClick={() => setIsVideoOpen(true)}
            className="group flex items-center gap-3 text-white font-bold hover:text-lime transition-colors"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-lime/50 group-hover:bg-lime/10 transition-all">
              <Play size={20} fill="currentColor" />
            </div>
            Watch 43-sec Demo
          </button>
          <Link href="/audit">
            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              Book Free Audit <ArrowRight size={16} />
            </button>
          </Link>
        </motion.div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-gray-500 font-medium"
        >
          <div className="flex flex-col items-center">
            <span className="text-white text-xl font-display">47</span>
            <span className="text-xs uppercase tracking-widest">Pune Businesses</span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-white text-xl font-display">₹23L+</span>
            <span className="text-xs uppercase tracking-widest">Extra Revenue</span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-white text-xl font-display">98%</span>
            <span className="text-xs uppercase tracking-widest">Bot Response Rate</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-lime to-transparent" />
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-5xl aspect-video glass-card overflow-hidden">
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-6 right-6 z-10 bg-white/10 text-white p-3 rounded-full hover:bg-lime hover:text-bg-deep transition-all"
              >
                <X size={24} />
              </button>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Docodo Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
