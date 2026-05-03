# N Care Hospital — Website + Backend

A complete, production-ready website and back-office for N Care Hospital, Beeramguda.

```
hospital-site/
├── frontend/   ← Vite + React 18  (deploy to Vercel)
├── backend/    ← Node.js + Express  (deploy to Render / Railway)
└── research/   ← source data compiled from public listings
```

The frontend works **out of the box in DEMO mode** (no backend needed). The backend goes live the moment you set the right environment variables.

---

## 🟢 Quick start (local dev)

```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:5173

# Backend (in another terminal)
cd backend
cp .env.example .env # works as-is for local testing
npm install
npm run dev          # http://localhost:4000
```

To make the frontend talk to the backend during local dev, add `VITE_API_BASE=http://localhost:4000` to `frontend/.env` and restart Vite.

---

## 📋 What the hospital gets

| Capability | Where | Status |
|---|---|---|
| Multi-step appointment booking with **mobile OTP** | `/book-appointment` | ✅ |
| 17 polished public pages (Home, Departments, Doctors, Services, Gallery, Insurance, Health Checkups, etc.) | `/` | ✅ |
| Multilingual **AI chatbot** (English / Telugu / Hindi) | bottom-right of any page | ✅ scripted + Gemini fallback |
| Real-time **slot availability** (no double-booking) | booking flow | ✅ |
| **Admin dashboard** to view, filter, confirm, cancel bookings | `/admin` | ✅ |
| **Contact-form inbox** in admin | `/admin` → Contacts tab | ✅ |
| Branded HTML **booking confirmation emails** (patient + hospital) | sent on booking | ✅ |
| Branded **status-change emails** (when admin confirms / cancels) | sent on update | ✅ |
| **SMS** confirmations & status updates | sent on booking & status change | ✅ |
| Mobile-responsive, NABH-credible design | all pages | ✅ |
| Photo gallery with lightbox | `/gallery` | ✅ |

---

## 🔌 Wiring up real services (production handover)

The backend uses graceful fallbacks — every service is optional and degrades to console-logging. To go live, set these variables in `backend/.env`:

### 1. Database — MongoDB Atlas (free tier OK)

1. Create cluster → https://cloud.mongodb.com (Free M0 is enough for a 50-bed hospital).
2. **Database Access** → create a user with read/write.
3. **Network Access** → allow your backend host's IP (or `0.0.0.0/0` for now).
4. **Connect → Drivers → Node.js** → copy connection string.
5. In `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/ncare?retryWrites=true&w=majority
   ```

### 2. SMS — Twilio (or MSG91 for India)

1. https://www.twilio.com/try-twilio → free trial includes a phone number.
2. Copy SID, Auth Token, and your Twilio phone number.
3. In `backend/.env`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_FROM_NUMBER=+1xxxxxxxxxx
   ```
4. **For India production**, MSG91 / Gupshup are typically cheaper. The `utils/sms.js` interface (`sendSms(mobile, message)`) is provider-agnostic — swap the implementation in one place.

### 3. Email — any SMTP (Gmail App Password, SendGrid, SES, etc.)

For Gmail:
1. https://myaccount.google.com/apppasswords → generate an app password.
2. In `backend/.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your.email@gmail.com
   SMTP_PASS=the-16-char-app-password
   SMTP_FROM="N Care Hospital <noreply@ncarehospital.com>"
   HOSPITAL_NOTIFICATION_EMAIL=appointments@ncarehospital.com
   ```

### 4. Chatbot — Gemini (optional)

1. Free key at https://aistudio.google.com/apikey
2. In `backend/.env`:
   ```
   GEMINI_API_KEY=your_key
   GEMINI_MODEL=gemini-1.5-flash
   ```

### 5. Admin login — pick one of two options

**Option A (simplest, no DB seeding needed):** ENV-based admin
```
ADMIN_USERNAME=hospital
ADMIN_PASSWORD=use-a-strong-password
```
Anyone with these credentials can log into `/admin`.

**Option B (database-backed, can rotate per user):** Seed an admin
```bash
cd backend
SEED_ADMIN_USERNAME=admin SEED_ADMIN_PASSWORD=changeme-now npm run seed
```
This creates the admin in MongoDB. Multiple admins can be added by inserting more rows in the `admins` collection (or building a UI for it later).

### 6. JWT secret — generate a strong one
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Paste into `JWT_SECRET=` in `backend/.env`.

---

## ☁️ Deployment

### Frontend → **Vercel**
1. https://vercel.com → import the GitHub repo.
2. **Root directory** = `frontend`. Framework = Vite (auto).
3. **Environment Variables** → `VITE_API_BASE = https://your-backend.onrender.com`
4. Deploy. Get a `https://your-app.vercel.app` URL.

### Backend → **Render** (free tier, sleeps after 15 min idle)
1. https://render.com → **New → Web Service** → connect repo.
2. **Root directory** = `backend`.
3. **Build command** = `npm install`. **Start command** = `npm start`.
4. **Environment** → paste all the variables from your `backend/.env`.
5. Deploy. Note the URL — that's your `VITE_API_BASE`.

For higher traffic, use **Railway**, **Fly.io**, or a small DigitalOcean droplet (~$6/mo, no cold starts).

### Custom domain
- Frontend: Vercel → Settings → Domains → add `ncarehospital.com`.
- Backend: Render → Settings → Custom Domain → add `api.ncarehospital.com`.
- Update `VITE_API_BASE=https://api.ncarehospital.com` in Vercel.
- Update `CORS_ORIGINS=https://ncarehospital.com,https://www.ncarehospital.com` in Render.

---

## 🛡️ Admin dashboard

**URL:** `https://your-site.com/admin/login`

Once logged in, hospital staff can:
- See **dashboard cards**: today's bookings, pending review, confirmed, total, unread messages.
- **Filter / search** appointments by status, date, doctor, mobile, name, booking ID.
- **Click any row** → see full booking detail, patient info, internal notes textarea.
- **Update status**: Pending → Confirmed → Completed / Cancelled / No-show. Patient is auto-notified by SMS + email when the status changes.
- **Add internal notes** that the patient never sees.
- **Browse contact-form messages**, mark read/unread, click to call or email.

**Staff training tip:** the typical workflow is open `/admin` first thing in the morning, sort by date = today, and confirm or call out the pending bookings. Then check the contacts tab for any unread messages.

---

## 📂 Project layout

### `frontend/` (Vite + React 18 + React Router)
```
src/
├── components/      Header, Footer, Layout, DoctorCard, Chatbot, Toast, …
├── pages/           Home, About, Departments, Doctors, BookAppointment, Gallery,
│                    HealthCheckups, Insurance, Contact, Emergency, Services,
│                    Careers, Blog, PatientPortal, Privacy, Terms, NotFound
│   └── admin/       Login, Dashboard
├── data/hospital.js  ← single source of truth (doctors, depts, packages, contact)
├── lib/api.js        ← public API client
├── lib/admin.js      ← admin API client + token storage
└── index.css         ← design system + admin styles
```

### `backend/` (Node.js + Express)
```
backend/
├── routes/
│   ├── otp.js              POST /api/otp/send, /api/otp/verify
│   ├── appointments.js     POST /api/appointments  (slot conflict checked)
│   ├── availability.js     GET  /api/availability
│   ├── contact.js          POST /api/contact, /api/callback
│   ├── chat.js             POST /api/chat       (Gemini-ready)
│   └── admin.js            login, list/update bookings, contacts, stats
├── utils/
│   ├── db.js               MongoDB models + in-memory fallback
│   ├── sms.js              Twilio + console fallback
│   ├── email.js            SMTP + console fallback
│   ├── emailTemplates.js   branded HTML emails
│   └── auth.js             JWT helpers + requireAuth / requireAdmin
├── middleware/
│   └── asyncHandler.js     wrap async routes for clean error handling
├── scripts/
│   └── seed.js             npm run seed → creates first admin
├── server.js               app entry (helmet, compression, morgan, CORS, routes)
└── package.json
```

---

## ✅ Pre-launch checklist

Before publicly marketing the site:

- [ ] Replace `PLACEHOLDER` values in `frontend/src/data/hospital.js` (real email, WhatsApp, established year, social URLs)
- [ ] Confirm Dr. C. Venkateshwara Reddy's actual specialty (currently a placeholder)
- [ ] **Compress hospital photos** in `frontend/public/images/facility/` — `doctor-cabin.png` is 7.8 MB. Use TinyPNG / Squoosh to get each under 300 KB. Big images hurt mobile load time and SEO.
- [ ] Replace `https://example.com/...` URLs in `frontend/index.html` JSON-LD with the real domain
- [ ] Update Google Maps embed in `data/hospital.js` with the hospital's exact lat/lng
- [ ] Provision MongoDB Atlas, Twilio, SMTP, Gemini (above)
- [ ] Generate a strong `JWT_SECRET` and set strong `ADMIN_PASSWORD`
- [ ] Buy domain → wire DNS → enable HTTPS
- [ ] Add Google Analytics 4 + Meta pixel (when needed)
- [ ] Test booking flow end-to-end with a real mobile number (not your own)
- [ ] Test cashless treatment copy with the hospital's TPA desk
- [ ] Run a Lighthouse audit; target ≥ 90 on Performance, Accessibility, SEO

---

## 🧪 Smoke-test the deployed system

After everything is deployed:

```bash
# Public side
1. Visit https://your-domain.com → click around all 6 nav items
2. Open /book-appointment → fill form → enter the OTP from your phone
3. Confirm a real SMS arrived; check your email for confirmation
4. Open the chatbot → switch language → walk through booking flow inside it
5. Open /gallery → click a photo, lightbox opens, ←/→/Esc work

# Admin side
6. Visit /admin/login → enter credentials
7. Confirm the booking from step 3 appears in the table
8. Mark it Confirmed → patient should get SMS + email
9. Resize browser to 375px → confirm everything is responsive
```

If all 9 pass, you're live.

---

## 📞 Operational tips for the hospital

- **Front desk** should keep `/admin` open throughout the day to confirm bookings as they arrive (patient gets a confirmation SMS the moment they're confirmed).
- **OTP not arriving** → check Twilio console for delivery status. Indian carriers sometimes filter promotional senders; switch to MSG91 for better delivery.
- **Email not arriving** → check Spam first. Make sure SMTP_FROM is a domain you control (not a personal Gmail) for production.
- **Slot conflict 409 error** → another patient just booked the same slot. Tell them to refresh and pick another time.

---

## 📜 License

Proprietary — © N Care Hospital. Unauthorized reproduction prohibited.
