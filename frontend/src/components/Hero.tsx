"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroScene } from './three/HeroScene';
import { Button } from './ui/core';
import { Play, X } from 'lucide-react';
import Link from 'next/link';

const TextReveal = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <span className="inline-block">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative w-full h-[100svh] overflow-hidden flex flex-col justify-center items-center">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <HeroScene />
        </Canvas>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)]/80 via-transparent to-[var(--color-bg-primary)] z-10 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mt-16">
        <h1 className="text-hero font-cabinet font-extrabold tracking-tight mb-6 max-w-5xl leading-tight">
          <TextReveal text="The " />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] animate-pulse">
            <TextReveal text="AI Growth OS" />
          </span>
          <br className="hidden md:block" />
          <TextReveal text=" That Works While You Sleep" />
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-body text-[var(--color-text-secondary)] max-w-3xl mb-10"
        >
          WhatsApp AI Nurturer • Content Repurposer • Care Plans
          <br className="hidden sm:block" />
          Self-Hosted in India • DPDP Compliant • ₹50k+ Monthly ROI
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link href="/audit">
            <Button variant="whatsapp" size="lg" className="w-full sm:w-auto">Start Free 50-Point Audit</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">Claim 50 Free Credits</Button>
          </Link>
          <Button variant="secondary" size="lg" onClick={() => setIsVideoOpen(true)} className="w-full sm:w-auto gap-2">
            <Play size={18} /> Watch 43-sec Demo
          </Button>
        </motion.div>

        {/* Social Proof Ticker */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="w-full overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-glass)] backdrop-blur py-4 absolute bottom-0 left-0"
        >
          <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            <span className="mx-4 text-[var(--color-text-secondary)] text-sm font-medium">Trusted by BIOgram Health</span>
            <span className="mx-4 text-[var(--color-accent-primary)] text-sm font-bold">•</span>
            <span className="mx-4 text-[var(--color-text-secondary)] text-sm font-medium">Dr. Patangankar Clinic</span>
            <span className="mx-4 text-[var(--color-accent-primary)] text-sm font-bold">•</span>
            <span className="mx-4 text-[var(--color-text-secondary)] text-sm font-medium">Viman Nagar Cafe</span>
            <span className="mx-4 text-[var(--color-accent-primary)] text-sm font-bold">•</span>
            <span className="mx-4 text-[var(--color-text-secondary)] text-sm font-medium">Baner Salon</span>
            <span className="mx-4 text-[var(--color-accent-primary)] text-sm font-bold">•</span>
            <span className="mx-4 text-[var(--color-text-secondary)] text-sm font-medium">50+ Pune SMBs</span>
            <span className="mx-4 text-[var(--color-accent-primary)] text-sm font-bold">•</span>
            {/* Duplicate for infinite effect */}
            <span className="mx-4 text-[var(--color-text-secondary)] text-sm font-medium">Trusted by BIOgram Health</span>
            <span className="mx-4 text-[var(--color-accent-primary)] text-sm font-bold">•</span>
            <span className="mx-4 text-[var(--color-text-secondary)] text-sm font-medium">Dr. Patangankar Clinic</span>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl aspect-video bg-[var(--color-bg-secondary)] border border-[var(--color-accent-primary)] rounded-xl overflow-hidden shadow-[var(--shadow-glow-accent)]">
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-[var(--color-accent-primary)] hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
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
