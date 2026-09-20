import { adapterRegistry } from "../adapters/AdapterRegistry";
import { PlatformSource, PublishPayload, PublishResult } from "../adapters/types";

export interface ScheduledPostItem {
  id: string;
  platform: PlatformSource;
  content: string;
  mediaUrls?: string[];
  scheduledAt: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "PUBLISHED" | "FAILED";
  publishedUrl?: string;
  errorMessage?: string;
  retryCount: number;
}

export class SocialPublisherAgent {
  private queue: ScheduledPostItem[] = [];

  public queuePost(
    platform: PlatformSource,
    content: string,
    scheduledAt?: string,
    requiresApproval: boolean = true
  ): ScheduledPostItem {
    const item: ScheduledPostItem = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      platform,
      content,
      scheduledAt: scheduledAt || new Date().toISOString(),
      status: requiresApproval ? "PENDING_APPROVAL" : "APPROVED",
      retryCount: 0,
    };
    this.queue.push(item);
    return item;
  }

  public approvePost(postId: string): ScheduledPostItem | null {
    const item = this.queue.find((p) => p.id === postId);
    if (item && item.status === "PENDING_APPROVAL") {
      item.status = "APPROVED";
      return item;
    }
    return null;
  }

  public async publishApprovedPost(postId: string): Promise<PublishResult> {
    const item = this.queue.find((p) => p.id === postId);
    if (!item) {
      return { success: false, error: "Post not found in queue" };
    }

    if (item.status !== "APPROVED") {
      return { success: false, error: "Post cannot be published without explicit human approval." };
    }

    const adapter = adapterRegistry.getAdapter(item.platform);
    if (!adapter || !adapter.publish) {
      item.status = "FAILED";
      item.errorMessage = `Platform ${item.platform} does not support direct publishing.`;
      return { success: false, error: item.errorMessage };
    }

    try {
      const payload: PublishPayload = {
        content: item.content,
        mediaUrls: item.mediaUrls,
        scheduledAt: item.scheduledAt,
      };
      const result = await adapter.publish(payload);
      if (result.success) {
        item.status = "PUBLISHED";
        item.publishedUrl = result.publishedUrl;
      } else {
        item.status = "FAILED";
        item.errorMessage = result.error;
        item.retryCount += 1;
      }
      return result;
    } catch (err: any) {
      item.status = "FAILED";
      item.errorMessage = err?.message || "Publishing execution failed";
      item.retryCount += 1;
      return { success: false, error: item.errorMessage };
    }
  }

  public getQueue(): ScheduledPostItem[] {
    return [...this.queue];
  }
}

export const socialPublisherAgent = new SocialPublisherAgent();

export interface InboundInteraction {
  id: string;
  platform: PlatformSource;
  author: string;
  text: string;
  category: "positive" | "negative" | "question" | "lead" | "support" | "spam" | "competitor" | "irrelevant";
  suggestedReply: string;
  approvalStatus: "PENDING_APPROVAL" | "AUTO_RESPONDED" | "DISMISSED";
  timestamp: string;
}

export class EngagementAgent {
  public evaluateInteraction(
    platform: PlatformSource,
    author: string,
    text: string
  ): InboundInteraction {
    const clean = text.toLowerCase();
    let category: InboundInteraction["category"] = "irrelevant";
    let suggestedReply = "Thank you for connecting with us! How can we help your business grow today?";

    if (clean.includes("how much") || clean.includes("price") || clean.includes("cost") || clean.includes("demo")) {
      category = "lead";
      suggestedReply = `Hi @${author}! You can check out all our plans or book a live 2-minute walkthrough at docodo.in/demo. Let us know if you'd like an instant WhatsApp demo!`;
    } else if (clean.includes("help") || clean.includes("broken") || clean.includes("login") || clean.includes("issue")) {
      category = "support";
      suggestedReply = `Hi @${author}, sorry to hear about that! Our support team is available immediately at support@docodo.in or via our 24/7 WhatsApp helpdesk.`;
    } else if (clean.includes("love") || clean.includes("awesome") || clean.includes("great tool")) {
      category = "positive";
      suggestedReply = `Thank you so much @${author}! We are thrilled to be part of your growth journey. 🚀`;
    } else if (clean.includes("crypto") || clean.includes("telegram") || clean.includes("dm for promotion")) {
      category = "spam";
      suggestedReply = "";
    } else {
      category = "question";
      suggestedReply = `Hi @${author}, thanks for reaching out! Docodo Growth OS automates discovery, booking, and reviews for local businesses. Feel free to DM us any specific questions.`;
    }

    return {
      id: `engage_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      platform,
      author,
      text,
      category,
      suggestedReply,
      approvalStatus: "PENDING_APPROVAL",
      timestamp: new Date().toISOString(),
    };
  }
}

export const engagementAgent = new EngagementAgent();
