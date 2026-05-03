// MongoDB connection. If MONGODB_URI is unset, app falls back to in-memory storage
// (sufficient for local dev / quick demos but NOT for production).

import mongoose from 'mongoose';

export const inMemory = {
  enabled: false,
  otps: new Map(),         // token -> { mobile, otpHash, expiresAt, attempts, verified }
  appointments: [],
  contacts: [],
  admins: [],
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

// =========================================================
// Schemas (only used when MongoDB is connected)
// =========================================================

const otpSchema = new mongoose.Schema({
  mobile:    { type: String, index: true, required: true },
  otpHash:   { type: String, required: true },
  token:     { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  attempts:  { type: Number, default: 0 },
  verified:  { type: Boolean, default: false },
}, { timestamps: true });

export const APPOINTMENT_STATUSES = [
  'pending',     // patient just booked, awaiting hospital confirmation
  'confirmed',   // hospital confirmed
  'completed',   // patient was seen
  'cancelled',   // patient or hospital cancelled
  'no-show',     // patient didn't turn up
];

const apptSchema = new mongoose.Schema({
  bookingId:  { type: String, unique: true, required: true, index: true },
  department: { type: String, required: true, index: true },
  doctor:     { type: String, default: '', index: true },
  date:       { type: String, required: true, index: true },   // YYYY-MM-DD
  time:       { type: String, required: true },                // e.g. "11:00 AM"
  name:       { type: String, required: true },
  age:        { type: Number, required: true, min: 0, max: 120 },
  gender:     { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  mobile:     { type: String, required: true, index: true },
  email:      { type: String, default: '' },
  notes:      { type: String, default: '' },
  status:     { type: String, default: 'pending', enum: APPOINTMENT_STATUSES, index: true },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

apptSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: false });

const contactSchema = new mongoose.Schema({
  type:    { type: String, default: 'contact' },  // 'contact' or 'callback'
  name:    String,
  mobile:  String,
  email:   String,
  subject: String,
  message: String,
  read:    { type: Boolean, default: false, index: true },
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name:         { type: String, default: '' },
  role:         { type: String, default: 'admin', enum: ['admin', 'superadmin'] },
  lastLoginAt:  Date,
}, { timestamps: true });

export const Otp         = mongoose.models.Otp         || mongoose.model('Otp', otpSchema);
export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', apptSchema);
export const Contact     = mongoose.models.Contact     || mongoose.model('Contact', contactSchema);
export const Admin       = mongoose.models.Admin       || mongoose.model('Admin', adminSchema);
