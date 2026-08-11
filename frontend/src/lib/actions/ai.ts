"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

// Ensure the API key is available
const genAI = new (GoogleGenerativeAI as any)(process.env.GEMINI_API_KEY || "dummy-key-for-build");

export async function simulateWhatsAppMessage(userMessage: string, history: {role: string, text: string}[], businessSlug?: string) {
  try {
    // 1. Fetch Business Context
    const business = businessSlug 
      ? await prisma.business.findUnique({ where: { slug: businessSlug }, include: { services: true, workingHours: true } })
      : await prisma.business.findFirst({ include: { services: true, workingHours: true } });

    if (!business) {
      return { error: "Business not found." };
    }

    // 2. Construct System Prompt
    const servicesList = business.services.map(s => `- ${s.name} (${s.duration} mins) - ${s.price} ${s.currency}`).join("\n");
    const hoursList = business.workingHours.map(h => `${h.day}: ${h.isOpen ? `${h.openTime} - ${h.closeTime}` : "Closed"}`).join("\n");

    const systemPrompt = `You are the friendly WhatsApp AI Receptionist for "${business.name}".
Your goal is to answer customer questions, nurture leads, and help them book an appointment.
Keep responses under 3 sentences. Be extremely concise, conversational, and helpful. Use emojis sparingly.
If they ask for pricing or services, here is the menu:
${servicesList}

If they ask for hours, here are the hours:
${hoursList}

If they want to book, tell them you can check slots for them and ask for their preferred time.`;

    // 3. Initialize Gemini (gemini-2.5-flash for speed)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
