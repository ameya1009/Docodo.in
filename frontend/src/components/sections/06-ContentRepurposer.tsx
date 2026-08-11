"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Video, 
  Layers, 
  Mail, 
  MessageSquare, 
  Play, 
  CheckCircle2,
  Loader2
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionElements";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/FeedbackElements";
import { repurposeContent } from "@/lib/actions/ai";

const ASSETS = [
  { 
    id: "medium", 
    title: "Medium Article", 
    icon: FileText, 
    tag: "1,200 words · SEO optimized", 
    preview: "Most Pune clinics lose 40% of their leads simply because..." 
  },
  { 
    id: "reels", 
    title: "5 Reel Scripts", 
    icon: Video, 
    tag: "30–60 second scripts", 
    preview: "Hook: What if I told you your business is leaking ₹20k?" 
  },
  { 
    id: "linkedin", 
    title: "LinkedIn Carousel", 
    icon: Layers, 
    tag: "10 slides · design-ready", 
    preview: "Slide 1: 5 Ways to Automate Your Small Business..." 
  },
  { 
    id: "email", 
    title: "Email Newsletter", 
    icon: Mail, 
    tag: "Ready for Brevo", 
    preview: "Subject: Stop missing leads while you sleep." 
  },
  { 
    id: "whatsapp", 
    title: "WhatsApp Broadcast", 
    icon: MessageSquare, 
    tag: "Under 1,024 chars", 
    preview: "Hey! We've just launched a new AI-powered service..." 
  },
];

export const ContentRepurposer = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "completed">("idle");
  const [progress, setProgress] = useState(0);
  const [generatedAssets, setGeneratedAssets] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!url) return;
    
    setStatus("processing");
    setProgress(15);
    
    // Simulate slow transcription progress while waiting for API
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 2 : prev));
    }, 200);

    const result = await repurposeContent(url);
    clearInterval(interval);
    
    if (result.assets) {
      // Map string icons to Lucide components
      const iconMap: any = { FileText, Video, Layers, Mail, MessageSquare };
      const formatted = result.assets.map((a: any) => ({ ...a, icon: iconMap[a.icon] || FileText }));
      setGeneratedAssets(formatted);
      setProgress(100);
      setStatus("completed");
    } else {
      setStatus("idle");
      alert(result.error || "Failed to generate assets.");
    }
  };

  return (
    <section className="py-24 bg-[var(--bg-deep)] overflow-hidden">
      <div className="container">
        <SectionHeading
          eyebrow="Content Repurposer"
          headline="Record once. Publish everywhere."
          sub="Paste a YouTube link. Get a Medium article, 5 reel scripts, a LinkedIn carousel, and an email newsletter. In one click."
          className="mb-16"
        />

        <div className="max-w-4xl mx-auto">
          {/* Input Area */}
          <Card variant="elevated" className="p-8 mb-12 border-white/5 bg-[var(--bg-surface)]">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-[var(--bg-void)] border border-[var(--border-strong)] rounded-[var(--radius-sm)] py-4 px-6 text-[var(--text-primary)] outline-none focus:border-[var(--lime)]/50 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Play size={18} className="text-[var(--text-muted)]" />
                </div>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleGenerate}
                disabled={status === "processing"}
                className="min-w-[200px]"
              >
                {status === "processing" ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : "Repurpose Content"}
              </Button>
            </div>

            {/* Progress Bar */}
            {status === "processing" && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-[var(--lime)] uppercase tracking-widest">
                    Transcribing → Analyzing → Generating...
                  </span>
                  <span className="text-[10px] font-bold text-[var(--lime)]">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--bg-void)] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[var(--lime)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Asset Output Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative min-h-[400px]">
            <AnimatePresence>
              {status === "completed" ? (
                generatedAssets.map((asset, i) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      type: "spring", 
                      damping: 15, 
                      stiffness: 100, 
                      delay: i * 0.1 
                    }}
                  >
                    <Card variant="bordered" className="p-6 h-full flex flex-col group">
                      <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <asset.icon size={20} />
                      </div>
                      <h4 className="font-bold mb-2">{asset.title}</h4>
                      <Badge variant="ghost" className="mb-4 self-start">{asset.tag}</Badge>
                      <p className="text-xs text-[var(--text-muted)] italic line-clamp-3 bg-[var(--bg-void)] p-3 rounded border border-white/5">
                        "{asset.preview}"
                      </p>
                      <div className="mt-auto pt-4 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[var(--lime)] uppercase tracking-widest cursor-pointer hover:underline">Copy HTML</span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest cursor-pointer hover:text-[var(--text-primary)]">Download</span>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                status === "idle" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-[var(--radius-xl)]">
                    <Video size={48} className="text-[var(--text-disabled)] mb-4" />
                    <h4 className="text-lg text-[var(--text-muted)] font-medium">Ready to repurpose</h4>
                    <p className="text-sm text-[var(--text-disabled)]">Enter a YouTube URL above to see the magic.</p>
                  </div>
                )
              )}
            </AnimatePresence>
          </div>

          {/* Pricing Hint */}
          <div className="mt-12 text-center">
            <p className="text-[var(--text-muted)] text-sm">
              Free: 1 job/mo · <span className="text-[var(--lime)] font-bold">₹799/mo: unlimited</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
