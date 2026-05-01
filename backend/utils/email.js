// Nodemailer-based mail sender. If SMTP creds are missing, mail is logged.

import nodemailer from 'nodemailer';

let transporter = null;
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  console.log('[email] SMTP configured');
} else {
  console.log('[email] SMTP not configured — mail will be logged to the console.');
}

export async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.log(`\n[EMAIL:CONSOLE]\n  to=${to}\n  subject=${subject}\n  ${text || html}\n`);
    return { mode: 'console' };
  }
  await transporter.sendMail({
    from: SMTP_FROM || 'noreply@ncarehospital.com',
    to,
    subject,
    text,
    html,
  });
  return { mode: 'smtp' };
}
