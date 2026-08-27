import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Meta WhatsApp Cloud API Two-Way Inbound Webhook Receiver
 * Handles webhook verification challenge and processes inbound customer messages/replies.
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

// 2. POST: Inbound customer message processing
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

    console.log(`[WhatsApp Webhook] Inbound message from ${fromPhone}: "${messageBody}"`);

    // Match customer by phone across businesses
    const customer = await prisma.customer.findFirst({
      where: {
        phone: { contains: fromPhone.slice(-10) },
      },
      include: { business: true },
    });

    if (customer) {
      // Record incoming interaction log
      await prisma.whatsAppLog.create({
        data: {
          businessId: customer.businessId,
          recipient: fromPhone,
          messageType: "INBOUND_REPLY",
          content: messageBody,
          status: "READ",
          externalId: messageId,
        },
      });

      // If customer asks to cancel or reschedule, handle intent gracefully
      const lower = messageBody.toLowerCase();
      if (lower.includes("cancel") || lower.includes("reschedule")) {
        const latestBooking = await prisma.booking.findFirst({
          where: {
            customerId: customer.id,
            status: "CONFIRMED",
          },
          orderBy: { createdAt: "desc" },
        });

        if (latestBooking && lower.includes("cancel")) {
          await prisma.booking.update({
            where: { id: latestBooking.id },
            data: { status: "CANCELLED" },
          });
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error: any) {
    console.error("[WhatsApp Webhook Error]", error);
    return NextResponse.json({ status: "ERROR", error: error.message }, { status: 200 });
  }
}
