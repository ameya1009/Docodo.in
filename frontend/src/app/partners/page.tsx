"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Loader2, 
  Gift, 
  Percent, 
  Building2, 
  Phone,
  Mail,
  User,
  Wallet,
  Clock
} from "lucide-react";
import { Nav } from "@/components/sections/01-Nav";
import { Footer } from "@/components/sections/13-Footer";
import { Button } from "@/components/ui/Button";
import { registerPartner } from "@/lib/actions/partner";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function PartnersPage() {
  const [isPending, startTransition] = useTransition();
  const [partnerData, setPartnerData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    upiId: "",
    channel: "Healthcare Professional / Consultant",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await registerPartner(formData);
        if (res.success && res.partner) {
          setPartnerData(res.partner);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to register partner account.");
      }
    });
  };

  const referralUrl = partnerData ? `https://docodo.in/?ref=${partnerData.referralCode}` : "";

  const handleCopy = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen text-[var(--text-primary)]">
      <Nav />

      {/* Hero Section */}
      <section className="pt-32 pb-20 container text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 text-xs font-mono font-bold mb-4">
            <Percent size={13} />
            <span>Docodo Healthcare Partner &amp; Affiliate Program</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-[1.1] mb-6">
            Partner with Docodo.<br />
            <span className="text-[var(--lime)]">Earn 20% Recurring Commission</span> Every Month.
          </h1>

          <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-8">
            Introduce doctors, dentists, and outpatient clinics in your city to Docodo&apos;s 0% aggregator-commission patient CRM. Help clinics end appointment no-shows while earning passive monthly revenue.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href="#signup">
              <Button variant="primary" size="lg" className="font-bold text-base shadow-[var(--lime-glow-md)]">
                Join Partner Program — ₹0 Cost <ArrowRight size={18} className="ml-2" />
              </Button>
            </a>
            <Link href={WHATSAPP_LINK("Hi! I would like to learn more about the Docodo Partner Program.")}>
              <Button variant="secondary" size="lg" className="text-base">
                Chat with Partner Desk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Commission Structure & Tiers */}
      <section className="py-16 bg-[var(--bg-elevated)]/40 border-y border-[var(--border-subtle)]">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight mb-3">
              Transparent 20% Monthly Commission Structure
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">
              You earn 20% of every subscription fee paid by clinics you refer, paid out automatically on the 1st of every month via direct UPI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Starter Practice Tier
                </span>
                <h3 className="text-xl font-bold text-white font-display">Starter Clinic OS</h3>
                <div className="mt-3 mb-4">
                  <span className="text-3xl font-black text-white font-display">₹200</span>
                  <span className="text-xs text-[var(--text-muted)] font-mono"> /clinic/month</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  For solo general physicians, dentists, and physiotherapists running single-doctor OPD practices.
                </p>
                <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--lime)] shrink-0" />
                    <span>20% of ₹999/mo recurring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--lime)] shrink-0" />
                    <span>10 clinics = ₹2,000/mo recurring</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="p-6 bg-[var(--bg-surface)] border-2 border-[var(--lime)]/60 rounded-3xl flex flex-col justify-between shadow-[0_0_30px_rgba(200,241,53,0.15)] relative">
              <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[var(--lime)] text-black text-[10px] font-mono font-black">
                MOST POPULAR FOR CLINICS
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--lime)] block mb-1">
                  Growth Clinical Enterprise
                </span>
                <h3 className="text-xl font-bold text-white font-display">Growth Enterprise</h3>
                <div className="mt-3 mb-4">
                  <span className="text-3xl font-black text-[var(--lime)] font-display">₹500</span>
                  <span className="text-xs text-[var(--text-muted)] font-mono"> /clinic/month</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  For multi-doctor clinics, dermatology centers, and polyclinics using multi-staff calendar and 24h WhatsApp automation.
                </p>
                <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--lime)] shrink-0" />
                    <span>20% of ₹2,499/mo recurring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--lime)] shrink-0" />
                    <span>10 clinics = ₹5,000/mo recurring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--lime)] shrink-0" />
                    <span>25 clinics = ₹12,500/mo recurring</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Managed Setup Concierge
                </span>
                <h3 className="text-xl font-bold text-white font-display">Concierge Setup</h3>
                <div className="mt-3 mb-4">
                  <span className="text-3xl font-black text-white font-display">₹1,000</span>
                  <span className="text-xs text-[var(--text-muted)] font-mono"> /setup bounty</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  For premium clinics opting for done-for-you catalog configuration, staff training, and custom domain mapping.
                </p>
                <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--lime)] shrink-0" />
                    <span>20% of ₹4,999 one-time setup fee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--lime)] shrink-0" />
                    <span>Instant settlement on clinic onboarding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 container max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight mb-3">
            Why Doctors Love Docodo (And Why It&apos;s Easy to Refer)
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Doctors are tired of paying high commission rates to aggregators who show competitor ads next to their own clinic profile.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center mb-3">
              <DollarSign size={20} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">0% Aggregator Take-Rate</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Clinics keep 100% of their consultation fees with direct UPI settlement into their own bank account.
            </p>
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center mb-3">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">15-Min Instant Setup</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              No complex hardware or installations. Clinic receptionists are trained and live in under 15 minutes.
            </p>
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">DPDP Act 2023 Compliant</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Medical patient data stays secure in India with TLS/SSL encryption and official WhatsApp Cloud API.
            </p>
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center mb-3">
              <Wallet size={20} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Direct UPI Payouts</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Commissions are settled automatically to your UPI handle on the 1st of every month without delays.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Signup Form */}
      <section id="signup" className="py-20 bg-[var(--bg-elevated)]/30 border-t border-[var(--border-subtle)]">
        <div className="container max-w-3xl">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 text-xs font-mono font-bold mb-3">
                <Sparkles size={13} />
                <span>Instant Partner Activation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
                Register as a Docodo Partner
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                Fill in your details below to instantly generate your unique clinic referral code and link.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {partnerData ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(200,241,53,0.3)]">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1">
                      Partner Account Activated!
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Welcome, {partnerData.name}! Your {partnerData.commissionRate}% recurring commission tracking code is active.
                    </p>
                  </div>

                  {/* Referral Link Box */}
                  <div className="p-4 bg-[var(--bg-void)] border border-[var(--border-subtle)] rounded-2xl max-w-lg mx-auto text-left space-y-2">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                      Your Unique Clinic Referral Link
                    </span>
                    <div className="flex items-center justify-between gap-3 bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      <code className="text-xs text-[var(--lime)] font-mono truncate">{referralUrl}</code>
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1 bg-[var(--lime)] text-black font-bold text-xs rounded-lg shrink-0 flex items-center gap-1 hover:brightness-110 transition-all"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <a
                      href={WHATSAPP_LINK(`Hi Docodo Team! I am registered as partner ${partnerData.referralCode} (${partnerData.name}). Please send me the clinic presentation deck and doctor one-pager.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-sm transition-all shadow-lg"
                    >
                      <Share2 size={16} /> Request Doctor Presentation Deck on WhatsApp
                    </a>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                        <User size={14} className="text-[var(--lime)]" /> Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Deshmukh"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Mail size={14} className="text-[var(--lime)]" /> Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="anand@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] outline-none transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Phone size={14} className="text-[var(--lime)]" /> WhatsApp / Mobile Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Building2 size={14} className="text-[var(--lime)]" /> City / Region
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pune / Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] outline-none transition-colors"
                      />
                    </div>

                    {/* UPI ID */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Wallet size={14} className="text-[var(--lime)]" /> UPI ID for Payouts
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. anand@okaxis"
                        value={formData.upiId}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] outline-none transition-colors"
                      />
                    </div>

                    {/* Channel */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-secondary)]">
                        Your Background / Network
                      </label>
                      <select
                        value={formData.channel}
                        onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white outline-none transition-colors"
                      >
                        <option value="Healthcare Professional / Consultant">Healthcare Professional / Consultant</option>
                        <option value="Pharma / Medical Equipment Representative">Pharma / Medical Rep</option>
                        <option value="Digital Agency / Freelancer">Digital Marketing Agency / Freelancer</option>
                        <option value="Clinic Receptionist / Practice Manager">Clinic Front-Desk / Practice Manager</option>
                        <option value="Other">Other Referral Network</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isPending}
                      className="w-full py-3.5 font-bold shadow-[var(--lime-glow-md)] text-sm"
                    >
                      {isPending ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" /> Activating Partner Link...
                        </>
                      ) : (
                        <>
                          Activate My 20% Partner Link Now <ArrowRight size={16} className="ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
