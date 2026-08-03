"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ledgerRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.ledgerRouter = (0, express_1.Router)();
/**
 * POST /api/v1/ledger/record
 * Record a payment transaction or Cash-On-Delivery collection ledger entry
 */
exports.ledgerRouter.post("/record", async (req, res) => {
    try {
        const { businessId, bookingId, amount, collectorName, notes } = req.body;
        if (!businessId || !amount) {
            res.status(400).json({ error: "Missing required businessId or amount value." });
            return;
        }
        const entry = await prisma_1.prisma.cODLedger.create({
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
    }
    catch (error) {
        console.error("Ledger Recording Error:", error);
        res.status(500).json({ error: "Failed to save payment reconciliation ledger entry." });
    }
});
/**
 * GET /api/v1/ledger/:businessId
 * Fetch transaction history and COD reconciliation status
 */
exports.ledgerRouter.get("/:businessId", async (req, res) => {
    try {
        const { businessId } = req.params;
        const records = await prisma_1.prisma.cODLedger.findMany({
            where: { businessId: String(businessId) },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        res.status(200).json({ success: true, records });
    }
    catch (error) {
        res.status(500).json({ error: "Could not fetch COD ledger accounting records." });
    }
});
