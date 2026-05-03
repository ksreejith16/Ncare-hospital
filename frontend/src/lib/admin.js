// Admin API client + token storage.
// Admin pages use this to call /api/admin/* with the Bearer token.

import { API_BASE } from './api.js';

const KEY = 'ncare_admin_token';
const NAME_KEY = 'ncare_admin_name';

export const adminAuth = {
  get token()    { return localStorage.getItem(KEY) || ''; },
  get name()     { return localStorage.getItem(NAME_KEY) || ''; },
  isLoggedIn()   { return !!this.token; },
  set(token, name) {
    localStorage.setItem(KEY, token);
    if (name) localStorage.setItem(NAME_KEY, name);
  },
  clear() { localStorage.removeItem(KEY); localStorage.removeItem(NAME_KEY); },
};

async function adminRequest(path, opts = {}) {
  if (!API_BASE) throw new Error('Backend URL is not configured. Set VITE_API_BASE in .env');
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(adminAuth.token ? { Authorization: `Bearer ${adminAuth.token}` } : {}),
      ...(opts.headers || {}),
    },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    adminAuth.clear();
    throw new Error(data.message || 'Session expired — please log in again');
  }
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const adminApi = {
  login: (username, password) => adminRequest('/api/admin/login', {
    method: 'POST', body: JSON.stringify({ username, password }),
  }),
  me: () => adminRequest('/api/admin/me'),
  stats: () => adminRequest('/api/admin/stats'),

  listAppointments: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null));
    return adminRequest(`/api/admin/appointments?${qs.toString()}`);
  },
  getAppointment: (id) => adminRequest(`/api/admin/appointments/${encodeURIComponent(id)}`),
  updateAppointment: (id, body) => adminRequest(`/api/admin/appointments/${encodeURIComponent(id)}`, {
    method: 'PATCH', body: JSON.stringify(body),
  }),

  listContacts: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null));
    return adminRequest(`/api/admin/contacts?${qs.toString()}`);
  },
  markContactRead: (id, read = true) => adminRequest(`/api/admin/contacts/${encodeURIComponent(id)}`, {
    method: 'PATCH', body: JSON.stringify({ read }),
  }),
};
