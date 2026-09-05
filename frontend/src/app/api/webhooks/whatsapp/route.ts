import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAIResponse } from "@/lib/engines/ai-engine";
import { DocodoBackendAPI } from "@/lib/api-client";
import { sendAdminNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

/**
 * Meta WhatsApp Cloud API Two-Way Inbound Webhook Receiver & AI Auto-Responder
 * Handles webhook verification handshake and processes inbound customer messages/replies
 * with zero-cost multilingual AI fallback, live conversation threads, and human handoff.
 */

// 1. GET: Webhook verification handshake with Meta Cloud Graph API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "docodo_wa_verify_secret";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[WhatsApp Webhook] Handshake verified successfully");
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification token mismatch" }, { status: 403 });
}

// 2. POST: Inbound customer message processing & AI response pipeline
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      // Status update (delivered, read, etc.)
      return NextResponse.json({ status: "ACK" }, { status: 200 });
    }

    const fromPhone = message.from; // Sender's WhatsApp phone number
    const messageBody = message.text?.body || message.button?.text || "";
    const messageId = message.id;
    const receiverPhone = value?.metadata?.display_phone_number?.replace(/[^0-9]/g, "");

    console.log(`[WhatsApp Webhook] Inbound message from ${fromPhone} to ${receiverPhone || "business"}: "${messageBody}"`);

    // Match business by receiver phone first for multi-tenant isolation
    let business = null;
    if (receiverPhone) {
      business = await prisma.business.findFirst({
        where: {
          OR: [
            { whatsapp: { contains: receiverPhone.slice(-10) } },
            { phone: { contains: receiverPhone.slice(-10) } },
          ],
        },
        include: {
          services: { where: { isActive: true } },
          workingHours: true,
          knowledgeBases: { where: { isActive: true } },
        },
      });
    }

    // If business not found by receiver phone, find customer's associated business
    if (!business) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { phone: { contains: fromPhone.slice(-10) } },
        include: {
          business: {
            include: {
              services: { where: { isActive: true } },
              workingHours: true,
              knowledgeBases: { where: { isActive: true } },
            },
          },
        },
      });
      business = existingCustomer?.business || null;
    }

    if (!business) {
      console.warn("[WhatsApp Webhook] No registered business matched for phone:", fromPhone);
      return NextResponse.json({ status: "UNMATCHED_BUSINESS" }, { status: 200 });
    }

    // 1. Upsert Conversation Thread
    const conversation = await prisma.conversation.upsert({
      where: {
        businessId_customerPhone: {
          businessId: business.id,
          customerPhone: fromPhone,
        },
      },
      update: {
        lastMessageAt: new Date(),
        unreadCount: { increment: 1 },
      },
      create: {
        businessId: business.id,
        customerPhone: fromPhone,
        lastMessageAt: new Date(),
        unreadCount: 1,
      },
    });

    // 2. Save Customer's Incoming Message
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        sender: "CUSTOMER",
        text: messageBody,
        externalId: messageId,
        status: "DELIVERED",
      },
    });

    // 3. Log interaction in WhatsAppLog
    await prisma.whatsAppLog.create({
      data: {
        businessId: business.id,
        recipient: fromPhone,
        messageType: "INBOUND_REPLY",
        content: messageBody,
        status: "READ",
        externalId: messageId,
      },
    });

    // 4. Human Handoff Check: Has staff paused the bot?
    const lowerMessage = messageBody.toLowerCase();
    const isHumanRequest =
      lowerMessage.includes("human") ||
      lowerMessage.includes("doctor") ||
      lowerMessage.includes("staff") ||
      lowerMessage.includes("reception") ||
      lowerMessage.includes("baat karni hai") ||
      lowerMessage.includes("call me");

    if (isHumanRequest && !conversation.isBotPaused) {
      // Pause bot for human takeover
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { isBotPaused: true },
      });

      sendAdminNotification("ENQUIRY", {
        channel: "WHATSAPP_HANDOFF",
        customerPhone: fromPhone,
        businessName: business.name,
        message: messageBody,
        timestamp: new Date().toISOString(),
      }).catch(() => {});
    }

    // If bot is currently paused by staff, do NOT auto-reply
    if (conversation.isBotPaused && !isHumanRequest) {
      console.log(`[WhatsApp Webhook] Bot paused for conversation ${conversation.id}. Awaiting staff reply.`);
      return NextResponse.json({ status: "BOT_PAUSED_STAFF_TAKEOVER" }, { status: 200 });
    }

    // 5. Generate Multilingual AI Reply
    const chatHistory = await prisma.chatMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { timestamp: "desc" },
      take: 4,
    });

    const formattedHistory = chatHistory
      .reverse()
      .map((m) => ({
        role: (m.sender === "CUSTOMER" ? "user" : "assistant") as "user" | "assistant",
        content: m.text,
      }));

    const aiResult = await generateAIResponse(
      messageBody,
      {
        businessName: business.name,
        industry: business.industry,
        address: business.address,
        city: business.city,
        services: business.services.map((s) => ({
          name: s.name,
          price: s.price,
          duration: s.duration,
          description: s.description,
        })),
        workingHours: business.workingHours.map((h) => ({
          day: h.day,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isOpen: h.isOpen,
        })),
        knowledgeBase: business.knowledgeBases.map((k) => ({
          question: k.question,
          answer: k.answer,
          category: k.category,
        })),
        bookingSlug: business.slug,
      },
      formattedHistory
    );

    // 6. Save Bot Reply to Thread
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        sender: "BOT",
        text: aiResult.text,
        status: "SENT",
      },
    });

    // 7. Dispatch Outbound Message to Customer
    await DocodoBackendAPI.dispatchWhatsAppMessage({
      businessId: business.id,
      recipientPhone: fromPhone,
      messageType: "BROADCAST",
      customMessage: aiResult.text,
    }).catch((err) => {
      console.warn("[WhatsApp Webhook] Outbound message dispatch notice:", err);
    });

    return NextResponse.json({ status: "AI_REPLY_SENT", provider: aiResult.providerUsed }, { status: 200 });
  } catch (error: any) {
    console.error("[WhatsApp Webhook Error]", error);
    return NextResponse.json({ status: "ERROR", error: error.message }, { status: 200 });
  }
}
