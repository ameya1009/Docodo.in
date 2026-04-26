import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { globalLimiter } from './middleware/rate-limit.middleware';

const app = express();

// Security & Optimization Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

// CORS Configuration
const whitelist = ['https://docodo.in', 'https://staging.docodo.in', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate Limiting
app.use(globalLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
import botRoutes from './routes/bot.routes';
import auditRoutes from './routes/audit.routes';

app.use('/api/v1/bot', botRoutes);
app.use('/api/v1/audit', auditRoutes);

export default app;
