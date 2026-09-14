"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Ensure the API key is available
const genAI = new (GoogleGenerativeAI as any)(process.env.GEMINI_API_KEY || "dummy-key-for-build");

export async function simulateWhatsAppMessage(userMessage: string, history: {role: string, text: string}[], businessSlug?: string) {
  try {
    // 1. Fetch Business Context with Multi-Tenant Guard
    let business = null;
    if (businessSlug) {
      business = await prisma.business.findUnique({
        where: { slug: businessSlug },
        include: { services: true, workingHours: true },
      });
    } else {
      const session = await auth();
      if (session?.user?.id) {
        business = await prisma.business.findFirst({
          where: { ownerId: session.user.id },
          include: { services: true, workingHours: true },
        });
      }
    }

    if (!business) {
      return { error: "Business not found or unauthorized." };
    }

    // Fetch custom knowledge base FAQs for this business
    const kbs = await prisma.knowledgeBase.findMany({
      where: { businessId: business.id },
      take: 10,
    }).catch(() => []);

    // 2. Construct System Prompt with Real Business Data & Knowledge Base
    const servicesList = business.services.map(s => `- ${s.name} (${s.duration} mins) - ₹${s.price}`).join("\n");
    const hoursList = business.workingHours.map(h => `${h.day}: ${h.isOpen ? `${h.openTime} - ${h.closeTime}` : "Closed"}`).join("\n");
    const kbList = kbs.length > 0
      ? kbs.map((k) => `Q: ${k.question}\nA: ${k.answer}`).join("\n\n")
      : "";

    const systemPrompt = `You are the friendly, professional WhatsApp AI Assistant for "${business.name}".
Your goal is to answer customer queries accurately, nurture appointments, and help them book.
Keep responses under 3 sentences. Be extremely concise, conversational, and helpful in polite English or Hinglish.

SERVICES & PRICING:
${servicesList}

WORKING HOURS:
${hoursList}
${kbList ? `\nBUSINESS FAQS & POLICIES:\n${kbList}` : ""}

If they want to book, invite them to share their preferred date and time or provide their booking link.`;

    // 3. Initialize Gemini (gemini-1.5-flash for speed and reliability)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Format history for Gemini
    const contents = history.map(msg => ({
      role: msg.role === "in" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));
    
    // Add the new user message
    contents.push({
      role: "user",
      parts: [{ text: `[SYSTEM CONTEXT: ${systemPrompt}]\n\nUser Message: ${userMessage}` }]
    });

    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    const aiResponse = result.response.text();

    // 4. Log the interaction to WhatsAppLog (Simulating DB tracking)
    await prisma.whatsAppLog.create({
      data: {
        businessId: business.id,
        recipient: "+919999999999", // Dummy customer phone for demo
        messageType: "NURTURE",
        content: aiResponse,
        status: "DELIVERED",
      }
    });

    return { response: aiResponse };

  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return { error: "Failed to generate AI response. Make sure GEMINI_API_KEY is set." };
  }
}

export async function repurposeContent(urlOrText: string) {
  try {
    const systemPrompt = `You are an expert Content Repurposer. 
    Analyze the following input topic/URL and generate exactly 5 content pieces as a strict JSON array.
    Do not output markdown block backticks for the JSON. Just raw JSON.
    Format: 
    [
      { "id": "medium", "title": "Medium Article", "icon": "FileText", "tag": "1,200 words", "preview": "..." },
      { "id": "reels", "title": "Reel Script", "icon": "Video", "tag": "30 sec", "preview": "..." },
      { "id": "linkedin", "title": "LinkedIn", "icon": "Layers", "tag": "Carousel", "preview": "..." },
      { "id": "email", "title": "Email Newsletter", "icon": "Mail", "tag": "Ready", "preview": "..." },
      { "id": "whatsapp", "title": "WhatsApp", "icon": "MessageSquare", "tag": "Broadcast", "preview": "..." }
    ]`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nInput: ${urlOrText}` }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
    });

    const text = result.response.text().trim();
    // Basic JSON sanitization in case model adds markdown blocks
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "");
    
    return { assets: JSON.parse(jsonStr) };
  } catch (error) {
    console.error("Gemini AI Repurpose Error:", error);
    return { error: "Failed to generate. Make sure GEMINI_API_KEY is set." };
  }
}
