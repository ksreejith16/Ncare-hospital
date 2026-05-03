// Nodemailer-based mail sender. If SMTP creds are missing, mail is logged.

import nodemailer from 'nodemailer';

let transporter = null;
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  const port = Number(SMTP_PORT || 587);
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // Some providers (Render free, etc.) need IPv4 forced + longer timeouts.
    family: 4,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
  console.log(`[email] SMTP configured  host=${SMTP_HOST}  port=${port}  user=${SMTP_USER}`);

  // Verify connection at boot so failures are visible immediately, not on first send.
  transporter.verify().then(
    () => console.log('[email] SMTP transporter verified OK'),
    (err) => console.error('[email] SMTP transporter verify FAILED:', err.message),
  );
} else {
  console.log('[email] SMTP not configured — mail will be logged to the console.');
}

export async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.log(`\n[EMAIL:CONSOLE]\n  to=${to}\n  subject=${subject}\n  ${text || html}\n`);
    return { mode: 'console' };
  }
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM || 'noreply@ncarehospital.com',
      to,
      subject,
      text,
      html,
    });
    console.log(`[email] sent  to=${to}  subject="${subject}"  id=${info.messageId}`);
    return { mode: 'smtp', messageId: info.messageId };
  } catch (err) {
    console.error(`[email] FAILED  to=${to}  err=${err.message}`);
    throw err;
  }
}
