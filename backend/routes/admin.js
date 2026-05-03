// =========================================================
//   Admin / staff endpoints (the hospital's back office).
//
//   POST  /api/admin/login                  username + password → JWT
//   GET   /api/admin/me                     current admin info
//   GET   /api/admin/appointments           list with filters / pagination
//   GET   /api/admin/appointments/:id       single booking detail
//   PATCH /api/admin/appointments/:id       update status / adminNotes
//   GET   /api/admin/contacts               list contact submissions
//   PATCH /api/admin/contacts/:id           mark read
//   GET   /api/admin/stats                  dashboard counters
// =========================================================

import express from 'express';
import bcrypt from 'bcryptjs';
import { inMemory, Admin, Appointment, Contact, APPOINTMENT_STATUSES } from '../utils/db.js';
import { sign, requireAdmin } from '../utils/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendMail } from '../utils/email.js';
import { sendSms } from '../utils/sms.js';
import { statusChangeEmail } from '../utils/emailTemplates.js';

const router = express.Router();

// ---------- LOGIN ----------
router.post('/login', asyncHandler(async (req, res) => {
  const { username = '', password = '' } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  // Special bootstrap path: ENV-defined admin (works even without seed / DB).
  // If ADMIN_USERNAME and ADMIN_PASSWORD are set in env, allow that login.
  // Useful when running locally before seeding, or in stateless deployments.
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  if (envUser && envPass && username === envUser && password === envPass) {
    const token = sign({ sub: 'env-admin', username: envUser, role: 'superadmin', name: 'Admin' }, 8 * 60 * 60);
    return res.json({ token, name: 'Admin', username: envUser, role: 'superadmin' });
  }

  // Database-backed admin
  let admin;
  if (inMemory.enabled) {
    admin = inMemory.admins.find(a => a.username === username);
  } else {
    admin = await Admin.findOne({ username });
  }
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  if (!inMemory.enabled) {
    admin.lastLoginAt = new Date();
    await admin.save();
  }

  const token = sign({
    sub: String(admin._id || admin.username),
    username: admin.username,
    role: admin.role || 'admin',
    name: admin.name || admin.username,
  }, 8 * 60 * 60);   // 8 hours

  res.json({ token, name: admin.name || admin.username, username: admin.username, role: admin.role || 'admin' });
}));

// ---------- ME ----------
router.get('/me', requireAdmin, (req, res) => {
  res.json({ username: req.admin.username, name: req.admin.name, role: req.admin.role });
});

// =========================================================
//   APPOINTMENTS — list / detail / update
// =========================================================

router.get('/appointments', requireAdmin, asyncHandler(async (req, res) => {
  const {
    status, department, doctor, mobile, date, dateFrom, dateTo,
    q,
    page = 1, limit = 20, sort = '-createdAt',
  } = req.query;

  const filter = {};
  if (status)     filter.status = String(status);
  if (department) filter.department = String(department);
  if (doctor)     filter.doctor = String(doctor);
  if (mobile)     filter.mobile = String(mobile).replace(/\D/g, '');
  if (date)       filter.date = String(date);
  if (dateFrom || dateTo) {
    filter.date = filter.date || {};
    if (dateFrom) filter.date.$gte = String(dateFrom);
    if (dateTo)   filter.date.$lte = String(dateTo);
  }

  const pageNum  = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip     = (pageNum - 1) * limitNum;

  if (inMemory.enabled) {
    let items = inMemory.appointments.slice();
    items = items.filter(a => {
      if (status     && a.status !== status) return false;
      if (department && a.department !== department) return false;
      if (doctor     && a.doctor !== doctor) return false;
      if (mobile     && a.mobile !== String(mobile).replace(/\D/g, '')) return false;
      if (date       && a.date !== date) return false;
      if (dateFrom   && a.date < dateFrom) return false;
      if (dateTo     && a.date > dateTo) return false;
      if (q) {
        const needle = String(q).toLowerCase();
        const hay = [a.name, a.bookingId, a.mobile, a.notes].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = items.length;
    items = items.slice(skip, skip + limitNum);
    return res.json({ items, page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) });
  }

  if (q) {
    filter.$or = [
      { name:      { $regex: String(q), $options: 'i' } },
      { bookingId: { $regex: String(q), $options: 'i' } },
      { mobile:    { $regex: String(q).replace(/\D/g, '') } },
      { notes:     { $regex: String(q), $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    Appointment.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
    Appointment.countDocuments(filter),
  ]);
  res.json({ items, page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) });
}));

router.get('/appointments/:id', requireAdmin, asyncHandler(async (req, res) => {
  const id = req.params.id;
  let appt;
  if (inMemory.enabled) appt = inMemory.appointments.find(a => a.bookingId === id || a._id === id);
  else                  appt = await Appointment.findOne({ $or: [{ bookingId: id }, { _id: id.match(/^[0-9a-f]{24}$/i) ? id : null }] });
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  res.json(appt);
}));

router.patch('/appointments/:id', requireAdmin, asyncHandler(async (req, res) => {
  const { status, adminNotes, notify = true } = req.body || {};
  const id = req.params.id;

  if (status && !APPOINTMENT_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Allowed: ${APPOINTMENT_STATUSES.join(', ')}` });
  }

  let appt;
  if (inMemory.enabled) {
    appt = inMemory.appointments.find(a => a.bookingId === id || a._id === id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (status     !== undefined) appt.status     = status;
    if (adminNotes !== undefined) appt.adminNotes = adminNotes;
    appt.updatedAt = new Date();
  } else {
    const update = {};
    if (status     !== undefined) update.status     = status;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    appt = await Appointment.findOneAndUpdate(
      { $or: [{ bookingId: id }, { _id: id.match(/^[0-9a-f]{24}$/i) ? id : null }] },
      { $set: update },
      { new: true },
    );
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  }

  // Notify patient on status changes (if they gave email/mobile).
  if (notify && status && ['confirmed', 'cancelled', 'completed', 'no-show'].includes(status)) {
    if (appt.email) {
      const tpl = statusChangeEmail({
        name: appt.name, bookingId: appt.bookingId, status,
        date: appt.date, time: appt.time,
        doctor: appt.doctor, department: appt.department,
      });
      sendMail({ to: appt.email, subject: tpl.subject, html: tpl.html, text: tpl.text }).catch(() => {});
    }
    if (appt.mobile && status === 'confirmed') {
      sendSms(appt.mobile,
        `N Care Hospital — Your appointment ${appt.bookingId} is CONFIRMED for ${appt.date} at ${appt.time}. See you soon.`
      ).catch(() => {});
    }
    if (appt.mobile && status === 'cancelled') {
      sendSms(appt.mobile,
        `N Care Hospital — Your appointment ${appt.bookingId} for ${appt.date} has been cancelled. Call us to reschedule.`
      ).catch(() => {});
    }
  }

  res.json(appt);
}));

// =========================================================
//   CONTACTS
// =========================================================

router.get('/contacts', requireAdmin, asyncHandler(async (req, res) => {
  const { type, read, q, page = 1, limit = 20 } = req.query;
  const pageNum  = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip     = (pageNum - 1) * limitNum;

  if (inMemory.enabled) {
    let items = inMemory.contacts.slice();
    items = items.filter(c => {
      if (type && c.type !== type) return false;
      if (read !== undefined) {
        const want = read === 'true' || read === true;
        if (!!c.read !== want) return false;
      }
      if (q) {
        const needle = String(q).toLowerCase();
        const hay = [c.name, c.mobile, c.email, c.subject, c.message].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = items.length;
    items = items.slice(skip, skip + limitNum);
    return res.json({ items, page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) });
  }

  const filter = {};
  if (type) filter.type = String(type);
  if (read !== undefined) filter.read = read === 'true' || read === true;
  if (q) {
    filter.$or = [
      { name:    { $regex: String(q), $options: 'i' } },
      { email:   { $regex: String(q), $options: 'i' } },
      { mobile:  { $regex: String(q).replace(/\D/g, '') } },
      { subject: { $regex: String(q), $options: 'i' } },
      { message: { $regex: String(q), $options: 'i' } },
    ];
  }
  const [items, total] = await Promise.all([
    Contact.find(filter).sort('-createdAt').skip(skip).limit(limitNum).lean(),
    Contact.countDocuments(filter),
  ]);
  res.json({ items, page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) });
}));

router.patch('/contacts/:id', requireAdmin, asyncHandler(async (req, res) => {
  const { read } = req.body || {};
  if (inMemory.enabled) {
    const c = inMemory.contacts.find(x => x._id === req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    if (read !== undefined) c.read = !!read;
    return res.json(c);
  }
  const c = await Contact.findByIdAndUpdate(req.params.id, { $set: { read: !!read } }, { new: true });
  if (!c) return res.status(404).json({ message: 'Not found' });
  res.json(c);
}));

// =========================================================
//   STATS — dashboard summary
// =========================================================

router.get('/stats', requireAdmin, asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  if (inMemory.enabled) {
    const all = inMemory.appointments;
    return res.json({
      today:     all.filter(a => a.date === today).length,
      pending:   all.filter(a => a.status === 'pending').length,
      confirmed: all.filter(a => a.status === 'confirmed').length,
      total:     all.length,
      contactsUnread: inMemory.contacts.filter(c => !c.read).length,
    });
  }
  const [todayCount, pending, confirmed, total, unread] = await Promise.all([
    Appointment.countDocuments({ date: today }),
    Appointment.countDocuments({ status: 'pending' }),
    Appointment.countDocuments({ status: 'confirmed' }),
    Appointment.countDocuments({}),
    Contact.countDocuments({ read: false }),
  ]);
  res.json({ today: todayCount, pending, confirmed, total, contactsUnread: unread });
}));

export default router;
