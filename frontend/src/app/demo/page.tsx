import React from "react";
import Link from "next/link";
import { Nav } from "@/components/sections/01-Nav";
import { LiveInteractiveDemo } from "@/components/sections/05-LiveInteractiveDemo";
import { Setup15Min } from "@/components/sections/04-Setup15Min";
import { Footer } from "@/components/sections/13-Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Live Demo | Docodo — Try Before You Sign Up",
  description: "Test the live Docodo merchant setup, customer booking interface, and real-time dashboard alerts interactively.",
};

export default function DemoPage() {
  return (
    <main className="relative bg-[var(--bg-void)] min-h-screen">
      <Nav />
      <div className="pt-28 pb-6 text-center container">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
          Interactive Sandbox
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-display tracking-tight mb-4">
          Experience Docodo Firsthand
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Simulate creating services as a business owner, booking a slot as a customer, and viewing real-time dashboard notifications.
        </p>
      </div>

      <LiveInteractiveDemo />
      <Setup15Min />
      <Footer />
    </main>
  );
}
