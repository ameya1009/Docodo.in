import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { whatsappRouter } from "./routes/whatsapp";
import { aiRouter } from "./routes/ai";
import { ledgerRouter } from "./routes/ledger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS for Frontend connectivity (Next.js client/server actions)
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://docodo.in",
  "https://www.docodo.in"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without origin (like mobile apps, curl, backend server-to-server calls)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS protection policy."));
    }
  },
  credentials: true,
}));

// Middleware & Logging
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Healthcheck endpoint for AWS ELB / Render / Docker health sensors
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "HEALTHY",
    service: "Docodo Enterprise SaaS Backend Engine",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    engine: "Node/Express + TypeScript (Prisma 7 Postgres)"
  });
});

// Register API v1 Routes
app.use("/api/v1/whatsapp", whatsappRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/ledger", ledgerRouter);

// Global fallback & error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
