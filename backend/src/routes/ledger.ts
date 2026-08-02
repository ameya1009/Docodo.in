import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const ledgerRouter = Router();

/**
 * POST /api/v1/ledger/record
 * Record a payment transaction or Cash-On-Delivery collection ledger entry
 */
ledgerRouter.post("/record", async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId, bookingId, amount, collectorName, notes } = req.body;

    if (!businessId || !amount) {
      res.status(400).json({ error: "Missing required businessId or amount value." });
      return;
    }

    const entry = await prisma.codLedger.create({
      data: {
        businessId,
        bookingId: bookingId || null,
        amount: Number(amount),
        status: "PENDING_COLLECTION",
        collectorName: collectorName || "Automated Agent",
        notes: notes || "Recorded via Docodo Backend Reconciliation Engine",
      },
    });

    res.status(201).json({
      success: true,
      message: "Ledger transaction recorded successfully.",
      entry,
    });
  } catch (error: any) {
    console.error("Ledger Recording Error:", error);
    res.status(500).json({ error: "Failed to save payment reconciliation ledger entry." });
  }
});

/**
 * GET /api/v1/ledger/:businessId
 * Fetch transaction history and COD reconciliation status
 */
ledgerRouter.get("/:businessId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId } = req.params;
    const records = await prisma.codLedger.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.status(200).json({ success: true, records });
  } catch (error: any) {
    res.status(500).json({ error: "Could not fetch COD ledger accounting records." });
  }
});
