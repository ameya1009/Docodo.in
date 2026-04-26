"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const GrowthAudit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    whatsapp: '',
    businessType: '',
    revenue: '',
    challenge: [] as string[]
  });

  const challenges = [
    { id: 'leads', label: 'Generating Leads' },
    { id: 'reviews', label: 'Getting Reviews' },
    { id: 'content', label: 'Content Creation' },
    { id: 'follow-ups', label: 'Manual Follow-ups' },
    { id: 'reporting', label: 'ROI Reporting' }
  ];

  const handleCheckbox = (id: string) => {
    setFormData(prev => ({
      ...prev,
      challenge: prev.challenge.includes(id) 
        ? prev.challenge.filter(c => c !== id) 
        : [...prev.challenge, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/v1/audit/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-bg-deep py-32 px-4 relative overflow-hidden" id="audit">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <span className="px-4 py-1 rounded-full bg-lime/10 text-lime text-xs font-black uppercase tracking-widest border border-lime/20 mb-6 inline-block">
              Free Service
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6">
              Free 50-Point <br />
              <span className="text-gradient-lime">Growth Audit</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Get a custom AI implementation roadmap for your business. Instant score + 24hr detailed breakdown.
            </p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GlassCard className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-gray-500">Business Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Viman Nagar Cafe"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime outline-none transition-all"
                          value={formData.businessName}
                          onChange={e => setFormData({...formData, businessName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-gray-500">Phone Number</label>
                        <input 
                          required
                          type="tel" 
                          placeholder="+91 98765 43210"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime outline-none transition-all"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-gray-500">Business Type</label>
                        <select 
                          required
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime outline-none transition-all appearance-none"
                          value={formData.businessType}
                          onChange={e => setFormData({...formData, businessType: e.target.value})}
                        >
                          <option value="">Select Type</option>
                          <option value="clinic">Clinic / Dental</option>
                          <option value="salon">Salon / Spa</option>
                          <option value="cafe">Cafe / Restaurant</option>
                          <option value="coaching">Coaching / Education</option>
                          <option value="agency">Agency / Freelancer</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Challenges */}
                    <div className="space-y-6">
                      <label className="text-[10px] uppercase tracking-widest font-black text-gray-500">Top Growth Challenges</label>
                      <div className="grid grid-cols-1 gap-3">
                        {challenges.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleCheckbox(c.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm ${
                              formData.challenge.includes(c.id) 
                                ? 'bg-lime/10 border-lime text-white' 
                                : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              formData.challenge.includes(c.id) ? 'bg-lime border-lime' : 'border-white/20'
                            }`}>
                              {formData.challenge.includes(c.id) && <div className="w-1.5 h-1.5 bg-bg-deep rounded-full" />}
                            </div>
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-xs text-gray-500 max-w-sm">
                      By submitting, you agree to our data privacy terms. We'll send your audit result via WhatsApp.
                    </p>
                    <NeonButton 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-12 py-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" /> Analyzing...
                        </>
                      ) : (
                        "Audit My Business Free →"
                      )}
                    </NeonButton>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-lime/10 border border-lime/20 flex items-center justify-center text-lime mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-display font-black mb-4">Audit Request Received!</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
                Based on your inputs, your preliminary Growth Score is <span className="text-lime font-bold">34/100</span>. 
                Ameya will send the full 50-point breakdown to your WhatsApp within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NeonButton variant="primary" className="px-8">
                  Check Your Dashboard
                </NeonButton>
                <NeonButton variant="secondary" className="px-8">
                  Back to Home
                </NeonButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-lime/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-lime/5 blur-[100px] rounded-full" />
    </section>
  );
};
