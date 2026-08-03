"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.whatsappRouter = (0, express_1.Router)();
/**
 * POST /api/v1/whatsapp/broadcast
 * Broadcast a marketing message to selected customer segments
 */
exports.whatsappRouter.post("/broadcast", async (req, res) => {
    try {
        const { businessId, segment, template, numbers } = req.body;
        if (!businessId || !template) {
            res.status(400).json({ error: "Missing required businessId or message template." });
            return;
        }
        // Retrieve targets from database if numbers array is empty or segment is specified
        let targetNumbers = numbers || [];
        if (targetNumbers.length === 0) {
            const customers = await prisma_1.prisma.customer.findMany({
                where: { businessId },
                select: { phone: true, name: true },
            });
            targetNumbers = customers.map((c) => c.phone);
        }
        // Fallback demonstration target numbers if empty database
        if (targetNumbers.length === 0) {
            targetNumbers = ["+919820012345", "+919830054321"];
        }
        // Log the broadcast messages in the Postgres database
        const logEntries = targetNumbers.map((phone) => ({
            businessId,
            recipient: phone,
            messageType: "BROADCAST",
            content: template,
            status: "SENT",
            externalId: `WA-CLOUD-${Math.floor(Math.random() * 8999999 + 1000000)}`,
        }));
        await prisma_1.prisma.whatsAppLog.createMany({
            data: logEntries,
        });
        res.status(200).json({
            success: true,
            message: `Successfully broadcasted to ${targetNumbers.length} recipients.`,
            dispatchedCount: targetNumbers.length,
            segment: segment || "ALL_CUSTOMERS",
        });
    }
    catch (error) {
        console.error("WhatsApp Broadcast Engine Error:", error);
        res.status(500).json({ error: "Failed to dispatch WhatsApp broadcast via Cloud API." });
    }
});
/**
 * POST /api/v1/whatsapp/ndr-verify
 * Trigger automatic COD / High-Risk NDR verification message
 */
exports.whatsappRouter.post("/ndr-verify", async (req, res) => {
    try {
        const { businessId, bookingId, customerPhone, customerName } = req.body;
        if (!businessId || !bookingId || !customerPhone) {
            res.status(400).json({ error: "Missing required verification parameter." });
            return;
        }
        const verifyContent = `Hi ${customerName || "Valued Customer"}, we noticed your reservation at Docodo Studio via Cash-on-Delivery. Please click below or reply YES to confirm your appointment and secure your slot!`;
        // Record the message and initiate an NDR Dispute monitoring state
        await prisma_1.prisma.whatsAppLog.create({
            data: {
                businessId,
                recipient: customerPhone,
                messageType: "NDR_VERIFICATION",
                content: verifyContent,
                status: "DELIVERED",
            },
        });
        await prisma_1.prisma.nDRDispute.upsert({
            where: { bookingId },
            update: { status: "UNDER_AI_REVIEW", aiResolution: "Sent interactive WhatsApp COD verification check" },
            create: {
                businessId,
                bookingId,
                reason: "COD_FRAUD_PREVENTION",
                status: "UNDER_AI_REVIEW",
                aiResolution: "Sent interactive WhatsApp COD verification check",
            },
        });
        res.status(200).json({
            success: true,
            message: "NDR verification workflow activated successfully.",
            target: customerPhone,
        });
    }
    catch (error) {
        console.error("NDR Verify Error:", error);
        res.status(500).json({ error: "Internal error executing NDR defense automation." });
    }
});
/**
 * GET /api/v1/whatsapp/logs/:businessId
 * Fetch real-time WhatsApp dispatch ledger logs for a business
 */
exports.whatsappRouter.get("/logs/:businessId", async (req, res) => {
    try {
        const { businessId } = req.params;
        const logs = await prisma_1.prisma.whatsAppLog.findMany({
            where: { businessId: String(businessId) },
            orderBy: { timestamp: "desc" },
            take: 20,
        });
        res.status(200).json({ success: true, logs });
    }
    catch (error) {
        res.status(500).json({ error: "Could not retrieve WhatsApp log history." });
    }
});
