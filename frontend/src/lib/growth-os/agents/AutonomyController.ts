/**
 * Docodo Autonomous Revenue OS — Autonomy Controller & Governance
 * Enforces Autonomy Levels (0-4), Risk Categorization (LOW/MEDIUM/HIGH), and Owner Overrides.
 */

export type AutonomyLevel = 0 | 1 | 2 | 3 | 4;

export type RiskCategory = "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK";

export interface ActionPermit {
  actionName: string;
  riskCategory: RiskCategory;
  autonomyLevel: AutonomyLevel;
  canAutoExecute: boolean;
  requiresExplicitHumanApproval: boolean;
  reason: string;
}

export class AutonomyController {
  private currentAutonomyLevel: AutonomyLevel = 2; // Default: Level 2 (AI execution with approval)
  private emergencyPause: boolean = false;

  public setAutonomyLevel(level: AutonomyLevel): void {
    this.currentAutonomyLevel = level;
  }

  public getAutonomyLevel(): AutonomyLevel {
    return this.currentAutonomyLevel;
  }

  public triggerEmergencyPause(paused: boolean): void {
    this.emergencyPause = paused;
  }

  public isEmergencyPaused(): boolean {
    return this.emergencyPause;
  }

  public evaluateActionPermission(actionName: string, risk: RiskCategory): ActionPermit {
    if (this.emergencyPause) {
      return {
        actionName,
        riskCategory: risk,
        autonomyLevel: this.currentAutonomyLevel,
        canAutoExecute: false,
        requiresExplicitHumanApproval: true,
        reason: "Execution halted: Emergency pause active by workspace owner.",
      };
    }

    // High risk actions (payments, ad spend changes, destructive database actions, contract pricing)
    if (risk === "HIGH_RISK") {
      return {
        actionName,
        riskCategory: risk,
        autonomyLevel: this.currentAutonomyLevel,
        canAutoExecute: false,
        requiresExplicitHumanApproval: true,
        reason: "High-risk action requires mandatory explicit founder/human approval.",
      };
    }

    // Level 0: Manual only
    if (this.currentAutonomyLevel === 0) {
      return {
        actionName,
        riskCategory: risk,
        autonomyLevel: 0,
        canAutoExecute: false,
        requiresExplicitHumanApproval: true,
        reason: "Autonomy Level 0 (Manual) is active.",
      };
    }

    // Level 1: Suggestions only
    if (this.currentAutonomyLevel === 1) {
      return {
        actionName,
        riskCategory: risk,
        autonomyLevel: 1,
        canAutoExecute: false,
        requiresExplicitHumanApproval: true,
        reason: "Autonomy Level 1 (Suggestions only) requires human confirmation.",
      };
    }

    // Level 2: AI Execution with approval for Medium/High
    if (this.currentAutonomyLevel === 2) {
      const canAuto = risk === "LOW_RISK";
      return {
        actionName,
        riskCategory: risk,
        autonomyLevel: 2,
        canAutoExecute: canAuto,
        requiresExplicitHumanApproval: !canAuto,
        reason: canAuto ? "Low-risk background intelligence permitted." : "Medium-risk outbound communication requires approval.",
      };
    }

    // Level 3 / 4: Bounded autonomous execution for Low/Medium risk
    const canAuto = risk === "LOW_RISK" || risk === "MEDIUM_RISK";
    return {
      actionName,
      riskCategory: risk,
      autonomyLevel: this.currentAutonomyLevel,
      canAutoExecute: canAuto,
      requiresExplicitHumanApproval: !canAuto,
      reason: canAuto ? "Bounded autonomous execution active." : "High-risk financial/contract actions require approval.",
    };
  }
}

export const autonomyController = new AutonomyController();
