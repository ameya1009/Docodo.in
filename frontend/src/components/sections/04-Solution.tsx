"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  Video, 
  Star, 
  BarChart3, 
  FileText, 
  Layers 
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionElements";
import { ToolCard } from "@/components/ui/SpecialtyComponents";
import { TOOLS } from "@/lib/constants";

const ICON_MAP: Record<string, any> = {
  "whatsapp-nurturer": MessageCircle,
  "content-repurposer": Video,
  "review-requester": Star,
  "roi-reporter": BarChart3,
  "proposal-generator": FileText,
  "care-plans": Layers,
};

export const Solution = () => {
  return (
    <section className="py-24 bg-[var(--bg-deep)]">
      <div className="container">
        <SectionHeading
          eyebrow="The Fix"
          headline="Six tools. One OS. Zero busywork."
          sub="Each tool solves exactly one of the pain points above."
          className="mb-20"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool, i) => {
            const Icon = ICON_MAP[tool.id];
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ToolCard
                  {...tool}
                  icon={Icon}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
