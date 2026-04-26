"use client";

import React from 'react';
import { motion } from 'framer-motion';

const scenes = [
  {
    id: 1,
    title: "80% of Indian SMB leads come via WhatsApp.",
    subtitle: "40% are missed forever.",
    description: "Chaos of messages at 3am. Customers waiting. Leads going to competitors. You can't be online 24/7, but your business should be.",
    image: "📱" // Placeholder for 3D Scene 1
  },
  {
    id: 2,
    title: "Manual CRM = Forgotten Follow-ups.",
    subtitle: "₹20,000+ lost per month.",
    description: "Sticky notes and Excel sheets are where leads go to die. If you don't follow up in 5 minutes, the lead is cold.",
    image: "📊" // Placeholder for 3D Scene 2
  },
  {
    id: 3,
    title: "You're doing 4 jobs.",
    subtitle: "You should be doing 1.",
    description: "Sales, support, content, billing. You are the bottleneck. Docodo automates the grunt work so you can focus on scale.",
    image: "🧘" // Placeholder for 3D Scene 3
  }
];

export const PainPoints = () => {
  return (
    <section className="relative bg-bg-deep py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-24"
        >
          <span className="text-lime font-mono text-sm uppercase tracking-widest">The SMB Trap</span>
          <h2 className="text-4xl md:text-6xl font-display font-black mt-4">Why Businesses Fail to Scale</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {scenes.map((scene, i) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-10 flex flex-col h-full"
            >
              <div className="text-6xl mb-8">{scene.image}</div>
              <h3 className="text-2xl font-display font-bold mb-2">{scene.title}</h3>
              <p className="text-lime font-bold mb-6">{scene.subtitle}</p>
              <p className="text-gray-400 leading-relaxed">{scene.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
