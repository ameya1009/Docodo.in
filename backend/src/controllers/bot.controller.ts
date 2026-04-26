import { Request, Response } from 'express';
import { claudeService } from '../services/claude.service';

export const botController = {
  async simulateChat(req: Request, res: Response) {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const reply = await claudeService.generateReply(message, context);
      res.status(200).json({ reply });
    } catch (error) {
      res.status(500).json({ error: "Failed to connect to AI" });
    }
  },

  async repurposeContent(req: Request, res: Response) {
    try {
      const { transcript } = req.body;
      
      if (!transcript) {
        return res.status(400).json({ error: "Transcript is required" });
      }

      // Check user credits here in production
      // For now, just generate
      const results = await claudeService.repurposeContent(transcript);
      res.status(200).json({ results });
    } catch (error) {
      res.status(500).json({ error: "Content repurposing failed" });
    }
  }
};
