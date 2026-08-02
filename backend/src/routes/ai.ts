import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../lib/prisma";

export const aiRouter = Router();

// Initialize Google Gemini AI client if API Key is present
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey && apiKey !== "your-google-gemini-ai-studio-key-here" 
  ? new GoogleGenerativeAI(apiKey) 
  : null;

/**
 * POST /api/v1/ai/generate
 * Generate AI Business Content (Descriptions, SEO tags, WhatsApp Campaigns, Instagram Copy)
 */
aiRouter.post("/generate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId, type, prompt, industry, name } = req.body;

    if (!type || !prompt) {
      res.status(400).json({ error: "Missing required generation type or prompt instructions." });
      return;
    }

    let generatedText = "";

    // If active Gemini API Key exists, generate via Google Gemini model
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const systemPrompt = `You are Docodo AI, an elite SaaS copywriter and digital growth strategist for local Indian service businesses in the ${industry || "service"} industry named "${name || "Docodo Studio"}". Produce highly persuasive, conversion-oriented output formatted cleanly in Markdown.`;
        const result = await model.generateContent(`${systemPrompt}\n\nTask (${type}): ${prompt}`);
        const response = result.response;
        generatedText = response.text();
      } catch (geminiError) {
        console.warn("Gemini API invocation failed or rate limited. Falling back to high-converting template engine...", geminiError);
      }
    }

    // High-converting intelligent fallback engine when testing offline or without key
    if (!generatedText) {
      if (type === "DESCRIPTION") {
        generatedText = `${name || "Our establishment"} is a premier ${industry || "wellness and service"} destination dedicated to delivering exceptional client outcomes. We combine state-of-the-art modern techniques with timeless personalized care to guarantee an unforgettable experience on every booking.`;
      } else if (type === "SEO") {
        generatedText = `Title: Top ${industry || "Service"} Studio in Your City | Book Online via Docodo\nDescription: Looking for premium ${industry || "treatments"}? Visit ${name || "our clinic"} for guaranteed professional care, seamless WhatsApp booking, and zero wait times. Book your slot in 15 seconds!`;
      } else if (type === "WHATSAPP_CAMPAIGN") {
        generatedText = `🌟 VIP Special at ${name || "Docodo Studio"}!\nHi {{customer_name}}, thank you for being a loyal part of our community. Enjoy an instant ₹200 flat discount on your next reservation when you book this week! Tap below to pick your favorite timeslot now:\n👉 https://docodo.in/book/${businessId || "demo"}`;
      } else {
        generatedText = `✨ Elevate your daily wellness journey with ${name || "Docodo"}! We believe in real results and flawless customer care. Comment 'BOOK' below or click our link in bio to reserve your appointment instantly with our certified specialists! 💆‍♀️🚀 #DocodoSaaS #${industry || "LocalBusiness"} #BookOnline #CustomerExperience`;
      }
    }

    // Persist generation history in database if businessId is supplied
    if (businessId) {
      try {
        await prisma.aiContent.create({
          data: {
            businessId,
            type,
            prompt,
            content: generatedText,
            isUsed: false,
          },
        });
      } catch (dbErr) {
        console.warn("Note: Could not record AI generation log to database (businessId might be demo):", dbErr);
      }
    }

    res.status(200).json({
      success: true,
      type,
      content: generatedText,
      engine: genAI ? "Google Gemini 2.5 Flash" : "Docodo Intelligent Fallback Engine",
    });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Server error occurred while generating AI marketing copy." });
  }
});
