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
    return true;
  }

  /**
   * Normalizes Indian and international phone numbers into E.164 digits without '+'
   * (e.g. '98220 11223' -> '919822011223', '09822011223' -> '919822011223')
   */
  static normalizePhoneNumber(phone: string): string {
    let digits = (phone || "").replace(/[^0-9]/g, "");
    if (digits.startsWith("00")) {
      digits = digits.slice(2);
    }
    if (digits.length === 11 && digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    if (digits.length === 10) {
      digits = `91${digits}`;
    }
    return digits;
  }

  /**
   * Generates a 1-click wa.me click-to-chat URL for Indian doctors:
   * https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}
   */
  static buildClickToChatUrl(phone: string, message: string): string {
    const cleanPhone = WhatsAppAdapter.normalizePhoneNumber(phone);
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message || "")}`;
  }

  buildClickToChatUrl(phone: string, message: string): string {
    return WhatsAppAdapter.buildClickToChatUrl(phone, message);
  }

  async sendOutreach(payload: OutreachPayload): Promise<OutreachResult> {
    const cleanPhone = WhatsAppAdapter.normalizePhoneNumber(payload.recipient || "");
    const clickToChatUrl = WhatsAppAdapter.buildClickToChatUrl(cleanPhone, payload.body);

    return {
      success: true,
      messageId: cleanPhone ? `wa_link_${cleanPhone}` : `wa_msg_${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: "SENT",
      clickToChatUrl,
    };
  }
}
