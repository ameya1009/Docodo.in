import { Request, Response } from 'express';
import { db, admin } from '../config/firebase';

export const auditController = {
  async submitAudit(req: Request, res: Response) {
    try {
      const { name, phone, businessType, revenue, challenge } = req.body;
      
      if (!name || !phone || !businessType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const auditData = {
        name,
        phone,
        businessType,
        revenue,
        challenge,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      if (db) {
        const docRef = await db.collection('audits').add(auditData);
        return res.status(200).json({ 
          success: true, 
          id: docRef.id,
          message: "Audit request received. We will get back to you within 24 hours."
        });
      }

      // Mock response if DB not connected
      console.log("[Mock Audit Submission]:", auditData);
      res.status(200).json({ 
        success: true, 
        message: "Audit request received (Simulation Mode)." 
      });
    } catch (error) {
      console.error("Audit Submission Error:", error);
      res.status(500).json({ error: "Failed to submit audit request" });
    }
  }
};
