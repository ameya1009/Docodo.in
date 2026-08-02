"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionElements";
import { GlowOrb } from "@/components/ui/FeedbackElements";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WHATSAPP_LINK } from "@/lib/constants";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  name: z.string().min(2, "Your name is required"),
  whatsapp: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit WhatsApp number"),
  businessType: z.string().min(1, "Please select a business type"),
  revenue: z.string().min(1, "Please select a revenue range"),
  challenges: z.array(z.string()).min(1, "Select at least one challenge").max(2, "Select max 2 challenges"),
});

type FormValues = z.infer<typeof formSchema>;

export const Audit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      challenges: [],
    },
  });

  const selectedChallenges = watch("challenges");

  const toggleChallenge = (id: string) => {
    const current = [...selectedChallenges];
    if (current.includes(id)) {
      setValue("challenges", current.filter((c) => c !== id));
    } else if (current.length < 2) {
      setValue("challenges", [...current, id]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Open WhatsApp
    const message = `Hi Docodo! I just requested a Free Audit for ${data.businessName}. \n\nDetails:\n- Name: ${data.name}\n- Type: ${data.businessType}\n- Revenue: ${data.revenue}\n- Challenges: ${data.challenges.join(", ")}`;
    window.open(WHATSAPP_LINK(message), "_blank");
  };

  return (
    <section className="py-24 bg-[var(--bg-deep)] relative overflow-hidden">
      <GlowOrb size="lg" color="lime" className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      <GlowOrb size="lg" color="teal" className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

      <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Copy */}
        <div>
          <div className="text-[10px] font-black text-[var(--lime)] uppercase tracking-[0.3em] mb-4">
            Free 50-Point Growth Audit
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            Find out exactly what's costing you leads.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-xl">
            We'll audit your WhatsApp setup, Google presence, social, and follow-up flows. 50 checkpoints. Zero cost. Done in 48 hours.
          </p>

          <div className="space-y-6">
            {[
              "Your current Growth Score (out of 100)",
              "Top 3 revenue leaks we found",
              "Exact tool recommendations for your business",
              "A 20-minute strategy call with Ameya"
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-1 w-5 h-5 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-[var(--text-primary)] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Form */}
        <div>
          <Card variant="elevated" className="p-8 md:p-10 border-white/5 bg-[var(--bg-surface)] shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Business Name</label>
                      <input 
                        {...register("businessName")}
                        className="w-full bg-[var(--bg-void)] border border-[var(--border-strong)] rounded-md py-3 px-4 outline-none focus:border-[var(--lime)]/50 transition-all text-sm"
                        placeholder="e.g. Viman Nagar Cafe"
                      />
                      {errors.businessName && <p className="text-red-500 text-[10px]">{errors.businessName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Your Name</label>
                      <input 
                        {...register("name")}
                        className="w-full bg-[var(--bg-void)] border border-[var(--border-strong)] rounded-md py-3 px-4 outline-none focus:border-[var(--lime)]/50 transition-all text-sm"
                        placeholder="Ameya K."
                      />
                      {errors.name && <p className="text-red-500 text-[10px]">{errors.name.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">WhatsApp Number (India)</label>
                    <input 
                      {...register("whatsapp")}
                      className="w-full bg-[var(--bg-void)] border border-[var(--border-strong)] rounded-md py-3 px-4 outline-none focus:border-[var(--lime)]/50 transition-all text-sm"
                      placeholder="9876543210"
                    />
                    {errors.whatsapp && <p className="text-red-500 text-[10px]">{errors.whatsapp.message}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Business Type</label>
                      <select 
                        {...register("businessType")}
                        className="w-full bg-[var(--bg-void)] border border-[var(--border-strong)] rounded-md py-3 px-4 outline-none focus:border-[var(--lime)]/50 transition-all text-sm appearance-none"
                      >
                        <option value="">Select...</option>
                        <option value="Clinic">Clinic</option>
                        <option value="Salon">Salon</option>
                        <option value="Cafe">Cafe</option>
                        <option value="Coaching">Coaching</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Monthly Revenue</label>
                      <select 
                        {...register("revenue")}
                        className="w-full bg-[var(--bg-void)] border border-[var(--border-strong)] rounded-md py-3 px-4 outline-none focus:border-[var(--lime)]/50 transition-all text-sm appearance-none"
                      >
                        <option value="">Select...</option>
                        <option value="<1L">&lt;1L</option>
                        <option value="1–5L">1–5L</option>
                        <option value="5–20L">5–20L</option>
                        <option value="20L+">20L+</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Biggest challenge (Max 2)</label>
                    <div className="flex flex-wrap gap-2">
                      {["Missing leads", "No reviews", "No content", "No follow-up", "No reports"].map((challenge) => (
                        <button
                          key={challenge}
                          type="button"
                          onClick={() => toggleChallenge(challenge)}
                          className={cn(
                            "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                            selectedChallenges.includes(challenge)
                              ? "bg-[var(--lime)] text-black border-[var(--lime)]"
                              : "bg-[var(--bg-void)] text-[var(--text-muted)] border-[var(--border-strong)] hover:border-[var(--lime)]/30"
                          )}
                        >
                          {challenge}
                        </button>
                      ))}
                    </div>
                    {errors.challenges && <p className="text-red-500 text-[10px]">{errors.challenges.message}</p>}
                  </div>

                  <Button variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Audit My Business Free →"}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-black mb-4">Request received!</h3>
                  <p className="text-[var(--text-secondary)] mb-8">
                    We'll WhatsApp you within 2 hours.
                  </p>
                  <div className="p-6 bg-[var(--bg-void)] rounded-lg border border-white/5 mb-8">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Estimated Growth Score</div>
                    <div className="text-4xl font-black text-[var(--lime)]">34/100</div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-2">We'll dig into all 50 points for you.</p>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">Check your WhatsApp now for a confirmation message.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </section>
  );
};
