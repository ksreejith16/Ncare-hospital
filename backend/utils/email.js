// Mail sender with two backends:
//   1. RESEND_API_KEY set  → use Resend HTTP API (works on Render free tier)
//   2. SMTP_*        set  → use Nodemailer SMTP (good for local dev / Gmail)
//   3. neither set        → log to console (demo mode)
//
// Resend is preferred because Render's free tier blocks outbound SMTP ports
// but allows outbound HTTPS (port 443).

import nodemailer from 'nodemailer';

const { RESEND_API_KEY, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

let mode = 'console';
let transporter = null;
let resend = null;

if (RESEND_API_KEY) {
  // Lazy-import so the dependency is only loaded when needed.
  const { Resend } = await import('resend');
  resend = new Resend(RESEND_API_KEY);
  mode = 'resend';
  console.log('[email] Using Resend HTTP API');
} else if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  const port = Number(SMTP_PORT || 587);
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    family: 4,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
  mode = 'smtp';
  console.log(`[email] Using SMTP  host=${SMTP_HOST}  port=${port}  user=${SMTP_USER}`);
  transporter.verify().then(
    () => console.log('[email] SMTP transporter verified OK'),
    (err) => console.error('[email] SMTP transporter verify FAILED:', err.message),
  );
} else {
  console.log('[email] No mail provider configured — emails will be logged to console.');
}

const FROM = SMTP_FROM || process.env.RESEND_FROM || 'N Care Hospital <onboarding@resend.dev>';

export async function sendMail({ to, subject, html, text }) {
  if (mode === 'console') {
    console.log(`\n[EMAIL:CONSOLE]\n  to=${to}\n  subject=${subject}\n  ${text || html?.slice(0, 200)}\n`);
    return { mode: 'console' };
  }

  try {
    if (mode === 'resend') {
      const { data, error } = await resend.emails.send({ from: FROM, to: [to], subject, html, text });
      if (error) throw new Error(`Resend: ${error.message || error.name}`);
      console.log(`[email] sent via resend  to=${to}  subject="${subject}"  id=${data?.id}`);
      return { mode: 'resend', messageId: data?.id };
    }
    const info = await transporter.sendMail({ from: FROM, to, subject, text, html });
    console.log(`[email] sent via smtp  to=${to}  subject="${subject}"  id=${info.messageId}`);
    return { mode: 'smtp', messageId: info.messageId };
  } catch (err) {
    console.error(`[email] FAILED  to=${to}  err=${err.message}`);
    throw err;
  }
}
