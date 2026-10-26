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
          eyebrow="Clinical Pilot Results"
          headline="Real Practice Workflows. Direct Doctor Feedback."
          sub="Case studies from our active clinical pilot cohorts in Pune & Mumbai."
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

        {/* Global Clinical Verification Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-[var(--border-subtle)]">
          <StatsCounter value={100} suffix="%" label="Direct UPI Settlement" />
          <StatsCounter value={0} suffix="%" label="Aggregator Take-Rate" />
          <StatsCounter value={99} suffix="%" label="WhatsApp Delivery Rate" />
          <StatsCounter value={15} suffix="min" label="Average Clinic Launch" />
        </div>
      </div>
    </section>
  );
};
