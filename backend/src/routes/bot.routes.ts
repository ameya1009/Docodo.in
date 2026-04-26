import { Router } from 'express';
import { botController } from '../controllers/bot.controller';
import { aiLimiter } from '../middleware/rate-limit.middleware';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Public simulation route (rate limited)
router.post('/simulate', aiLimiter, botController.simulateChat);

// Protected repurposing route
router.post('/repurpose', verifyToken, botController.repurposeContent);

export default router;
