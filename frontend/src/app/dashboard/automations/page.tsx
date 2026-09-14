import React from "react";
import AutomationsClient from "./AutomationsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automations & Execution Center | Docodo Business OS",
  description: "Ready-to-run business workflows, execution telemetry, and natural language automation builder.",
};

export default function AutomationsPage() {
  return <AutomationsClient />;
}
