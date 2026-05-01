// Backend API client.
// Set VITE_API_BASE in `.env` (e.g. VITE_API_BASE=https://api.ncarehospital.com)
// When unset, the app falls back to demo mode (OTP shown in toast/console).

export const API_BASE = import.meta.env.VITE_API_BASE || '';
export const DEMO_MODE = !API_BASE;

async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const api = {
  sendOtp:    (mobile) => request('/api/otp/send',    { method: 'POST', body: JSON.stringify({ mobile }) }),
  verifyOtp:  (token, otp, mobile) => request('/api/otp/verify',  { method: 'POST', body: JSON.stringify({ token, otp, mobile }) }),
  bookAppt:   (sessionToken, payload) =>
    request('/api/appointments', { method: 'POST', headers: { Authorization: `Bearer ${sessionToken}` }, body: JSON.stringify(payload) }),
  contact:    (payload) => request('/api/contact', { method: 'POST', body: JSON.stringify(payload) }),
  callback:   (payload) => request('/api/callback', { method: 'POST', body: JSON.stringify(payload) }),
};
