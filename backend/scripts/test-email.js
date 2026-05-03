// Quick standalone test: send a real email via configured SMTP.
// Run:  node scripts/test-email.js
import 'dotenv/config';
import { sendMail } from '../utils/email.js';

const to = process.env.HOSPITAL_NOTIFICATION_EMAIL || process.env.SMTP_USER;
if (!to) { console.error('No recipient configured.'); process.exit(1); }

console.log(`Sending test email to ${to}…`);
sendMail({
  to,
  subject: 'N Care Hospital — backend test email',
  html: `<div style="font-family:Inter,sans-serif;padding:24px;">
    <h2 style="color:#0b6cb5;">It works! 🎉</h2>
    <p>Your N Care Hospital backend SMTP is configured correctly.</p>
    <p style="color:#64748b;font-size:.9rem;">This is an automated test email.</p>
  </div>`,
  text: 'It works! Backend SMTP is configured correctly.',
}).then((r) => {
  console.log(`✓ Sent via ${r.mode}`);
  process.exit(0);
}).catch((err) => {
  console.error('✗ Failed:', err.message);
  process.exit(1);
});
