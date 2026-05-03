// Branded HTML email templates.

const HOSPITAL_NAME    = process.env.HOSPITAL_NAME    || 'N Care Hospital';
const HOSPITAL_PHONE   = process.env.HOSPITAL_PHONE   || '+91 40 6162 6364';
const HOSPITAL_ADDRESS = process.env.HOSPITAL_ADDRESS || '25-26, Mayuri Nagar, R.C. Puram, Beeramguda, Hyderabad — 502032';
const PUBLIC_URL       = process.env.PUBLIC_URL       || 'https://ncarehospital.com';

const wrapper = (title, body) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(15,23,42,.08);">
        <tr><td style="background:linear-gradient(135deg,#0b6cb5,#14b8a6);padding:24px;color:#fff;text-align:center;">
          <h1 style="margin:0;font-size:1.4rem;font-weight:800;letter-spacing:-.01em;">${HOSPITAL_NAME}</h1>
          <p style="margin:4px 0 0;font-size:.85rem;opacity:.9;">Beeramguda, R.C. Puram, Hyderabad</p>
        </td></tr>
        <tr><td style="padding:32px 28px;">${body}</td></tr>
        <tr><td style="background:#f8fafc;padding:20px 28px;font-size:.8rem;color:#64748b;border-top:1px solid #e2e8f0;">
          <strong>${HOSPITAL_NAME}</strong><br>
          ${HOSPITAL_ADDRESS}<br>
          📞 ${HOSPITAL_PHONE} (24×7 Emergency) &nbsp;·&nbsp; 🌐 <a href="${PUBLIC_URL}" style="color:#0b6cb5;">${PUBLIC_URL}</a>
        </td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:.75rem;color:#94a3b8;">This is an automated message. For urgent matters please call ${HOSPITAL_PHONE}.</p>
    </td></tr>
  </table>
</body></html>`;

export function appointmentPatientEmail({ name, age, gender, mobile, department, doctor, date, time, bookingId, notes }) {
  const body = `
    <h2 style="margin:0 0 8px;font-size:1.4rem;">Appointment confirmed ✅</h2>
    <p style="margin:0 0 24px;color:#475569;">Hi ${name}, your appointment has been booked. Here are your details:</p>
    <div style="background:#e6f1fb;border-radius:12px;padding:18px 22px;margin-bottom:24px;">
      <div style="font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;color:#084e85;font-weight:600;">Booking ID</div>
      <div style="font-size:1.4rem;font-weight:800;color:#084e85;letter-spacing:.04em;">${bookingId}</div>
    </div>
    <table width="100%" cellpadding="6" style="font-size:.92rem;border-collapse:collapse;">
      <tr><td style="color:#64748b;width:130px;">Patient</td><td><strong>${name}</strong> (${age}, ${gender})</td></tr>
      <tr><td style="color:#64748b;">Mobile</td><td>+91 ${mobile}</td></tr>
      <tr><td style="color:#64748b;">Department</td><td>${department}</td></tr>
      <tr><td style="color:#64748b;">Doctor</td><td>${doctor || 'Will be assigned at OPD'}</td></tr>
      <tr><td style="color:#64748b;">Date &amp; Time</td><td><strong>${date} at ${time}</strong></td></tr>
      ${notes ? `<tr><td style="color:#64748b;vertical-align:top;">Notes</td><td>${notes}</td></tr>` : ''}
    </table>
    <div style="background:#fef3c7;border-radius:10px;padding:14px 18px;margin-top:24px;color:#92400e;font-size:.88rem;">
      ⚠️ Please reach the hospital <strong>15 minutes before</strong> your slot with a valid photo ID and any prior medical reports.
    </div>
    <p style="margin-top:24px;font-size:.88rem;color:#64748b;">
      Need to reschedule? Call us at <a href="tel:${HOSPITAL_PHONE.replace(/\s/g, '')}" style="color:#0b6cb5;">${HOSPITAL_PHONE}</a>.
    </p>`;
  return {
    subject: `Appointment confirmed — ${bookingId} (${date})`,
    html: wrapper('Appointment confirmed', body),
    text: `Hi ${name},\nYour appointment is confirmed.\nBooking ID: ${bookingId}\nDepartment: ${department}\nDoctor: ${doctor || 'TBA'}\nDate/Time: ${date} at ${time}\n\nReach 15 min early. Call ${HOSPITAL_PHONE} for help.`,
  };
}

export function appointmentHospitalEmail({ name, age, gender, mobile, email, department, doctor, date, time, bookingId, notes }) {
  const body = `
    <h2 style="margin:0 0 8px;font-size:1.3rem;">📥 New booking — ${bookingId}</h2>
    <p style="margin:0 0 18px;color:#475569;">A patient just booked through the website.</p>
    <table width="100%" cellpadding="6" style="font-size:.92rem;border-collapse:collapse;">
      <tr><td style="color:#64748b;width:130px;">Patient</td><td><strong>${name}</strong> (${age}, ${gender})</td></tr>
      <tr><td style="color:#64748b;">Mobile</td><td><a href="tel:+91${mobile}" style="color:#0b6cb5;">+91 ${mobile}</a></td></tr>
      <tr><td style="color:#64748b;">Email</td><td>${email || '—'}</td></tr>
      <tr><td style="color:#64748b;">Department</td><td>${department}</td></tr>
      <tr><td style="color:#64748b;">Doctor</td><td>${doctor || '— (any)'}</td></tr>
      <tr><td style="color:#64748b;">Date &amp; Time</td><td><strong>${date} at ${time}</strong></td></tr>
      ${notes ? `<tr><td style="color:#64748b;vertical-align:top;">Notes</td><td>${notes}</td></tr>` : ''}
    </table>
    <p style="margin-top:24px;font-size:.88rem;color:#64748b;">
      View &amp; manage in the admin dashboard: <a href="${PUBLIC_URL}/admin" style="color:#0b6cb5;">${PUBLIC_URL}/admin</a>
    </p>`;
  return {
    subject: `[New booking] ${bookingId} — ${name}, ${department} on ${date}`,
    html: wrapper('New booking', body),
    text: `New booking ${bookingId}\nPatient: ${name} (${age}, ${gender})\nMobile: +91 ${mobile}\nDepartment: ${department}\nDoctor: ${doctor || 'TBA'}\nDate/Time: ${date} at ${time}\nNotes: ${notes || '—'}`,
  };
}

export function statusChangeEmail({ name, bookingId, status, date, time, doctor, department }) {
  const messages = {
    confirmed:  { title: 'Appointment confirmed ✅',     body: 'Your appointment has been confirmed by the hospital.' },
    cancelled:  { title: 'Appointment cancelled',         body: 'Unfortunately, your appointment has been cancelled. Please call us if this was unexpected.' },
    completed:  { title: 'Thank you for visiting',        body: 'We hope your visit went well. Please share your feedback on our website.' },
    'no-show':  { title: 'You missed your appointment',   body: 'It seems you did not visit on the scheduled day. Please reschedule when convenient.' },
  };
  const m = messages[status] || { title: `Appointment ${status}`, body: `Status updated to: ${status}.` };
  const body = `
    <h2 style="margin:0 0 8px;font-size:1.4rem;">${m.title}</h2>
    <p style="margin:0 0 18px;color:#475569;">Hi ${name}, ${m.body}</p>
    <div style="background:#e6f1fb;border-radius:12px;padding:18px 22px;margin-bottom:18px;">
      <strong>Booking ID:</strong> ${bookingId}<br>
      <strong>Department:</strong> ${department}<br>
      <strong>Doctor:</strong> ${doctor || 'TBA'}<br>
      <strong>Scheduled:</strong> ${date} at ${time}
    </div>`;
  return {
    subject: `${m.title} — ${bookingId}`,
    html: wrapper(m.title, body),
    text: `${m.title}\n${m.body}\nBooking ID: ${bookingId}\n${date} at ${time}`,
  };
}
