// Book an appointment.
// OTP is currently disabled (the hospital calls back to confirm). Re-enable by
// uncommenting `requireAuth` below + the OTP step on the frontend.
// Slot conflict prevention: a doctor cannot be double-booked at the same date+time.

import express from 'express';
import crypto from 'crypto';
import { inMemory, Appointment } from '../utils/db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendSms } from '../utils/sms.js';
import { sendMail } from '../utils/email.js';
import { appointmentPatientEmail, appointmentHospitalEmail } from '../utils/emailTemplates.js';

const router = express.Router();

const REQUIRED = ['name', 'age', 'gender', 'mobile', 'department', 'date', 'time'];

router.post('/', asyncHandler(async (req, res) => {
  const body = req.body || {};
  const mobile = String(body.mobile || '').replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(mobile)) return res.status(400).json({ message: 'Invalid mobile number' });

  for (const k of REQUIRED) if (!body[k]) return res.status(400).json({ message: `Missing field: ${k}` });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) return res.status(400).json({ message: 'Invalid date (use YYYY-MM-DD)' });
  if (!['Male', 'Female', 'Other'].includes(body.gender)) return res.status(400).json({ message: 'Invalid gender' });

  // Slot conflict check (only when a specific doctor is chosen)
  if (body.doctor) {
    const conflict = inMemory.enabled
      ? inMemory.appointments.find(a =>
          a.doctor === body.doctor &&
          a.date === body.date &&
          a.time === body.time &&
          ['pending', 'confirmed'].includes(a.status))
      : await Appointment.findOne({
          doctor: body.doctor,
          date:   body.date,
          time:   body.time,
          status: { $in: ['pending', 'confirmed'] },
        });
    if (conflict) return res.status(409).json({ message: 'That slot is no longer available. Please pick another time.' });
  }

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

  if (inMemory.enabled) inMemory.appointments.push({ ...record, _id: bookingId, createdAt: new Date(), updatedAt: new Date() });
  else await Appointment.create(record);

  // Patient SMS (fire & forget)
  sendSms(mobile,
    `N Care Hospital — Appointment received. ID: ${bookingId} on ${body.date} at ${body.time}. ` +
    `We'll confirm shortly. Reach 15 min early with valid ID.`
  ).catch(err => console.warn('[appt] SMS failed:', err.message));

  // Patient confirmation email (HTML branded template)
  if (body.email) {
    const tpl = appointmentPatientEmail({ ...record });
    sendMail({ to: body.email, subject: tpl.subject, html: tpl.html, text: tpl.text })
      .catch(err => console.warn('[appt] Patient email failed:', err.message));
  }

  // Hospital notification email
  const hosp = appointmentHospitalEmail({ ...record });
  sendMail({
    to: process.env.HOSPITAL_NOTIFICATION_EMAIL || 'appointments@ncarehospital.com',
    subject: hosp.subject, html: hosp.html, text: hosp.text,
  }).catch(err => console.warn('[appt] Hospital email failed:', err.message));

  res.json({ ok: true, bookingId, status: 'pending' });
}));

export default router;
