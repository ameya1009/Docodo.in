"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const whatsapp_1 = require("./routes/whatsapp");
const ai_1 = require("./routes/ai");
const ledger_1 = require("./routes/ledger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Configure CORS for Frontend connectivity (Next.js client/server actions)
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://docodo.in",
    "https://www.docodo.in"
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests without origin (like mobile apps, curl, backend server-to-server calls)
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === "development") {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS protection policy."));
        }
    },
    credentials: true,
}));
// Middleware & Logging
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
// Healthcheck endpoint for AWS ELB / Render / Docker health sensors
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "HEALTHY",
        service: "Docodo Enterprise SaaS Backend Engine",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        engine: "Node/Express + TypeScript (Prisma 7 Postgres)"
    });
});
// Register API v1 Routes
app.use("/api/v1/whatsapp", whatsapp_1.whatsappRouter);
app.use("/api/v1/ai", ai_1.aiRouter);
app.use("/api/v1/ledger", ledger_1.ledgerRouter);
// Global fallback & error handler
app.use((err, req, res, next) => {
    console.error("Unhadled Backend API Error:", err.message);
    res.status(500).json({
        success: false,
        error: err.message || "Internal backend processing failure.",
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Docodo Enterprise Backend microservices online at http://localhost:${PORT}`);
    console.log(`⚡ Available Routes: /api/v1/whatsapp, /api/v1/ai, /api/v1/ledger, /health`);
});
