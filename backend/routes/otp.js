// OTP send + verify endpoints.

import express from 'express';
import crypto from 'crypto';
import { inMemory, Otp } from '../utils/db.js';
import { sendSms } from '../utils/sms.js';
import { sign } from '../utils/auth.js';

const router = express.Router();

const OTP_TTL_SEC = 5 * 60;
const MAX_ATTEMPTS = 5;

function genOtp() { return String(crypto.randomInt(100000, 1000000)); }
function hashOtp(otp, mobile) { return crypto.createHash('sha256').update(`${mobile}:${otp}`).digest('hex'); }

// ---------- send ----------
router.post('/send', async (req, res, next) => {
  try {
    const mobile = String(req.body.mobile || '').replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(mobile)) return res.status(400).json({ message: 'Invalid mobile' });

    const otp = genOtp();
    const otpHash = hashOtp(otp, mobile);
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + OTP_TTL_SEC * 1000);

    if (inMemory.enabled) {
      inMemory.otps.set(token, { mobile, otpHash, expiresAt, attempts: 0, verified: false });
    } else {
      await Otp.create({ mobile, otpHash, token, expiresAt });
    }

    await sendSms(mobile, `Your N Care Hospital OTP is ${otp}. Valid for 5 minutes. Do not share.`);
    res.json({ token, expiresIn: OTP_TTL_SEC });
  } catch (err) { next(err); }
});

// ---------- verify ----------
router.post('/verify', async (req, res, next) => {
  try {
    const { token, otp, mobile } = req.body || {};
    const cleanMobile = String(mobile || '').replace(/\D/g, '');
    const cleanOtp = String(otp || '').replace(/\D/g, '');
    if (!token || !cleanOtp || !cleanMobile) return res.status(400).json({ message: 'Missing fields' });

    let record;
    if (inMemory.enabled) {
      record = inMemory.otps.get(token);
    } else {
      record = await Otp.findOne({ token });
    }

    if (!record || record.mobile !== cleanMobile) return res.status(400).json({ message: 'Invalid token' });
    if (record.verified) return res.status(400).json({ message: 'OTP already used' });
    if (new Date(record.expiresAt) < new Date()) return res.status(400).json({ message: 'OTP expired' });
    if (record.attempts >= MAX_ATTEMPTS) return res.status(429).json({ message: 'Too many attempts' });

    if (inMemory.enabled) record.attempts++;
    else await Otp.updateOne({ token }, { $inc: { attempts: 1 } });

    if (record.otpHash !== hashOtp(cleanOtp, cleanMobile)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (inMemory.enabled) record.verified = true;
    else await Otp.updateOne({ token }, { $set: { verified: true } });

    const sessionToken = sign({ mobile: cleanMobile, scope: 'booking' }, 10 * 60);
    res.json({ ok: true, sessionToken });
  } catch (err) { next(err); }
});

export default router;
