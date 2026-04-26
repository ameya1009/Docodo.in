import { Router } from 'express';
import { auditController } from '../controllers/audit.controller';

const router = Router();

router.post('/submit', auditController.submitAudit);

export default router;
