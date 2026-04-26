"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Badge } from './ui/core';

const services = [
  {
    title: "Websites & Apps",
    desc: "3D Interactive Experiences",
    color: "var(--color-accent-primary)",
    gradient: "from-[var(--color-accent-primary)]/20 to-transparent",
  },
  {
    title: "Marketing & SEO",
    desc: "Automated Lead Generation",
    color: "var(--color-accent-secondary)",
    gradient: "from-[var(--color-accent-secondary)]/20 to-transparent",
  },
  {
    title: "AI Automations",
    desc: "WhatsApp Bots & CRM",
    color: "var(--color-accent-tertiary)",
    gradient: "from-[var(--color-accent-tertiary)]/20 to-transparent",
  }
];

export const AiGrowthEngines = () => {
  return (
    <section className="py-24 bg-[var(--color-bg-secondary)] relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-h2 font-cabinet mb-4"
          >
            AI Growth Engines
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto"
          >
            Deploy autonomous systems that scale your business.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px]">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotateX: 20, y: 50 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.05, rotateY: index === 0 ? 5 : index === 2 ? -5 : 0, zIndex: 20 }}
              className="relative group cursor-pointer h-[400px]"
            >
              <GlassCard className="h-full w-full flex flex-col justify-end p-8 overflow-hidden border-[var(--color-border)] group-hover:border-[var(--color-accent-primary)] transition-colors duration-500">
                {/* Simulated Video Preview / Glow */}
                <div className={`absolute inset-0 bg-gradient-to-b ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* 3D Scanning Line Effect on Hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-accent-primary)] opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_linear_infinite]" />

                <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <Badge className="mb-4 bg-black/50 backdrop-blur border-[var(--color-border)]">{service.title}</Badge>
                  <h3 className="text-2xl font-bold font-cabinet mb-2 text-white">{service.title}</h3>
                  <p className="text-[var(--color-text-secondary)] group-hover:text-white transition-colors duration-300">{service.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
      `}} />
    </section>
  );
};
