"use client";

import React from "react";
import { Nav } from "@/components/sections/01-Nav";
import { Footer } from "@/components/sections/13-Footer";
import BlueprintProgressDashboard from "@/components/blueprint/BlueprintProgressDashboard";

export default function BlueprintProgressPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20">
      <Nav />
      <div className="container px-4 sm:px-6 mx-auto">
        <BlueprintProgressDashboard />
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </main>
  );
}
