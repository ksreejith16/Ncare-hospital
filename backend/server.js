// =========================================================
//   N CARE HOSPITAL — Express API server
//   Endpoints:
//     POST /api/otp/send             Send 6-digit OTP via SMS
//     POST /api/otp/verify           Verify OTP, return short-lived session token
//     POST /api/appointments         Book an appointment (auth: OTP session)
//     GET  /api/availability         Slots free for a given doctor/date
//     POST /api/contact              Submit contact-form message
//     POST /api/callback             Quick callback request from hero form
//     POST /api/chat                 Chatbot — Gemini (or stub)
//     POST /api/admin/login          Admin login → JWT
//     GET  /api/admin/appointments   List with filters & pagination (admin)
//     PATCH /api/admin/appointments/:id  Update status or notes (admin)
//     GET  /api/admin/contacts       List contact submissions (admin)
//     PATCH /api/admin/contacts/:id  Mark read (admin)
//     GET  /api/admin/stats          Dashboard summary numbers (admin)
//     GET  /api/health               Health check
// =========================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDb } from './utils/db.js';
import otpRoutes          from './routes/otp.js';
import apptRoutes         from './routes/appointments.js';
import contactRoutes      from './routes/contact.js';
import chatRoutes         from './routes/chat.js';
import adminRoutes        from './routes/admin.js';
import availabilityRoutes from './routes/availability.js';

const app = express();
app.set('trust proxy', 1);

// ----- Security & quality middleware -----
app.use(helmet({
  contentSecurityPolicy: false, // CSP is set on the frontend, this is a JSON API
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());

// ----- CORS -----
const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);          // server-to-server, curl, mobile apps
    if (origins.includes('*') || origins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '64kb' }));

// ----- Logs -----
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
}

// ----- Rate limiters -----
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
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.BOOKING_MAX_PER_HOUR || 5),
  message: { message: 'Too many bookings from this device. Please try again later or call us.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ----- Routes -----
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'n-care-api', ts: Date.now() }));

app.use('/api/otp/send',        otpLimiter);
app.use('/api/admin/login',     adminLoginLimiter);
app.use('/api/appointments',    bookingLimiter);

app.use('/api/otp',             otpRoutes);
app.use('/api/appointments',    apptRoutes);
app.use('/api/availability',    availabilityRoutes);
app.use('/api/contact',         contactRoutes);
app.use('/api/callback',        contactRoutes);
app.use('/api/chat',            chatLimiter, chatRoutes);
app.use('/api/admin',           adminRoutes);

// 404
app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));

// Centralised error handler
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({ message: err.message || 'Internal server error' });
});

// ----- Boot + graceful shutdown -----
const PORT = Number(process.env.PORT || 4000);
const start = async () => {
  await connectDb();
  const server = app.listen(PORT, () => {
    console.log(`\n  N Care Hospital API`);
    console.log(`  Env:  ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Port: ${PORT}`);
    console.log(`  CORS: ${origins.join(', ')}\n`);
  });
  const shutdown = (sig) => {
    console.log(`\n[server] ${sig} received, shutting down…`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};
start();
