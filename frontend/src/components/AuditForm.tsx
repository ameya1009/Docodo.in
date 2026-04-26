"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Button, GlassCard, cn } from './ui/core';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const auditSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().regex(/^[0-9+ ]+$/, "Invalid phone number"),
  business_type: z.string().min(2, "Business type is required"),
  city: z.string().optional(),
  challenge: z.string().min(10, "Please describe your challenge in more detail"),
});

type AuditFormData = z.infer<typeof auditSchema>;

export const AuditForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuditFormData>({
    resolver: zodResolver(auditSchema),
  });

  const onSubmit = async (data: AuditFormData) => {
    setStatus('loading');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <GlassCard className="max-w-lg mx-auto text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[var(--color-accent-primary)]/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-[var(--color-accent-primary)] w-10 h-10" />
          </div>
        </div>
        <h3 className="text-2xl font-cabinet mb-4">Audit Requested!</h3>
        <p className="text-[var(--color-text-secondary)] mb-8">
          We&apos;ve received your details. Our AI is analyzing your business right now. 
          Expect a report on WhatsApp within 24 hours.
        </p>
        <Button onClick={() => setStatus('idle')} variant="secondary">Request Another</Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-w-2xl mx-auto shadow-[var(--shadow-glow-accent)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={120} className="text-[var(--color-accent-primary)]" />
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-cabinet mb-2">Claim Your Audit</h3>
        <p className="text-[var(--color-text-secondary)]">Fill in the details below to start your growth analysis.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Full Name</label>
            <Input 
              {...register('name')} 
              placeholder="John Doe" 
              className={errors.name ? "border-[var(--color-danger)]" : ""}
            />
            {errors.name && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">WhatsApp Number</label>
            <Input 
              {...register('phone')} 
              placeholder="+91 98765 43210" 
              className={errors.phone ? "border-[var(--color-danger)]" : ""}
            />
            {errors.phone && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Business Type</label>
            <Input 
              {...register('business_type')} 
              placeholder="E-commerce, SaaS, Clinic, etc." 
              className={errors.business_type ? "border-[var(--color-danger)]" : ""}
            />
            {errors.business_type && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.business_type.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">City</label>
            <Input 
              {...register('city')} 
              placeholder="Pune, Mumbai, etc." 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Biggest Growth Challenge</label>
          <textarea 
            {...register('challenge')} 
            className={cn(
              "flex min-h-[120px] w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all",
              errors.challenge && "border-[var(--color-danger)]"
            )}
            placeholder="e.g., We are getting leads but they don't convert on WhatsApp..."
          />
          {errors.challenge && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.challenge.message}</p>}
        </div>

        {status === 'error' && (
          <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)] p-4 rounded-lg flex items-center gap-3 text-[var(--color-danger)]">
            <AlertCircle size={20} />
            <p className="text-sm">Something went wrong. Please try again or contact support.</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-14 text-lg font-bold" 
          isLoading={status === 'loading'}
        >
          Generate My Audit →
        </Button>
      </form>
    </GlassCard>
  );
};
