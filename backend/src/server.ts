import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { Anthropic } from '@anthropic-ai/sdk';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.warn("Firebase Admin failed to initialize. Check FIREBASE_SERVICE_ACCOUNT_JSON.", error);
  }
}

import Razorpay from 'razorpay';

const app = express();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());

// CORS Configuration
const whitelist = ['https://docodo.in', 'https://staging.docodo.in', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window`
  message: "Too many requests from this IP, please try again after a minute"
});
app.use(globalLimiter);

const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5, // 5 requests per minute for unauthenticated
  message: "AI Rate limit exceeded"
});

// Authentication Middleware (Stub)
const verifyToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).send('Unauthorized');
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
};

// Routes

// 1. Audit Request Handler
app.post('/api/v1/audit', async (req, res) => {
  try {
    const { name, phone, business_type, city, challenge } = req.body;
    // Basic Validation
    if (!name || !phone || !business_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Save to Firestore
    const auditRef = admin.firestore().collection('audit_requests').doc();
    await auditRef.set({
      name, phone, business_type, city, challenge,
      status: 'new',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // TODO: Trigger WhatsApp alert via Meta API + Brevo Email
    
    res.status(200).json({ success: true, message: "Audit submitted successfully", id: auditRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Claude AI WhatsApp Simulator Proxy
app.post('/api/v1/bot/simulate', aiLimiter, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 256,
      system: `You are a helpful AI WhatsApp assistant for a business. Business Context: ${context || 'General SMB'}`,
      messages: [
        { role: "user", content: message }
      ]
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : "Sorry, I couldn't process that.";
    
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to AI" });
  }
});

// 3. Subscription Route
app.post('/api/v1/subscription/create', async (req, res) => {
  try {
    const { planId, customerEmail } = req.body;
    if (!planId) return res.status(400).json({ error: "planId is required" });

    // Mocking Razorpay Subscription Creation
    // In production, razorpay.subscriptions.create would be called
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12,
    });
    
    res.status(200).json({ 
      subscriptionId: subscription.id,
      status: "created"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

// 4. Health Check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
