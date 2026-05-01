// Contact form + quick callback request.

import express from 'express';
import { inMemory, Contact } from '../utils/db.js';
import { sendMail } from '../utils/email.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name = '', mobile = '', email = '', subject = '', message = '' } = req.body || {};
    const cleanMobile = String(mobile).replace(/\D/g, '');
    if (name.length < 2) return res.status(400).json({ message: 'Invalid name' });
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) return res.status(400).json({ message: 'Invalid mobile' });

    const isCallback = req.path === '/' && req.originalUrl.includes('/api/callback');
    const record = {
      type:    isCallback ? 'callback' : 'contact',
      name,
      mobile:  cleanMobile,
      email,
      subject,
      message,
    };

    if (inMemory.enabled) inMemory.contacts.push({ ...record, createdAt: new Date() });
    else await Contact.create(record);

    sendMail({
      to: process.env.HOSPITAL_NOTIFICATION_EMAIL || 'info@ncarehospital.com',
      subject: `[${record.type}] ${subject || 'Website message'} — ${name}`,
      text:
        `Type: ${record.type}\nName: ${name}\nMobile: +91 ${cleanMobile}\nEmail: ${email || '—'}\n` +
        `Subject: ${subject || '—'}\n\nMessage:\n${message || '—'}`,
    }).catch(() => {});

    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
