// Book an appointment. Requires Bearer session token from /api/otp/verify.

import express from 'express';
import crypto from 'crypto';
import { inMemory, Appointment } from '../utils/db.js';
import { requireAuth } from '../utils/auth.js';
import { sendSms } from '../utils/sms.js';
import { sendMail } from '../utils/email.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const sessionMobile = req.session.mobile;
    const body = req.body || {};
    const mobile = String(body.mobile || '').replace(/\D/g, '');
    if (mobile !== sessionMobile) return res.status(403).json({ message: 'Mobile mismatch' });

    const required = ['name', 'age', 'gender', 'mobile', 'department', 'date', 'time'];
    for (const k of required) if (!body[k]) return res.status(400).json({ message: `Missing field: ${k}` });

    const bookingId = 'NCH-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const record = {
      bookingId,
      department: body.department,
      doctor:     body.doctor || '',
      date:       body.date,
      time:       body.time,
      name:       body.name,
      age:        Number(body.age),
      gender:     body.gender,
      mobile,
      email:      body.email || '',
      notes:      body.notes || '',
      status:     'pending',
    };

    if (inMemory.enabled) inMemory.appointments.push({ ...record, createdAt: new Date() });
    else await Appointment.create(record);

    // Patient SMS
    sendSms(mobile,
      `N Care Hospital — Appointment confirmed. ID: ${bookingId} on ${body.date} at ${body.time}. ` +
      `Reach 15 min early with valid ID. Call ${process.env.HOSPITAL_PHONE || '040 6162 6364'} for help.`
    ).catch(() => {});

    // Hospital email notification
    sendMail({
      to: process.env.HOSPITAL_NOTIFICATION_EMAIL || 'appointments@ncarehospital.com',
      subject: `New appointment: ${bookingId} (${body.department})`,
      text:
        `New appointment booking received.\n\n` +
        `Booking ID: ${bookingId}\nName: ${body.name} (${body.age}, ${body.gender})\n` +
        `Mobile: +91 ${mobile}\nEmail: ${body.email || '—'}\n` +
        `Department: ${body.department}\nDoctor: ${body.doctor || '— (any)'}\n` +
        `Date / Time: ${body.date} at ${body.time}\nNotes: ${body.notes || '—'}`,
    }).catch(() => {});

    // Patient email confirmation (if provided)
    if (body.email) {
      sendMail({
        to: body.email,
        subject: `Your appointment at N Care Hospital — ${bookingId}`,
        html:
          `<p>Hello ${body.name},</p>` +
          `<p>Your appointment is confirmed at N Care Hospital, Beeramguda.</p>` +
          `<ul>` +
            `<li><b>Booking ID:</b> ${bookingId}</li>` +
            `<li><b>Department:</b> ${body.department}</li>` +
            `<li><b>Doctor:</b> ${body.doctor || 'Will be assigned at OPD'}</li>` +
            `<li><b>Date &amp; Time:</b> ${body.date} at ${body.time}</li>` +
          `</ul>` +
          `<p>Please arrive 15 minutes early with a valid ID and any prior reports.</p>` +
          `<p>— Team N Care Hospital</p>`,
      }).catch(() => {});
    }

    res.json({ ok: true, bookingId });
  } catch (err) { next(err); }
});

export default router;
