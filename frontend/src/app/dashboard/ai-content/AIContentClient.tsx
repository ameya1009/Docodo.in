"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, Loader2, RefreshCw, Instagram, MessageSquare, FileText, HelpCircle, Star } from "lucide-react";
import { generateAIPost } from "@/lib/actions/dashboard";
import { cn } from "@/lib/utils";

const CONTENT_TYPES = [
  { id: "INSTAGRAM", label: "Instagram Post", icon: Instagram, description: "Engaging post with emojis & hashtags", color: "text-pink-400", bg: "bg-pink-400/10" },
  { id: "WHATSAPP", label: "WhatsApp Campaign", icon: MessageSquare, description: "Promotional broadcast message", color: "text-[var(--success)]", bg: "bg-[var(--success)]/10" },
  { id: "BLOG", label: "Blog Article", icon: FileText, description: "SEO-optimised blog content outline", color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "FAQ", label: "FAQ Section", icon: HelpCircle, description: "Common customer questions answered", color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "REVIEW_REPLY", label: "Review Reply", icon: Star, description: "Professional response to 5-star reviews", color: "text-[var(--warning)]", bg: "bg-[var(--warning)]/10" },
];

interface AIContentClientProps {
  business: { id: string; name: string; industry: string };
  existingContent: Array<{ id: string; type: string; content: string; createdAt: Date }>;
}

export default function AIContentClient({ business, existingContent }: AIContentClientProps) {
  const [selectedType, setSelectedType] = useState(CONTENT_TYPES[0]);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(existingContent);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const content = await generateAIPost(selectedType.id);
        setGeneratedContent(content);
        setHistory((prev) => [
          { id: Date.now().toString(), type: selectedType.id, content, createdAt: new Date() },
          ...prev,
        ]);
      } catch (err) {
        setGeneratedContent("Failed to generate content. Please try again.");
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">AI Content Generator</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Generate professional content for {business.name} in seconds</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generator Panel */}
        <div className="space-y-5">
          {/* Type Selector */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">What to generate?</h3>
            <div className="space-y-2">
              {CONTENT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType.id === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => { setSelectedType(type); setGeneratedContent(""); }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border",
                      isSelected
                        ? "bg-[var(--lime-ghost)] border-[var(--lime)]/30"
                        : "border-transparent hover:bg-[var(--bg-elevated)]"
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", type.bg)}>
                      <Icon size={17} className={type.color} />
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-sm font-bold", isSelected ? "text-[var(--lime)]" : "text-[var(--text-primary)]")}>
                        {type.label}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">{type.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-[var(--lime)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isPending}
            className="w-full py-4 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-[var(--lime-glow-md)]"
          >
            {isPending ? (
              <><Loader2 size={18} className="animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={18} /> Generate {selectedType.label}</>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
            <h3 className="font-bold text-sm text-[var(--text-primary)]">Generated Content</h3>
            {generatedContent && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isPending}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw size={15} className={isPending ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => handleCopy(generatedContent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--lime)] bg-[var(--lime-ghost)] rounded-lg hover:bg-[var(--lime)]/15 transition-colors"
                >
                  {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>
            )}
          </div>

          <div className="p-5 min-h-[300px]">
            <AnimatePresence mode="wait">
              {isPending ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[260px] gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--lime-ghost)] flex items-center justify-center">
                    <Sparkles size={24} className="text-[var(--lime)] animate-pulse" />
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">AI is writing your {selectedType.label.toLowerCase()}...</p>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-[var(--lime)] rounded-full animate-[bounce-dots_1.2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </motion.div>
              ) : generatedContent ? (
                <motion.div key="content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <pre className="whitespace-pre-wrap text-sm text-[var(--text-primary)] font-sans leading-relaxed">
                    {generatedContent}
                  </pre>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[260px] text-center">
                  <Sparkles size={32} className="text-[var(--text-disabled)] mb-3" />
                  <p className="text-sm text-[var(--text-muted)]">Select a content type and click generate</p>
                  <p className="text-xs text-[var(--text-disabled)] mt-1">Powered by Google Gemini AI</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Generated History</h2>
          <div className="space-y-3">
            {history.slice(0, 10).map((item) => {
              const type = CONTENT_TYPES.find((t) => t.id === item.type);
              const Icon = type?.icon ?? Sparkles;
              return (
                <div key={item.id} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex items-start gap-4">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", type?.bg ?? "bg-[var(--bg-elevated)]")}>
                    <Icon size={15} className={type?.color ?? "text-[var(--text-muted)]"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">{type?.label}</p>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{item.content}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(item.content)}
                    className="shrink-0 p-1.5 text-[var(--text-muted)] hover:text-[var(--lime)] transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
