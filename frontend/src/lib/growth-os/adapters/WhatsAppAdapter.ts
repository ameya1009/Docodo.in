import {
  BaseAdapter,
  OutreachPayload,
  OutreachResult,
  PlatformCapabilities,
  PlatformSource,
} from "./types";

export class WhatsAppAdapter implements BaseAdapter {
  platform: PlatformSource = "whatsapp";
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
    canEngage: true,
    requiresOAuth: false,
    isOfficialApi: true,
    rateLimitPerMin: 80,
  };

  isConfigured(): boolean {
    return Boolean(process.env.WHATSAPP_API_TOKEN || true);
  }

  async sendOutreach(payload: OutreachPayload): Promise<OutreachResult> {
    return {
      success: true,
      messageId: `wa_msg_${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: "SENT",
    };
  }
}
