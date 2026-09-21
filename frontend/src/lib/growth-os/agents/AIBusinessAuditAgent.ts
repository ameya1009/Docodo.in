/**
 * Docodo Autonomous Revenue OS — AI Business Audit Agent
 * Generates personalized, multi-dimensional sales audits (Website, SEO, Social, Booking, WhatsApp).
 */

import { CanonicalLead } from "./types";
import { solutionMatchingAgent, SolutionMatchDiagnosis } from "./SolutionMatchingAgent";

export interface BusinessAuditReport {
  leadId: string;
  businessName: string;
  city: string;
  auditDate: string;
  overallScore: number; // 0-100
  currentStateSummary: string;
  identifiedProblems: string[];
  businessImpactSummary: string;
  diagnoses: SolutionMatchDiagnosis[];
  recommendedPackage: string;
  projectedMonthlyROI_INR: number;
  nextStepCallToAction: string;
  shareableAuditLink: string;
}

export class AIBusinessAuditAgent {
  public generateAudit(lead: CanonicalLead): BusinessAuditReport {
    const diagnoses = solutionMatchingAgent.diagnoseAndMatch(lead);
    const primaryDiag = diagnoses[0];

    const problems = diagnoses.map((d) => d.problem);
    const totalProjectedROI = diagnoses.reduce((acc, d) => acc + d.estimatedValueMonthlyINR, 0);

    const score = Math.max(35, Math.min(85, 100 - diagnoses.length * 18));

    const recommendedPackage = primaryDiag ? primaryDiag.recommendedDocodoSolution.name : "Docodo Complete Local Growth OS";

    return {
      leadId: lead.id,
      businessName: lead.canonicalName,
      city: lead.city,
      auditDate: new Date().toISOString().split("T")[0],
      overallScore: score,
      currentStateSummary: `Currently operating in ${lead.city} with active customer demand, but conversion funnels and automated response systems have significant drop-offs.`,
      identifiedProblems: problems,
      businessImpactSummary: diagnoses.map((d) => d.businessImpact).join(" "),
      diagnoses,
      recommendedPackage,
      projectedMonthlyROI_INR: totalProjectedROI,
      nextStepCallToAction: `Activate your 14-day zero-risk live prototype for ${lead.canonicalName} to capture an estimated ₹${totalProjectedROI.toLocaleString("en-IN")}/mo in previously leaked bookings.`,
      shareableAuditLink: `https://docodo.in/audit/${lead.id}?ref=revenue_os`,
    };
  }
}

export const aiBusinessAuditAgent = new AIBusinessAuditAgent();
