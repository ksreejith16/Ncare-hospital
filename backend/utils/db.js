// MongoDB connection. If MONGODB_URI is unset, app falls back to in-memory storage
// (sufficient for local dev / quick demos but NOT for production).

import mongoose from 'mongoose';

export const inMemory = {
  enabled: false,
  otps: new Map(),         // mobile -> { otp, token, expiresAt, attempts }
  appointments: [],
  contacts: [],
};

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    inMemory.enabled = true;
    console.log('[db] MONGODB_URI not set — using in-memory store (data lost on restart).');
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('[db] Connected to MongoDB');
  } catch (err) {
    console.error('[db] MongoDB connection failed, falling back to in-memory:', err.message);
    inMemory.enabled = true;
  }
}

// Schemas (only used if MongoDB connected)
const otpSchema = new mongoose.Schema({
  mobile:    { type: String, index: true, required: true },
  otpHash:   { type: String, required: true },
  token:     { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  attempts:  { type: Number, default: 0 },
  verified:  { type: Boolean, default: false },
}, { timestamps: true });

const apptSchema = new mongoose.Schema({
  bookingId:  { type: String, unique: true, required: true },
  department: String,
  doctor:     String,
  date:       String,
  time:       String,
  name:       String,
  age:        Number,
  gender:     String,
  mobile:     { type: String, index: true },
  email:      String,
  notes:      String,
  status:     { type: String, default: 'pending' },
}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  type:    { type: String, default: 'contact' },  // 'contact' or 'callback'
  name:    String,
  mobile:  String,
  email:   String,
  subject: String,
  message: String,
}, { timestamps: true });

export const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', apptSchema);
export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
