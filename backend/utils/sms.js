// Twilio SMS sender. If credentials are missing, OTP is logged to the console.

let twilioClient = null;
const sid   = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from  = process.env.TWILIO_FROM_NUMBER;

if (sid && token && from) {
  try {
    const { default: Twilio } = await import('twilio');
    twilioClient = Twilio(sid, token);
    console.log('[sms] Twilio configured');
  } catch (err) {
    console.warn('[sms] Twilio package missing or failed to init — falling back to console:', err.message);
  }
} else {
  console.log('[sms] Twilio not configured — OTPs and SMS will be logged to the console.');
}

export async function sendSms(toMobile, message) {
  const e164 = toMobile.startsWith('+') ? toMobile : `+91${toMobile}`;
  if (!twilioClient) {
    console.log(`\n[SMS:CONSOLE]  to=${e164}\n  ${message}\n`);
    return { mode: 'console' };
  }
  await twilioClient.messages.create({ to: e164, from, body: message });
  return { mode: 'twilio' };
}
