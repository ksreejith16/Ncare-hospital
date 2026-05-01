// =========================================================
//   N CARE HOSPITAL — Express API server
//   Endpoints:
//     POST /api/otp/send       Send a 6-digit OTP via SMS
//     POST /api/otp/verify     Verify OTP, return short-lived session token
//     POST /api/appointments   Book an appointment (auth required)
//     POST /api/contact        Submit contact-form message
//     POST /api/callback       Quick callback request from hero form
//     GET  /api/health         Health check
// =========================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { connectDb } from './utils/db.js';
import otpRoutes from './routes/otp.js';
import apptRoutes from './routes/appointments.js';
import contactRoutes from './routes/contact.js';
import chatRoutes from './routes/chat.js';

const app = express();
app.set('trust proxy', 1);

const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (origins.includes('*') || origins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '64kb' }));

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.OTP_MAX_PER_HOUR || 5),
  message: { message: 'Too many OTP requests. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.CHAT_MAX_PER_MINUTE || 20),
  message: { message: 'Too many messages. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/otp/send', otpLimiter);
app.use('/api/otp', otpRoutes);
app.use('/api/appointments', apptRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/callback', contactRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'n-care-api', ts: Date.now() }));

app.use((err, req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = Number(process.env.PORT || 4000);
const start = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`\n  N Care Hospital API`);
    console.log(`  Listening on http://localhost:${PORT}`);
    console.log(`  CORS: ${origins.join(', ')}\n`);
  });
};
start();
