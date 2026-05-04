"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionElements";
import { TestimonialCard } from "@/components/ui/SpecialtyComponents";
import { StatsCounter } from "@/components/ui/AnimatedElements";
import { CASE_STUDIES } from "@/lib/constants";

export const CaseStudies = () => {
  return (
    <section className="py-24 bg-[var(--bg-void)]">
      <div className="container">
        <SectionHeading
          eyebrow="Real Results"
          headline="47 Pune businesses. Real numbers."
          sub="These aren't estimates. These are actual results from active clients."
          className="mb-20"
        />

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {CASE_STUDIES.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TestimonialCard {...study} />
            </motion.div>
          ))}
        </div>

        {/* Global Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-[var(--border-subtle)]">
          <StatsCounter value={47} label="Businesses Served" />
          <StatsCounter value={23} suffix="L+" label="Revenue Generated" />
          <StatsCounter value={98} suffix="%" label="Bot Reply Rate" />
          <StatsCounter value={4.8} label="Average Client Rating" />
        </div>
      </div>
    </section>
  );
};
