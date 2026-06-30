'use client';

import React from 'react';
import { Shield, Zap, Code, Users } from 'lucide-react';

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
            Everything you need.<br/>Nothing you don't.
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl font-medium">
            Our platform provides end-to-end tooling for managing, growing, and scaling your agency without the bloat of traditional enterprise software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex flex-col justify-between group hover:border-[var(--text-primary)] transition-colors min-h-[360px]">
            <div>
              <Zap className="w-8 h-8 text-[var(--text-primary)] mb-6" />
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Lightning Fast Deployments</h3>
              <p className="text-[var(--text-secondary)] text-lg max-w-md font-medium">
                Push your Next.js applications and agentic workflows to production in milliseconds, directly from the command line or dashboard.
              </p>
            </div>
            <div className="mt-8 flex gap-2 w-full max-w-xs overflow-hidden">
                <div className="h-12 flex-1 bg-[var(--text-primary)] rounded opacity-10 group-hover:opacity-100 transition-opacity delay-75 duration-300" />
                <div className="h-12 flex-1 bg-[var(--text-primary)] rounded opacity-10 group-hover:opacity-100 transition-opacity delay-150 duration-300" />
                <div className="h-12 flex-1 bg-[var(--text-primary)] rounded opacity-10 group-hover:opacity-100 transition-opacity delay-300 duration-300" />
            </div>
          </div>

          <div className="p-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex flex-col hover:border-[var(--text-primary)] transition-colors min-h-[360px]">
            <Shield className="w-8 h-8 text-[var(--text-primary)] mb-6" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Enterprise Security</h3>
            <p className="text-[var(--text-secondary)] font-medium">
              SOC2 Type II compliance built into the infrastructure layer. Your data is encrypted at rest and in transit.
            </p>
          </div>

          <div className="p-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex flex-col hover:border-[var(--text-primary)] transition-colors min-h-[360px]">
            <Users className="w-8 h-8 text-[var(--text-primary)] mb-6" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Role-based Access</h3>
            <p className="text-[var(--text-secondary)] font-medium">
              Granular permissions for your entire team. Easily invite stakeholders and restrict access to critical workflows.
            </p>
          </div>

          <div className="lg:col-span-2 p-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex flex-col hover:border-[var(--text-primary)] transition-colors min-h-[360px]">
            <Code className="w-8 h-8 text-[var(--text-primary)] mb-6" />
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Native API Integration</h3>
            <p className="text-[var(--text-secondary)] text-lg max-w-md font-medium">
              Connect securely to OpenAI, Anthropic, or bring your own fine-tuned models. We handle the orchestration and scaling.
            </p>
            <div className="mt-auto pt-8 flex font-mono text-sm text-[var(--text-secondary)]">
                <code>{`> npm i @docodo/sdk`}</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
