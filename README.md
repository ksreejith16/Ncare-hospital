# N Care Hospital — Website

Full-stack website for N Care Hospital, Beeramguda. Frontend is **Vite + React 18** with **React Router**. Backend is **Node.js + Express** with OTP authentication, MongoDB persistence, and SMS / email integration.

```
hospital-site/
├── frontend/   ← Vite React SPA  (deploy to Vercel / Netlify)
├── backend/    ← Express API     (deploy to Render / Railway / AWS)
└── research/   ← source data compiled from public listings
```

The frontend works **out of the box in DEMO mode** (no backend, no SMS, no DB). When you're ready to go live, deploy the backend, point the frontend at it, and add Twilio + MongoDB credentials.

---

## 1. Quick start (local dev)

You need **Node.js ≥ 18** installed.

### Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

By default it runs in **demo mode**:
- The booking flow generates a 6-digit OTP locally (shown in a toast and the browser console).
- Contact form / callback request submissions are logged to the console.
- No backend needed.

### Run the backend (optional for local dev)
```bash
cd backend
cp .env.example .env       # edit values
npm install
npm run dev
```
The API listens on http://localhost:4000.

To make the frontend talk to it, in `frontend/.env`:
```
VITE_API_BASE=http://localhost:4000
```
Restart `npm run dev` after editing env files.

---

## 2. Project layout

### Frontend (`/frontend`)
```
frontend/
├── public/
│   ├── favicon.svg
│   └── _redirects            ← Netlify SPA fallback
├── src/
│   ├── components/           ← Header, Footer, Layout, DoctorCard, Toast …
│   ├── pages/                ← Home, About, Departments, Doctors,
│   │                            BookAppointment, HealthCheckups, Insurance,
│   │                            Contact, Emergency, Services, Careers,
│   │                            Blog, PatientPortal, Privacy, Terms, NotFound
│   ├── data/hospital.js      ← single source of truth (doctors, departments…)
│   ├── lib/api.js            ← backend client
│   ├── App.jsx, main.jsx, index.css
├── index.html
├── vite.config.js, package.json
├── vercel.json               ← Vercel SPA fallback
└── .env.example
```

**Edit `src/data/hospital.js`** to update doctors, departments, packages, contact info, hours, insurance partners, testimonials, blog posts. The whole site reads from this one file.

### Backend (`/backend`)
```
backend/
├── routes/
│   ├── otp.js              ← POST /api/otp/send, /api/otp/verify
│   ├── appointments.js     ← POST /api/appointments
│   └── contact.js          ← POST /api/contact, /api/callback
├── utils/
│   ├── db.js               ← MongoDB + in-memory fallback
│   ├── sms.js              ← Twilio + console fallback
│   ├── email.js            ← SMTP + console fallback
│   └── auth.js             ← JWT helpers
├── server.js
├── package.json
└── .env.example
```

**Graceful fallbacks** — if MongoDB / Twilio / SMTP credentials are missing, the server keeps working using in-memory storage and console logging. Useful for staging.

---

## 3. API contract

| Method | Path                  | Auth        | Body                                                                                          |
|--------|-----------------------|-------------|-----------------------------------------------------------------------------------------------|
| POST   | `/api/otp/send`       | —           | `{ mobile }` → `{ token, expiresIn }`                                                         |
| POST   | `/api/otp/verify`     | —           | `{ token, otp, mobile }` → `{ ok, sessionToken }`                                             |
| POST   | `/api/appointments`   | `Bearer`    | full booking payload → `{ ok, bookingId }`                                                    |
| POST   | `/api/contact`        | —           | `{ name, mobile, email?, subject?, message }`                                                 |
| POST   | `/api/callback`       | —           | `{ name, mobile }`                                                                            |
| GET    | `/api/health`         | —           | `{ ok, service, ts }`                                                                         |

OTPs expire in 5 minutes and allow up to 5 verification attempts. Send is rate-limited to 5 / hour / IP.

---

## 4. Deploying to the cloud

### Frontend → Vercel (recommended) or Netlify

#### Vercel (one-click)
1. Push this repo to GitHub.
2. Visit https://vercel.com → **Add New → Project** → pick the repo.
3. **Root directory** = `frontend`. Framework auto-detects Vite.
4. Add an env var: `VITE_API_BASE=https://your-backend.onrender.com`
5. Deploy. Vercel handles SPA routing (`vercel.json` is included).

#### Netlify
1. https://app.netlify.com → **Add new site → Import from Git**.
2. **Base directory** = `frontend`. **Build command** = `npm run build`. **Publish directory** = `frontend/dist`.
3. Add env: `VITE_API_BASE=https://your-backend...`
4. Deploy. The `public/_redirects` file ensures client-side routes (`/about`, `/doctors/...`) serve `index.html`.

#### Build manually + upload to any static host
```bash
cd frontend
npm install
npm run build
# Upload `dist/` to the host. Make sure the host serves index.html for unknown paths (SPA fallback).
```

### Backend → Render (recommended), Railway, or AWS

#### Render (free tier OK)
1. https://render.com → **New → Web Service** → connect repo.
2. **Root directory** = `backend`.
3. **Build command** = `npm install`. **Start command** = `npm start`.
4. Environment → add the variables from `backend/.env.example` (real values).
5. Deploy. Note the URL — that's your `VITE_API_BASE`.

#### Railway
- Create a new project from this repo, set root = `backend`, add the env vars.

#### Self-hosted (PM2 / systemd)
```bash
cd backend
npm ci --only=production
node server.js
# or with PM2:
pm2 start server.js --name n-care-api
```
Put nginx / Caddy in front for TLS. Your backend will live at e.g. `https://api.ncarehospital.com`.

### Database → MongoDB Atlas (recommended)
1. https://cloud.mongodb.com → free M0 cluster.
2. Database Access → create a user (read/write).
3. Network Access → allow your backend server's IP (or `0.0.0.0/0` for now).
4. **Connect → Drivers** → copy the connection string into `MONGODB_URI`.
5. Restart the backend.

If `MONGODB_URI` is unset the backend uses in-memory storage — fine for testing, but data is lost on restart.

### SMS → Twilio (or MSG91 for India-specific)
1. https://www.twilio.com/try-twilio — create account, get a free trial number.
2. Copy `Account SID`, `Auth Token`, and your sender number into `TWILIO_*` envs.
3. Verify a destination number first (free trial constraint), then test the OTP flow.
4. **Production tip:** for India, MSG91 / Gupshup are typically cheaper. Replace `utils/sms.js` with their SDK — same `sendSms(mobile, message)` interface.

### Email → SMTP (Gmail / SendGrid / SES / etc.)
- Set the `SMTP_*` envs. For Gmail, generate an App Password.
- Without these, mail is logged to the server console — convenient for staging.

---

## 5. Custom domain & DNS

When you have a domain (e.g. `ncarehospital.com`):

| Record | Host      | Value                          |
|--------|-----------|--------------------------------|
| A / CNAME | `@`    | (Vercel/Netlify CNAME target) |
| CNAME  | `www`     | (same)                         |
| CNAME  | `api`     | (Render/Railway service URL)   |

In Vercel/Netlify, add the domain in **Settings → Domains** — they'll guide you through the exact records.

Update `frontend/.env`:
```
VITE_API_BASE=https://api.ncarehospital.com
```

Update `backend/.env`:
```
CORS_ORIGINS=https://ncarehospital.com,https://www.ncarehospital.com
```

---

## 6. Updating content

Almost everything visible on the site comes from **`frontend/src/data/hospital.js`**:
- Hospital name, address, phones, email
- Hours, social links
- Departments (12) — slug, icon, name, description
- Doctors — name, specialty, qualifications, fees, timings, bio
- Health checkup packages — name, price, MRP, included tests
- Insurance partners (cashless network)
- Why-choose-us features
- Testimonials
- Blog posts

Pages such as Careers (`pages/Careers.jsx`) have an `OPENINGS` array near the top — edit it to update job listings.

---

## 7. Things flagged as PLACEHOLDER

These should be replaced with the hospital's real values before launch (search the codebase for `PLACEHOLDER` to find all):

- Established year (currently `2014`)
- Total doctor count (currently `25` for stat display)
- Email addresses (`info@`, `appointments@`, `careers@`)
- WhatsApp number (`+919999999999`)
- Ambulance number (`108` is the public emergency line)
- Social media URLs (currently `#`)
- Photographs of the hospital, doctors, and OPD/OT — currently emoji-based placeholders
- Aarogyasri / CGHS / ECHS empanelment status — confirm and update Insurance page
- Insurance partner list — confirm exact list with the hospital

The `research/hospital-research.md` document has the full source-of-truth used for the public-facing copy.

---

## 8. Production checklist

Before going live:
- [ ] Replace ALL placeholders in `data/hospital.js` and the Careers page
- [ ] Add real hospital photos (replace emoji placeholders)
- [ ] Confirm Insurance partner list and Aarogyasri / CGHS coverage
- [ ] Set up real `VITE_API_BASE` and `CORS_ORIGINS`
- [ ] Provision Twilio + MongoDB Atlas + SMTP
- [ ] Buy domain → wire DNS → enable HTTPS
- [ ] Replace JSON-LD `https://example.com/...` URLs with the real domain in `index.html`
- [ ] Replace the Google Maps embed URL with the actual coordinates of the hospital
- [ ] Add Google Analytics 4 / Meta pixel if needed
- [ ] Test booking flow end-to-end with a real mobile number
- [ ] Test cashless flow copy with the hospital's TPA desk
- [ ] Run a Lighthouse audit; target ≥ 90 on Performance, Accessibility, SEO

---

## 9. License

Proprietary — © N Care Hospital. Unauthorized reproduction prohibited.
