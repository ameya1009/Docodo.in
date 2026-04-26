import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const claudeService = {
  async generateReply(message: string, context?: string) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 256,
        system: `You are a helpful AI WhatsApp assistant for a business. Business Context: ${context || 'General SMB'}. Reply in a friendly, professional manner. Use Hinglish if appropriate for the Indian context.`,
        messages: [
          { role: "user", content: message }
        ]
      });

      if (response.content[0].type === 'text') {
        return response.content[0].text;
      }
      return "I'm sorry, I couldn't process that.";
    } catch (error) {
      console.error("Claude Service Error:", error);
      throw new Error("Failed to generate AI response");
    }
  },

  async repurposeContent(transcript: string) {
    // Implementation for content repurposing logic
    // This will take a transcript and generate 5 asset types
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 2048,
        system: "You are a content strategist. Convert the following transcript into: 1. Medium Article, 2. 5 Reel Scripts, 3. LinkedIn Carousel Content, 4. Email Newsletter, 5. WhatsApp Broadcast message.",
        messages: [
          { role: "user", content: `Transcript: ${transcript}` }
        ]
      });

      if (response.content[0].type === 'text') {
        return response.content[0].text;
      }
      return null;
    } catch (error) {
      console.error("Claude Repurpose Error:", error);
      throw new Error("Failed to repurpose content");
    }
  }
};
