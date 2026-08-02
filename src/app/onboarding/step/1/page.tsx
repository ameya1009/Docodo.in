"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Building2, Phone, Mail, MapPin, FileText, Instagram, Facebook, ArrowRight, Loader2 } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";
import { saveBusinessInfo } from "@/lib/actions/onboarding";
import { INDUSTRIES } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  industry: z.string().min(1, "Please select your industry"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  about: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingStep1() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: store.name,
      industry: store.industry,
      phone: store.phone,
      email: store.email,
      address: store.address,
      city: store.city,
      about: store.about,
    },
  });

  const onSubmit = (data: FormData) => {
    // Save to local store
    Object.entries(data).forEach(([k, v]) => store.setField(k, v ?? ""));

    startTransition(async () => {
      try {
        const result = await saveBusinessInfo({
          name: data.name,
          industry: data.industry,
          phone: data.phone,
          email: data.email,
          address: data.address,
          city: data.city,
          about: data.about,
          instagram: data.instagram,
          facebook: data.facebook,
          whatsapp: data.whatsapp,
        });
        store.setBusinessId(result.businessId, result.slug);
        store.setStep(2);
        router.push("/onboarding/step/2");
      } catch (err) {
        console.error(err);
      }
    });
  };

  const inputCls = "w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 focus:ring-1 focus:ring-[var(--lime)]/20 transition-all";
  const labelCls = "block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5";
  const errorCls = "text-xs text-[var(--danger)] mt-1";

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--text-primary)]">Tell us about your business</h1>
            <p className="text-sm text-[var(--text-secondary)]">This powers your website, booking page &amp; CRM</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Core info */}
        <div className="glass rounded-2xl p-6 border border-[var(--border-default)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Business Details</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Business Name *</label>
              <input {...register("name")} placeholder="e.g. Glow Salon & Spa" className={inputCls} />
              {errors.name && <p className={errorCls}>{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Industry *</label>
              <select {...register("industry")} className={inputCls + " cursor-pointer"}>
                <option value="">Select your industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>{ind.label}</option>
                ))}
              </select>
              {errors.industry && <p className={errorCls}>{errors.industry.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Phone Number *</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input {...register("phone")} placeholder="+91 98765 43210" className={inputCls + " pl-10"} />
              </div>
              {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Business Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input {...register("email")} type="email" placeholder="contact@yourbusiness.com" className={inputCls + " pl-10"} />
              </div>
            </div>

            <div>
              <label className={labelCls}>City</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input {...register("city")} placeholder="Pune" className={inputCls + " pl-10"} />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Address</label>
              <input {...register("address")} placeholder="Shop 4, MG Road, Viman Nagar" className={inputCls} />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass rounded-2xl p-6 border border-[var(--border-default)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">About Your Business</h3>
          <div>
            <label className={labelCls}>Business Description</label>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-3.5 text-[var(--text-muted)]" />
              <textarea {...register("about")} rows={3} placeholder="What makes your business special? What services do you offer?" className={inputCls + " pl-10 resize-none"} />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">AI will enhance this for your website</p>
          </div>
        </div>

        {/* Social */}
        <div className="glass rounded-2xl p-6 border border-[var(--border-default)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Social Links <span className="text-[var(--text-disabled)] normal-case font-normal">(optional)</span></h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Instagram</label>
              <div className="relative">
                <Instagram size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input {...register("instagram")} placeholder="@yoursalon" className={inputCls + " pl-10"} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Facebook</label>
              <div className="relative">
                <Facebook size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input {...register("facebook")} placeholder="facebook.com/yoursalon" className={inputCls + " pl-10"} />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={isPending} className="w-full py-4 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-base shadow-[var(--lime-glow-md)]">
          {isPending ? (<><Loader2 size={18} className="animate-spin" /> Saving...</>) : (<>Continue to Style <ArrowRight size={18} /></>)}
        </button>
      </form>
    </div>
  );
}
