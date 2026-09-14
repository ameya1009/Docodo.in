"use client";

import React, { useState } from "react";
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCw, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Sliders, 
  Layers, 
  Check, 
  X,
  MessageSquare,
  ShieldCheck,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { 
  PREBUILT_AUTOMATION_TEMPLATES, 
  AutomationTemplate, 
  parseNaturalLanguageAutomation,
  AutomationExecutionRecord 
} from "@/lib/automations/automation-engine";

export default function AutomationsClient() {
  const [activeTab, setActiveTab] = useState<"templates" | "executions" | "builder">("templates");
  const [templates, setTemplates] = useState<AutomationTemplate[]>(PREBUILT_AUTOMATION_TEMPLATES);
  const [naturalPrompt, setNaturalPrompt] = useState("");
  const [generatedWorkflow, setGeneratedWorkflow] = useState<AutomationTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Sample real execution records for telemetry
  const [executions, setExecutions] = useState<AutomationExecutionRecord[]>([
    {
      id: "exec-101",
      automationId: "auto-booking-confirmation-reminder",
      automationName: "Booking Confirmation & 24h WhatsApp Reminder",
      businessId: "biz-current",
      triggerEvent: "BOOKING_CREATED",
      startedAt: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      completedAt: new Date(Date.now() - 15 * 60 * 1000 + 420).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      durationMs: 420,
      status: "SUCCESS",
      steps: [
        { nodeId: "node-1", nodeName: "New Booking Created", status: "SUCCESS", output: "Slot: 03:30 PM Tomorrow" },
        { nodeId: "node-2", nodeName: "Send WhatsApp Confirmation", status: "SUCCESS", output: "Delivered to +91 98200 12345" },
        { nodeId: "node-3", nodeName: "Wait Until 24 Hours Before Slot", status: "SUCCESS", output: "Timer scheduled in Vercel Cron" },
      ],
    },
    {
      id: "exec-102",
      automationId: "auto-review-collection",
      automationName: "Post-Service Google Review Collection",
      businessId: "biz-current",
      triggerEvent: "BOOKING_COMPLETED",
      startedAt: new Date(Date.now() - 120 * 60 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      completedAt: new Date(Date.now() - 120 * 60 * 1000 + 310).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      durationMs: 310,
      status: "SUCCESS",
      steps: [
        { nodeId: "node-1", nodeName: "Appointment Marked Completed", status: "SUCCESS", output: "Service: Hair Spa (₹650)" },
        { nodeId: "node-2", nodeName: "Delay 2 Hours", status: "SUCCESS", output: "Cooldown expired" },
        { nodeId: "node-3", nodeName: "Send Google Review Request", status: "SUCCESS", output: "Direct review link dispatched" },
      ],
    },
    {
      id: "exec-103",
      automationId: "auto-inactive-customer-reactivation",
      automationName: "30-Day Inactive Customer Re-Engagement",
      businessId: "biz-current",
      triggerEvent: "CUSTOMER_INACTIVE_30D",
      startedAt: new Date(Date.now() - 360 * 60 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      durationMs: 890,
      status: "SUCCESS",
      steps: [
        { nodeId: "node-1", nodeName: "Customer Inactive > 30 Days", status: "SUCCESS", output: "Target: 42 clients identified" },
        { nodeId: "node-2", nodeName: "Generate AI Offer via Gemini", status: "SUCCESS", output: "Personalized 15% discount copy" },
        { nodeId: "node-3", nodeName: "Owner 1-Click Blast", status: "SUCCESS", output: "Approved and ready in WhatsApp tab" },
      ],
    },
  ]);

  const toggleAutomation = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };

  const handleGenerateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalPrompt.trim()) return;
    const generated = parseNaturalLanguageAutomation(naturalPrompt);
    setGeneratedWorkflow(generated);
  };

  const handleActivateGenerated = () => {
    if (!generatedWorkflow) return;
    setTemplates((prev) => [generatedWorkflow, ...prev]);
    setGeneratedWorkflow(null);
    setNaturalPrompt("");
    setActiveTab("templates");
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesQuery = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || t.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--lime)] bg-[var(--lime-ghost)] px-2.5 py-0.5 rounded-full border border-[var(--lime)]/30">
              Autonomous Operating System
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Serverless Event Bus
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
            Docodo Automations &amp; Execution Hub
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Ready-to-run business workflows inspired by Make and n8n. Zero coding required.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "templates"
                ? "bg-[var(--lime)] text-black shadow-md"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <Layers size={14} /> Templates ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab("executions")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "executions"
                ? "bg-[var(--lime)] text-black shadow-md"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <RotateCw size={14} /> Execution Center ({executions.length})
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "builder"
                ? "bg-[var(--lime)] text-black shadow-md"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <Sparkles size={14} /> AI Builder
          </button>
        </div>
      </div>

      {/* ─── TAB 1: AUTOMATION TEMPLATES ─── */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search automations (e.g. reminder, review, inactive)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-xs text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)]/50"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["ALL", "GENERAL", "SALON", "CLINIC", "SPA", "GYM"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-white text-black font-black"
                      : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Automations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                className={`bg-[var(--bg-surface)] border rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all ${
                  t.isActive
                    ? "border-[var(--border-default)] hover:border-[var(--lime)]/50"
                    : "border-[var(--border-subtle)] opacity-70"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {t.category}
                    </span>
                    <button
                      onClick={() => toggleAutomation(t.id)}
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                        t.isActive
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${t.isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
                      {t.isActive ? "ACTIVE" : "PAUSED"}
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-white mt-2 font-display">
                    {t.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                    {t.description}
                  </p>

                  {/* Flow Pills */}
                  <div className="mt-4 p-3 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-1.5">
                    <div className="text-[10px] font-mono font-bold uppercase text-[var(--lime)]">
                      Trigger: {t.trigger}
                    </div>
                    <div className="flex flex-wrap gap-1 items-center text-[11px] text-[var(--text-secondary)]">
                      {t.actions.map((act, aIdx) => (
                        <span key={aIdx} className="inline-flex items-center gap-1 bg-[var(--bg-surface)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
                          <span>{act}</span>
                          {aIdx < t.actions.length - 1 && <ArrowRight size={10} className="text-[var(--text-muted)]" />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <div className="text-[var(--text-muted)] text-[11px] font-mono">
                    ⚡ {t.metrics.runsCount} executions • {t.metrics.successRate}%
                  </div>
                  <button
                    onClick={() => toggleAutomation(t.id)}
                    className="text-xs font-bold text-[var(--lime)] hover:underline"
                  >
                    {t.isActive ? "Configure" : "Enable"} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: EXECUTION CENTER & TELEMETRY ─── */}
      {activeTab === "executions" && (
        <div className="space-y-5">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <RotateCw size={18} className="text-[var(--lime)]" /> Real-Time Execution Telemetry
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Step-by-step audit logs of all automated business triggers, timing latencies, and outcomes.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                ● Vercel Worker Live
              </span>
            </div>

            <div className="space-y-3">
              {executions.map((ex) => (
                <div
                  key={ex.id}
                  className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-bold text-sm text-white">{ex.automationName}</span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">ID: {ex.id}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-[var(--text-secondary)]">Started: {ex.startedAt}</span>
                      <span className="text-emerald-400 font-bold">✓ {ex.durationMs}ms</span>
                    </div>
                  </div>

                  {/* Execution Steps Trace */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {ex.steps.map((step, sIdx) => (
                      <div key={sIdx} className="p-2.5 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-white truncate">{step.nodeName}</span>
                          <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                        </div>
                        {step.output && (
                          <div className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                            {step.output}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: NATURAL LANGUAGE AUTOMATION BUILDER ─── */}
      {activeTab === "builder" && (
        <div className="space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="max-w-2xl">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--lime)] bg-[var(--lime-ghost)] px-2.5 py-0.5 rounded-full border border-[var(--lime)]/30 inline-block mb-2">
                Prompt-to-Workflow Generator
              </span>
              <h2 className="text-2xl font-bold font-display text-white">
                Describe the Automation You Need
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Type what you want in plain English or Hinglish. Docodo will construct the triggers, delays, and WhatsApp actions automatically.
              </p>
            </div>

            <form onSubmit={handleGenerateWorkflow} className="space-y-3">
              <textarea
                rows={3}
                value={naturalPrompt}
                onChange={(e) => setNaturalPrompt(e.target.value)}
                placeholder='e.g., "When a customer completes an appointment, wait 2 hours, send a Google review request, and if they do not book for 30 days, send an automated comeback discount."'
                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl text-xs sm:text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)]/60"
              />
              <div className="flex justify-between items-center">
                <div className="text-[11px] text-[var(--text-muted)]">
                  💡 Hint: Mention triggers like booking, cancellation, 30 days inactive, or review requests.
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="font-bold shadow-[var(--lime-glow-sm)]"
                >
                  <Sparkles size={14} className="mr-1.5" /> Generate Workflow
                </Button>
              </div>
            </form>

            {/* Generated Workflow Preview */}
            {generatedWorkflow && (
              <div className="mt-6 p-6 bg-[var(--bg-elevated)] rounded-3xl border border-[var(--lime)]/40 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[var(--lime)]">
                      Generated Workflow Ready
                    </span>
                    <h3 className="text-lg font-bold text-white font-display mt-0.5">
                      {generatedWorkflow.name}
                    </h3>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleActivateGenerated}
                    className="font-bold shadow-[var(--lime-glow-sm)]"
                  >
                    <Check size={14} className="mr-1" /> Activate Automation
                  </Button>
                </div>

                {/* Nodes Display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {generatedWorkflow.nodes.map((node, nIdx) => (
                    <div
                      key={node.id}
                      className="p-3 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] space-y-1 relative"
                    >
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--lime)]">
                        {node.type}
                      </span>
                      <div className="text-xs font-bold text-white mt-1">
                        {node.name}
                      </div>
                      {nIdx < generatedWorkflow.nodes.length - 1 && (
                        <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-[var(--lime)] font-bold text-xs">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
