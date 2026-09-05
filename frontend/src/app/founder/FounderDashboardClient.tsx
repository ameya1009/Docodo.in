"use client";

import React, { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles,
  Video,
  Layers,
  Send,
  MessageCircle,
  MapPin,
  Users,
  Building2,
  Calendar,
  DollarSign,
  Copy,
  Check,
  Loader2,
  LogOut,
  Bell,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  Filter,
  Phone,
  ArrowRight,
  Zap,
  HelpCircle,
  Clock,
  Briefcase,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface FounderDashboardProps {
  initialData: {
    totalBusinesses: number;
    totalCustomers: number;
    totalBookings: number;
    totalRevenue: number;
    recentBusinesses: any[];
    recentBookings: any[];
  };
}

interface FounderLead {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  city: string;
  industry: string;
  stage: "NEW_LEAD" | "CONTACTED" | "DEMO_SENT" | "TRIAL_ACTIVE" | "PAID_MERCHANT";
  expectedMonthly: number;
  notes?: string;
  createdAt: string;
}

const CRM_STAGES = [
  { id: "NEW_LEAD", label: "New Leads", color: "border-blue-500/40 text-blue-400 bg-blue-500/10" },
  { id: "CONTACTED", label: "Contacted / Pitched", color: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
  { id: "DEMO_SENT", label: "Demo Link Sent", color: "border-purple-500/40 text-purple-400 bg-purple-500/10" },
  { id: "TRIAL_ACTIVE", label: "14-Day Free Trial", color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10" },
  { id: "PAID_MERCHANT", label: "Paid Subscribed", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
] as const;

const INITIAL_LEADS: FounderLead[] = [
  {
    id: "lead-1",
    businessName: "Luxe Glow Salon & Spa",
    ownerName: "Priya Sharma",
    phone: "919876543210",
    city: "Pune (Kothrud)",
    industry: "Salons & Spas",
    stage: "TRIAL_ACTIVE",
    expectedMonthly: 2499,
    notes: "Tested 24/7 WhatsApp auto-booking. Impressed with zero no-show reminder alerts.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-2",
    businessName: "Dr. Kulkarni Dental Studio",
    ownerName: "Dr. Rohan Kulkarni",
    phone: "919823012345",
    city: "Pune (Baner)",
    industry: "Dental & Clinics",
    stage: "DEMO_SENT",
    expectedMonthly: 4999,
    notes: "Wants patient reminder automation via WhatsApp to stop last-minute cancellations.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-3",
    businessName: "IronFit CrossFit Gym",
    ownerName: "Sameer Patil",
    phone: "919765432109",
    city: "Mumbai (Andheri West)",
    industry: "Gyms & Trainers",
    stage: "CONTACTED",
    expectedMonthly: 2499,
    notes: "Pitched automated trial session scheduling. Follow-up scheduled for Friday.",
    createdAt: new Date().toISOString(),
  },
];

const CAMPAIGN_TABS = [
  { id: "INSTA_REEL_FOUNDER", label: "Instagram Reel Script", icon: Video, color: "text-amber-400", bg: "bg-amber-400/10", desc: "3s Hook + B-Roll + Script" },
  { id: "INSTA_CAROUSEL_FOUNDER", label: "Instagram Carousel", icon: Layers, color: "text-purple-400", bg: "bg-purple-400/10", desc: "5-Slide Educational Post" },
  { id: "COLD_WHATSAPP_PITCH", label: "WhatsApp Cold Pitch", icon: Send, color: "text-emerald-400", bg: "bg-emerald-400/10", desc: "14-Day Free Trial Offer" },
  { id: "INSTA_COLD_DM", label: "Instagram DM Script", icon: MessageCircle, color: "text-cyan-400", bg: "bg-cyan-400/10", desc: "3-Step DM Closing Flow" },
  { id: "GOOGLE_MAPS_OUTREACH", label: "Google Maps Script", icon: MapPin, color: "text-pink-400", bg: "bg-pink-400/10", desc: "For 4.5★ Local Stores" },
  { id: "OBJECTION_BUSTER", label: "Objection Buster", icon: HelpCircle, color: "text-orange-400", bg: "bg-orange-400/10", desc: "Handle 'Too Costly' / 'Pen & Paper'" },
  { id: "FOLLOWUP_SEQUENCE", label: "Follow-up Funnel", icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10", desc: "Day 1, 3, 7 Auto-Messages" },
  { id: "CONTENT_CALENDAR_7DAY", label: "7-Day Social Plan", icon: Calendar, color: "text-lime-400", bg: "bg-lime-400/10", desc: "Mon-Sun Ready-to-Post" },
];

const GMT_PRESET_AREAS = [
  { city: "Pune", areas: ["Kothrud", "Baner", "Viman Nagar", "FC Road", "Koregaon Park", "Wakad"] },
  { city: "Mumbai", areas: ["Bandra West", "Andheri West", "Juhu", "Powai", "Thane West"] },
  { city: "Bangalore", areas: ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield"] },
  { city: "Delhi NCR", areas: ["Gurgaon Cyber City", "South Extension", "Noida Sector 18"] },
];

const TARGET_PRESETS = [50000, 100000, 250000, 500000, 1000000];

export default function FounderDashboardClient({ initialData }: FounderDashboardProps) {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<"CRM" | "GMT" | "AI_MARKETING" | "TARGETS" | "PLATFORM">("CRM");

  // CRM State
  const [leads, setLeads] = useState<FounderLead[]>(INITIAL_LEADS);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    city: "Pune",
    industry: "Salons & Spas",
    expectedMonthly: 2499,
    notes: "",
  });

  // GMT (Google Maps Targeter) State
  const [gmtCity, setGmtCity] = useState("Pune");
  const [gmtArea, setGmtArea] = useState("Kothrud");
  const [gmtCategory, setGmtCategory] = useState("Salons & Spas");

  // AI Generator State
  const [targetRevenue, setTargetRevenue] = useState<number>(100000);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("Salons & Spas");
  const [selectedCampaignTab, setSelectedCampaignTab] = useState(CAMPAIGN_TABS[0]);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Load / Save Leads to LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("docodo_founder_leads");
      if (saved) {
        setLeads(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveLeads = (updated: FounderLead[]) => {
    setLeads(updated);
    try {
      localStorage.setItem("docodo_founder_leads", JSON.stringify(updated));
    } catch {}
  };

  const handleLogout = async () => {
    await fetch("/api/founder/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/founder/login");
    router.refresh();
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.businessName || !newLeadForm.phone) return;

    const newLead: FounderLead = {
      id: `lead-${Date.now()}`,
      businessName: newLeadForm.businessName,
      ownerName: newLeadForm.ownerName || "Business Owner",
      phone: newLeadForm.phone.replace(/[^0-9]/g, ""),
      city: newLeadForm.city,
      industry: newLeadForm.industry,
      stage: "NEW_LEAD",
      expectedMonthly: Number(newLeadForm.expectedMonthly) || 2499,
      notes: newLeadForm.notes,
      createdAt: new Date().toISOString(),
    };

    saveLeads([newLead, ...leads]);
    setIsAddingLead(false);
    setNewLeadForm({
      businessName: "",
      ownerName: "",
      phone: "",
      city: "Pune",
      industry: "Salons & Spas",
      expectedMonthly: 2499,
      notes: "",
    });
  };

  const handleAdvanceStage = (leadId: string) => {
    const stageOrder: FounderLead["stage"][] = ["NEW_LEAD", "CONTACTED", "DEMO_SENT", "TRIAL_ACTIVE", "PAID_MERCHANT"];
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        const currIdx = stageOrder.indexOf(l.stage);
        const nextStage = stageOrder[Math.min(currIdx + 1, stageOrder.length - 1)];
        return { ...l, stage: nextStage };
      }
      return l;
    });
    saveLeads(updated);
  };

  const handleDeleteLead = (leadId: string) => {
    saveLeads(leads.filter((l) => l.id !== leadId));
  };

  const handleGenerateCampaign = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/founder/generate-campaign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignType: selectedCampaignTab.id,
            targetIndustry: selectedIndustry,
          }),
        });
        const data = await res.json();
        if (data.success && data.content) {
          setGeneratedContent(data.content);
        } else {
          setGeneratedContent("Generation failed. Please retry.");
        }
      } catch (err: any) {
        setGeneratedContent(`Failed to generate campaign: ${err?.message || "Unknown error"}`);
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppQuickPitch = (lead: FounderLead) => {
    const message = encodeURIComponent(
      `Hi ${lead.ownerName}, Ameya here from Docodo.in!\n\nI noticed your great customer reviews for ${lead.businessName} in ${lead.city}. We help local salons & clinics stop 30% appointment no-shows and automate 24/7 bookings on WhatsApp with zero commission.\n\nWould you like to try a 14-day free setup? You can test our interactive demo here: https://docodo.in/demo`
    );
    window.open(`https://wa.me/${lead.phone}?text=${message}`, "_blank");
  };

  const handleOpenGoogleMapsSearch = () => {
    const query = encodeURIComponent(`${gmtCategory} in ${gmtArea}, ${gmtCity}`);
    window.open(`https://www.google.com/maps/search/${query}`, "_blank");
  };

  // Pipeline Math
  const totalPipelineValue = leads.reduce((sum, l) => sum + l.expectedMonthly, 0);
  const paidMonthlyMRR = leads.filter((l) => l.stage === "PAID_MERCHANT").reduce((sum, l) => sum + l.expectedMonthly, 0);
  const activeTrialsCount = leads.filter((l) => l.stage === "TRIAL_ACTIVE").length;

  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)] pb-24 selection:bg-[var(--lime)] selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-void)]/85 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--lime-ghost)] border border-[var(--lime)]/30 flex items-center justify-center text-[var(--lime)] shadow-[var(--lime-glow-sm)]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight font-display text-[var(--lime)]">Docodo</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--lime)]/15 text-[var(--lime)] border border-[var(--lime)]/30 font-mono font-bold uppercase">
                  Founder Master OS
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Ameya Kshirsagar &middot; ameyakshirsagar@docodo.in</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <Phone size={12} /> +91 9284310604 Alert Active
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] transition-colors"
            >
              <LogOut size={13} /> Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            { id: "CRM", label: "Lead Acquisition CRM", icon: Users, badge: `${leads.length}` },
            { id: "GMT", label: "Google Maps Targeter (GMT)", icon: MapPin, badge: "Live" },
            { id: "AI_MARKETING", label: "AI Marketing & Automations", icon: Sparkles, badge: "8 Tools" },
            { id: "TARGETS", label: "₹1,00,000 Milestone Planner", icon: Target, badge: "Math" },
            { id: "PLATFORM", label: "Global Platform KPIs", icon: Activity, badge: `${initialData.totalBusinesses} Stores` },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  active
                    ? "bg-[var(--lime)] text-black border-[var(--lime)] shadow-[var(--lime-glow-sm)]"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-white hover:border-[var(--lime)]/30"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${active ? "bg-black/20 text-black" : "bg-black/40 text-[var(--lime)]"}`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* ==================== TAB 1: FOUNDER LEAD ACQUISITION CRM ==================== */}
        {activeMainTab === "CRM" && (
          <div className="space-y-6">
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-xs text-[var(--text-muted)] font-bold uppercase">Total Pipeline Leads</span>
                <div className="text-2xl font-black text-[var(--text-primary)]">{leads.length} Prospects</div>
                <p className="text-[11px] text-[var(--text-secondary)]">Potential Monthly GMV: {formatCurrency(totalPipelineValue)}/mo</p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-cyan-500/30 bg-cyan-500/5 space-y-1">
                <span className="text-xs text-cyan-400 font-bold uppercase">Active 14-Day Free Trials</span>
                <div className="text-2xl font-black text-cyan-400">{activeTrialsCount} Stores</div>
                <p className="text-[11px] text-[var(--text-muted)]">Currently testing automated WhatsApp bookings</p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--lime)]/30 bg-[var(--lime-ghost)]/30 space-y-1">
                <span className="text-xs text-[var(--lime)] font-bold uppercase">Active Subscribed MRR</span>
                <div className="text-2xl font-black text-[var(--lime)]">{formatCurrency(paidMonthlyMRR)}/mo</div>
                <p className="text-[11px] text-[var(--text-muted)]">Direct founder recurring SaaS revenue</p>
              </div>
            </div>

            {/* CRM Controls */}
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                    <Users size={18} className="text-[var(--lime)]" /> Docodo Merchant Acquisition Pipeline
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Track leads from initial pitch to active paying stores. Launch 1-click WhatsApp demo pitches.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingLead(!isAddingLead)}
                  className="px-3.5 py-2 rounded-xl bg-[var(--lime)] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-sm)]"
                >
                  <Plus size={14} /> Add New Lead
                </button>
              </div>

              {/* Add Lead Form Modal */}
              <AnimatePresence>
                {isAddingLead && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddLead}
                    className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--lime)]/30 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                      <span className="text-xs font-bold text-[var(--lime)] uppercase">Enter Lead Details</span>
                      <button type="button" onClick={() => setIsAddingLead(false)} className="text-xs text-[var(--text-muted)] hover:text-white">Cancel</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Business Name (e.g. Envy Hair Studio)"
                        value={newLeadForm.businessName}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, businessName: e.target.value })}
                        className="px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)]"
                      />
                      <input
                        type="text"
                        placeholder="Owner Name (e.g. Rahul Patil)"
                        value={newLeadForm.ownerName}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, ownerName: e.target.value })}
                        className="px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="WhatsApp Phone (e.g. 919876543210)"
                        value={newLeadForm.phone}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                        className="px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)] font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="City / Area (e.g. Pune - Baner)"
                        value={newLeadForm.city}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                        className="px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)]"
                      />
                      <select
                        value={newLeadForm.industry}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, industry: e.target.value })}
                        className="px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)]"
                      >
                        {["Salons & Spas", "Dental & Clinics", "Gyms & Trainers", "Car Detailing", "Beauty Parlours", "Coaching Institutes"].map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Expected Plan (₹2,499)"
                        value={newLeadForm.expectedMonthly}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, expectedMonthly: Number(e.target.value) })}
                        className="px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)] font-mono"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Notes / Current Booking Method (e.g. Takes calls while attending clients)"
                      value={newLeadForm.notes}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)]"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 bg-[var(--lime)] text-black font-bold text-xs rounded-xl hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-sm)]"
                    >
                      Save Lead to CRM
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* CRM Pipeline Kanban Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {CRM_STAGES.map((stage) => {
                  const stageLeads = leads.filter((l) => l.stage === stage.id);
                  return (
                    <div key={stage.id} className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col min-h-[380px]">
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] mb-3">
                        <span className="text-[11px] font-bold text-[var(--text-primary)]">{stage.label}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${stage.color}`}>
                          {stageLeads.length}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-1">
                        {stageLeads.length === 0 ? (
                          <div className="text-center py-10 text-[11px] text-[var(--text-muted)]">No leads in stage</div>
                        ) : (
                          stageLeads.map((lead) => (
                            <div key={lead.id} className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 hover:border-[var(--lime)]/40 transition-colors shadow-sm">
                              <div className="flex items-start justify-between">
                                <h4 className="text-xs font-bold text-[var(--text-primary)] leading-tight">{lead.businessName}</h4>
                                <button onClick={() => handleDeleteLead(lead.id)} className="text-[var(--text-muted)] hover:text-[var(--danger)] p-0.5">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <p className="text-[10px] text-[var(--text-muted)]">{lead.ownerName} &middot; {lead.city}</p>

                              {lead.notes && (
                                <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2 bg-[var(--bg-elevated)] p-1.5 rounded-lg">
                                  {lead.notes}
                                </p>
                              )}

                              <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
                                <button
                                  onClick={() => handleWhatsAppQuickPitch(lead)}
                                  className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-500/20"
                                >
                                  <Send size={10} /> Pitch WA
                                </button>
                                {stage.id !== "PAID_MERCHANT" && (
                                  <button
                                    onClick={() => handleAdvanceStage(lead.id)}
                                    className="px-2 py-1 rounded-lg bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 text-[10px] font-bold flex items-center gap-0.5 hover:bg-[var(--lime)]/20"
                                    title="Advance Stage"
                                  >
                                    Next <ChevronRight size={10} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: GOOGLE MAPS TARGETER (GMT) ==================== */}
        {activeMainTab === "GMT" && (
          <div className="p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--lime)] uppercase mb-1">
                  <MapPin size={14} /> Google Maps Targeter (GMT)
                </div>
                <h2 className="text-xl font-black text-[var(--text-primary)] font-display">
                  Local Merchant Prospecting & Search Engine
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Discover 4.5★ rated local businesses that lack an instant booking system and pitch Docodo.in directly.
                </p>
              </div>
              <button
                onClick={handleOpenGoogleMapsSearch}
                className="px-4 py-2.5 rounded-xl bg-[var(--lime)] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-sm)] shrink-0"
              >
                <Search size={14} /> Open Live Google Maps Search <ExternalLink size={12} />
              </button>
            </div>

            {/* GMT Query Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Select City</label>
                <select
                  value={gmtCity}
                  onChange={(e) => {
                    setGmtCity(e.target.value);
                    const matched = GMT_PRESET_AREAS.find((p) => p.city === e.target.value);
                    if (matched && matched.areas[0]) setGmtArea(matched.areas[0]);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)]"
                >
                  {GMT_PRESET_AREAS.map((c) => (
                    <option key={c.city} value={c.city}>{c.city}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Neighborhood / Hub</label>
                <select
                  value={gmtArea}
                  onChange={(e) => setGmtArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)]"
                >
                  {(GMT_PRESET_AREAS.find((c) => c.city === gmtCity)?.areas || ["Central"]).map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Business Category</label>
                <select
                  value={gmtCategory}
                  onChange={(e) => setGmtCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)]"
                >
                  {["Luxury Salons & Spas", "Dental & Skin Clinics", "Physiotherapy & Chiropractor", "CrossFit & Fitness Gyms", "Car Detailing & Ceramic Coating", "Bridal Makeup Artists"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* GMT Ready Archetypes & Pitch Engine */}
            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--lime)]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-[var(--lime)]" />
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase">
                    Target Search: {gmtCategory} in {gmtArea}, {gmtCity}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedCampaignTab(CAMPAIGN_TABS[4]);
                    setSelectedIndustry(gmtCategory);
                    setActiveMainTab("AI_MARKETING");
                  }}
                  className="text-xs font-bold text-[var(--lime)] hover:underline flex items-center gap-1"
                >
                  Generate Pitch Script <ArrowRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-primary)]">Step 1: Open Google Maps</span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">Query</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Search <code>&quot;{gmtCategory} in {gmtArea}&quot;</code>. Filter for businesses with 50+ reviews.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-primary)]">Step 2: Check Booking Link</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono">Spot Gap</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    If they only list a standard landline or phone number without a booking link, they are prime candidates.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-primary)]">Step 3: Send 1-Tap Demo</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono">Pitch</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Send them a personalized WhatsApp pitch offering a 14-day free setup on <code>docodo.in/demo</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: AI MARKETING & AUTOMATION SUITE ==================== */}
        {activeMainTab === "AI_MARKETING" && (
          <div className="p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--lime)] uppercase mb-1">
                <Sparkles size={14} /> Autonomous Growth Engine
              </div>
              <h2 className="text-xl font-black text-[var(--text-primary)] font-display">
                Docodo.in Self-Marketing AI Suite
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Generate high-converting social media posts, reel scripts, objection handling, and WhatsApp nurturing sequences.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Controls */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Target Merchant Industry
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Salons & Spas", "Dental & Clinics", "Gyms & Trainers", "Car Detailing", "Beauty Parlours", "Coaching Classes"].map((ind) => (
                      <button
                        key={ind}
                        onClick={() => setSelectedIndustry(ind)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all ${
                          selectedIndustry === ind
                            ? "bg-[var(--lime-ghost)] text-[var(--lime)] border-[var(--lime)]/40"
                            : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-white"
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Select Tool / Copy Model
                  </label>
                  <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                    {CAMPAIGN_TABS.map((tab) => {
                      const Icon = tab.icon;
                      const isSelected = selectedCampaignTab.id === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setSelectedCampaignTab(tab);
                            setGeneratedContent("");
                          }}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left border transition-all ${
                            isSelected
                              ? "bg-[var(--lime-ghost)] border-[var(--lime)]/30 text-[var(--lime)]"
                              : "bg-[var(--bg-elevated)] border-transparent text-[var(--text-secondary)] hover:text-white"
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tab.bg}`}>
                            <Icon size={14} className={tab.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{tab.label}</p>
                            <p className="text-[10px] text-[var(--text-muted)] truncate">{tab.desc}</p>
                          </div>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleGenerateCampaign}
                  disabled={isPending}
                  className="w-full py-3.5 bg-[var(--lime)] text-black font-black text-xs rounded-xl hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-md)] flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-wider"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Generating AI Copy...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} /> Generate {selectedCampaignTab.label}
                    </>
                  )}
                </button>
              </div>

              {/* Right Output */}
              <div className="lg:col-span-7 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden flex flex-col min-h-[440px]">
                <div className="px-5 py-3.5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {selectedCampaignTab.label} &middot; {selectedIndustry}
                  </span>
                  {generatedContent && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleGenerateCampaign}
                        disabled={isPending}
                        className="p-1.5 text-[var(--text-muted)] hover:text-white transition-colors"
                        title="Regenerate"
                      >
                        <RefreshCw size={14} className={isPending ? "animate-spin" : ""} />
                      </button>
                      <button
                        onClick={() => handleCopy(generatedContent)}
                        className="flex items-center gap-1 px-3 py-1 bg-[var(--lime-ghost)] text-[var(--lime)] rounded-lg text-xs font-bold hover:bg-[var(--lime)]/20 transition-colors"
                      >
                        {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {isPending ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 gap-3 text-center"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[var(--lime-ghost)] flex items-center justify-center">
                          <Sparkles size={24} className="text-[var(--lime)] animate-pulse" />
                        </div>
                        <p className="text-xs text-[var(--text-muted)] font-medium">
                          Crafting viral client acquisition copy for Docodo.in...
                        </p>
                      </motion.div>
                    ) : generatedContent ? (
                      <motion.div key="content" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                        <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-[var(--text-primary)]">
                          {generatedContent}
                        </pre>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-2">
                        <Sparkles size={28} className="mx-auto text-[var(--text-muted)] mb-2" />
                        <p className="text-xs font-bold text-[var(--text-secondary)]">
                          Ready to generate high-converting outreach copy
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] max-w-sm mx-auto">
                          Select your tool and target category, then click &quot;Generate&quot; to create production-ready scripts.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: REVENUE & MILESTONE PLANNER ==================== */}
        {activeMainTab === "TARGETS" && (
          <div className="p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--lime)] uppercase mb-1">
                  <Target size={14} /> Revenue Milestones
                </div>
                <h2 className="text-xl font-black text-[var(--text-primary)] font-display">
                  Monthly Income & Merchant Math Planner
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {TARGET_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTargetRevenue(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      targetRevenue === preset
                        ? "bg-[var(--lime)] text-black border-[var(--lime)] shadow-[var(--lime-glow-sm)]"
                        : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-white"
                    }`}
                  >
                    ₹{(preset / 1000).toLocaleString("en-IN")}k/mo
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Starter SaaS (₹999/Mo)</span>
                </div>
                <div className="text-3xl font-black text-[var(--text-primary)]">
                  {Math.ceil(targetRevenue / 999)} <span className="text-xs font-medium text-[var(--text-muted)]">stores</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Requires onboarding ~{Math.ceil(targetRevenue / 999 / 4)} local salons/clinics per week.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--lime)]/40 relative space-y-3 shadow-md bg-[var(--lime-ghost)]/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Growth SaaS (₹2,499/Mo)</span>
                  <span className="px-2 py-0.5 bg-[var(--lime)] text-black font-bold text-[10px] rounded-full uppercase">Optimal</span>
                </div>
                <div className="text-3xl font-black text-[var(--lime)]">
                  {Math.ceil(targetRevenue / 2499)} <span className="text-xs font-medium text-[var(--text-muted)]">stores</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Just {Math.ceil(targetRevenue / 2499)} active stores to hit steady <strong className="text-white">₹{targetRevenue.toLocaleString("en-IN")}/month</strong> income.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Pro / Custom Setup (₹4,999/Mo)</span>
                </div>
                <div className="text-3xl font-black text-purple-400">
                  {Math.ceil(targetRevenue / 4999)} <span className="text-xs font-medium text-[var(--text-muted)]">stores</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Includes custom domain, dedicated WhatsApp number branding, and priority care.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: GLOBAL PLATFORM OVERVIEW ==================== */}
        {activeMainTab === "PLATFORM" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl">
                <div className="text-xs text-[var(--text-muted)] font-bold mb-1">Total Stores</div>
                <div className="text-2xl font-black text-[var(--text-primary)]">{initialData.totalBusinesses}</div>
              </div>
              <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl">
                <div className="text-xs text-[var(--text-muted)] font-bold mb-1">Total End Customers</div>
                <div className="text-2xl font-black text-blue-400">{initialData.totalCustomers}</div>
              </div>
              <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl">
                <div className="text-xs text-[var(--text-muted)] font-bold mb-1">Total Platform Bookings</div>
                <div className="text-2xl font-black text-purple-400">{initialData.totalBookings}</div>
              </div>
              <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl">
                <div className="text-xs text-[var(--text-muted)] font-bold mb-1">Processed Volume (GMV)</div>
                <div className="text-2xl font-black text-[var(--lime)]">{formatCurrency(initialData.totalRevenue)}</div>
              </div>
            </div>

            {/* Recent Registered Businesses */}
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Recently Registered Businesses</h3>
              <div className="divide-y divide-[var(--border-subtle)]">
                {initialData.recentBusinesses.map((b: any) => (
                  <div key={b.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">{b.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{b.industry} &middot; {b.city || "India"}</p>
                    </div>
                    <a
                      href={`/book/${b.slug}`}
                      target="_blank"
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] text-[var(--lime)] text-xs font-bold hover:bg-[var(--lime-ghost)] transition-colors flex items-center gap-1"
                    >
                      View Store <ExternalLink size={11} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
