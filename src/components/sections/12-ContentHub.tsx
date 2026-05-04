"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Mic, FileText, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionElements";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/FeedbackElements";
import { WaveformBar } from "@/components/ui/AnimatedElements";
import { CONTENT_HUB } from "@/lib/constants";

export const ContentHub = () => {
  return (
    <section className="py-24 bg-[var(--bg-void)]">
      <div className="container">
        <SectionHeading
          eyebrow="From Ameya"
          headline="Learn while your competitors scroll."
          sub="Every week: real-world AI automation lessons from the founder."
          className="mb-20"
        />

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Column 1: YouTube */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                <Play size={20} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold">YouTube</h3>
            </div>
            {CONTENT_HUB.youtube.map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="bordered" className="group overflow-hidden">
                  <div className="relative aspect-video bg-[var(--bg-elevated)]">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-[var(--lime)] text-black flex items-center justify-center">
                        <Play size={24} fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-[10px] font-bold rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold group-hover:text-[var(--lime)] transition-colors line-clamp-1">{video.title}</h4>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Column 2: Spotify Podcast */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                <Mic size={20} />
              </div>
              <h3 className="text-xl font-bold">Podcast</h3>
            </div>
            {CONTENT_HUB.podcast.map((episode, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="bordered" className="p-6 group flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[var(--lime)] uppercase tracking-widest mb-1">New Episode</span>
                      <h4 className="text-sm font-bold group-hover:text-[var(--lime)] transition-colors">{episode.title}</h4>
                    </div>
                    <ArrowUpRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <WaveformBar />
                    <span className="text-[10px] font-bold text-[var(--text-muted)]">{episode.duration}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Column 3: Medium Blog */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-bold">Medium Blog</h3>
            </div>
            {CONTENT_HUB.blog.map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="bordered" className="p-6 group hover:bg-[var(--bg-elevated)] transition-all">
                  <h4 className="text-lg font-bold mb-4 group-hover:text-[var(--lime)] transition-colors">{article.title}</h4>
                  <div className="flex items-center justify-between">
                    <Badge variant="ghost">{article.readTime}</Badge>
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1 group-hover:text-[var(--text-primary)]">
                      Read Article <ArrowUpRight size={12} />
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
