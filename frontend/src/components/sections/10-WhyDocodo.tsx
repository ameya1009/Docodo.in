"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Brain, 
  Wrench, 
  Zap, 
  MessageSquare, 
  BarChart3 
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionElements";
import { Card } from "@/components/ui/SectionElements";
import { WHY_DOCODO } from "@/lib/constants";

const ICON_MAP: Record<string, any> = {
  Globe,
  Brain,
  Wrench,
  Zap,
  MessageSquare,
  BarChart3,
};

export const WhyDocodo = () => {
  return (
    <section className="py-24 bg-[var(--bg-deep)]">
      <div className="container">
        <SectionHeading
          headline="Why founders choose Docodo."
          sub="Not because we're the cheapest. Because we're the only ones doing all of this."
          className="mb-20"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_DOCODO.map((item, i) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  variant="bordered" 
                  className="p-8 h-full group hover:rotate-x-3 hover:translate-z-6 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
