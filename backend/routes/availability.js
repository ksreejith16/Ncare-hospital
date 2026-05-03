// GET /api/availability?date=YYYY-MM-DD&doctor=slug
// Returns the time slots that are still free for that doctor on that date.

import express from 'express';
import { inMemory, Appointment } from '../utils/db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

// Default OPD slots — keep in sync with the frontend booking form.
const DEFAULT_SLOTS = [
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '01:00 PM',
  '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM',
  '04:00 PM',
];

router.get('/', asyncHandler(async (req, res) => {
  const date   = String(req.query.date || '').trim();
  const doctor = String(req.query.doctor || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ message: 'Invalid date (use YYYY-MM-DD)' });
  if (!doctor) {
    // No specific doctor — every slot remains "available" (hospital assigns at OPD).
    return res.json({ date, doctor: null, available: DEFAULT_SLOTS, taken: [] });
  }

  const taken = inMemory.enabled
    ? inMemory.appointments
        .filter(a => a.doctor === doctor && a.date === date && ['pending', 'confirmed'].includes(a.status))
        .map(a => a.time)
    : (await Appointment.find({
        doctor,
        date,
        status: { $in: ['pending', 'confirmed'] },
      }, 'time -_id')).map(a => a.time);

  const available = DEFAULT_SLOTS.filter(s => !taken.includes(s));
  res.json({ date, doctor, available, taken });
}));

export default router;
