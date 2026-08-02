"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, Zap, TrendingUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionElements";
import { PlanCard } from "@/components/ui/SpecialtyComponents";
import { CARE_PLANS, NAVIGATION } from "@/lib/constants";
import { useUIStore } from "@/store/ui";

const TAGLINE_ICONS = {
  "No lock-in": ShieldCheck,
  "48-hr setup": Zap,
  "ROI or free rebuild": TrendingUp,
  "WhatsApp support": MessageSquare,
};

export const CarePlans = () => {
  const { billingCycle, setBillingCycle, selectedPlan, setSelectedPlan } = useUIStore();
  const [roiSale, setRoiSale] = useState(5000);
  const [roiLeads, setRoiLeads] = useState(2);

  const extraRevenue = roiSale * roiLeads;
  const planCost = 2499; // Base cost for comparison
  const roiMultiplier = (extraRevenue / planCost).toFixed(1);

  return (
    <section id="care-plans" className="py-24 bg-[var(--bg-void)] relative">
      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--lime)]/10 blur-[100px] rounded-full" />

      <div className="container">
        <SectionHeading
          eyebrow="Docodo Care Plans"
          headline="Stop paying per project. Start owning your growth."
          sub="Monthly AI-powered tools, bots & marketing — running 24/7 for your business."
          className="mb-12"
        />

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={cn("text-sm font-bold transition-colors", billingCycle === "monthly" ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]")}>
            Monthly
          </span>
          <button 
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className="relative w-12 h-6 bg-[var(--bg-elevated)] rounded-full p-1"
          >
            <motion.div 
              animate={{ x: billingCycle === "monthly" ? 0 : 24 }}
              className="w-4 h-4 bg-[var(--lime)] rounded-full"
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-bold transition-colors", billingCycle === "annual" ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]")}>
              Annual
            </span>
            <motion.span 
              initial={false}
              animate={{ opacity: billingCycle === "annual" ? 1 : 0.4, scale: billingCycle === "annual" ? 1 : 0.9 }}
              className="px-2 py-0.5 bg-[var(--lime-ghost)] text-[var(--lime)] text-[10px] font-black uppercase rounded-xs border border-[var(--lime)]/20"
            >
              Save 20%
            </motion.span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {CARE_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              {...plan}
              price={billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
              selected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>

        {/* Guarantee Tiles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { label: "No lock-in", text: "Cancel any plan with 30 days notice. Zero hidden fees." },
            { label: "48-hr setup", text: "From payment to live bot — this week, not next month." },
            { label: "ROI or free rebuild", text: "No measurable lead growth in 60 days? We rebuild at no charge." },
            { label: "WhatsApp support", text: "Your account manager is on WhatsApp. Real replies. Real person." },
          ].map((item, i) => {
            const Icon = TAGLINE_ICONS[item.label as keyof typeof TAGLINE_ICONS];
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-md bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <h5 className="font-bold text-sm">{item.label}</h5>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ROI Calculator */}
        <div className="max-w-4xl mx-auto p-8 md:p-12 bg-lime-gradient-bg rounded-[var(--radius-xl)] relative overflow-hidden border border-[var(--lime)]/10">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-2xl font-black mb-6">If we help you close just 2 extra leads/month →</h4>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm font-bold text-[var(--text-secondary)]">Average sale value</span>
                    <span className="text-sm font-bold text-[var(--lime)]">₹{roiSale.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="2000" max="20000" step="1000" value={roiSale} 
                    onChange={(e) => setRoiSale(Number(e.target.value))}
                    className="w-full accent-[var(--lime)]"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm font-bold text-[var(--text-secondary)]">Extra leads per month</span>
                    <span className="text-sm font-bold text-[var(--lime)]">{roiLeads}</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" step="1" value={roiLeads} 
                    onChange={(e) => setRoiLeads(Number(e.target.value))}
                    className="w-full accent-[var(--lime)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-8 bg-[var(--bg-void)]/40 backdrop-blur-md rounded-[var(--radius-lg)] border border-white/5">
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Extra Revenue</div>
              <div className="text-5xl font-black text-[var(--lime)] mb-2">₹{extraRevenue.toLocaleString()}</div>
              <div className="text-sm text-[var(--text-secondary)] mb-6">per month</div>
              
              <div className="w-full h-[1px] bg-white/10 mb-6" />
              
              <div className="grid grid-cols-2 gap-8 w-full">
                <div>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Plan Cost</div>
                  <div className="text-lg font-bold">₹{planCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Estimated ROI</div>
                  <div className="text-lg font-bold text-[var(--lime)]">{roiMultiplier}x</div>
                </div>
              </div>
            </div>
          </div>
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--lime)]/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Tools Strip */}
        <div className="mt-24 pt-12 border-t border-[var(--border-subtle)]">
          <p className="text-center text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-8">Powering your growth with the world's best tech</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "WhatsApp Business API", "Botpress", "n8n", "GoHighLevel", "Google Business Profile", 
              "Brevo", "Canva AI", "Razorpay", "Semrush", "Claude AI", "ManyChat", "Opus Clip"
            ].map((tag) => (
              <span key={tag} className="px-4 py-2 bg-[var(--bg-elevated)] text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/5 hover:border-[var(--lime)]/30 transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
