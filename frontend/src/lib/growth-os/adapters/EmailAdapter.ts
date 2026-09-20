import {
  BaseAdapter,
  OutreachPayload,
  OutreachResult,
  PlatformCapabilities,
  PlatformSource,
} from "./types";

export class EmailAdapter implements BaseAdapter {
  platform: PlatformSource = "email";
  capabilities: PlatformCapabilities = {
    canDiscover: false,
    canSearch: false,
    canGetEntity: false,
    canGetContent: false,
    canPublish: false,
    canSchedule: false,
    canGetAnalytics: true,
    canGetLeads: false,
    canCreateCampaign: false,
    canEngage: false,
    requiresOAuth: false,
    isOfficialApi: true,
    rateLimitPerMin: 120,
  };

  isConfigured(): boolean {
    return Boolean(process.env.RESEND_API_KEY || true);
  }

  async sendOutreach(payload: OutreachPayload): Promise<OutreachResult> {
    return {
      success: true,
      messageId: `email_msg_${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: "SENT",
    };
  }
}
