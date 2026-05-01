import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, ArrowRight, Phone, Clock, MapPin, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { HOSPITAL } from '../data/hospital.js';
import { api, DEMO_MODE } from '../lib/api.js';
import { toast } from '../components/Toast.jsx';

const STEPS = [
  { num: 1, label: 'Choose' },
  { num: 2, label: 'Patient details' },
  { num: 3, label: 'Verify mobile' },
  { num: 4, label: 'Confirmation' },
];

export default function BookAppointment() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    department: params.get('dept') || '',
    doctor:     params.get('doctor') || '',
    date:       '',
    time:       '',
    name: '', age: '', gender: '',
    mobile: params.get('mobile') || '',
    email: '', notes: '',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const [otpToken, setOtpToken] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [sessionToken, setSessionToken] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [busy, setBusy] = useState(false);

  const filteredDoctors = useMemo(() =>
    !form.department ? HOSPITAL.doctors : HOSPITAL.doctors.filter(d => d.department === form.department),
    [form.department]
  );

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function next1() {
    if (!form.department) return toast('Please select a department', 'error');
    if (!form.date) return toast('Please pick a date', 'error');
    if (!form.time) return toast('Please pick a time', 'error');
    setStep(2);
  }

  async function sendOtp() {
    if (!form.name || form.name.length < 2) return toast('Enter a valid name', 'error');
    if (!form.age || form.age < 1) return toast('Enter a valid age', 'error');
    if (!form.gender) return toast('Please select gender', 'error');
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return toast('Enter a valid 10-digit Indian mobile', 'error');

    setBusy(true);
    try {
      if (DEMO_MODE) {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        setDemoOtp(code);
        console.log('[DEMO] Your OTP is:', code);
        toast(`Demo OTP: ${code} (also in console)`);
      } else {
        const res = await api.sendOtp(form.mobile);
        setOtpToken(res.token);
        toast('OTP sent to +91 ' + form.mobile);
      }
      setStep(3);
      setResendIn(30);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (e) { toast(e.message, 'error'); }
    finally { setBusy(false); }
  }

  function onOtpChange(i, v) {
    const digit = v.replace(/\D/g, '').slice(0, 1);
    setOtp(curr => {
      const next = [...curr]; next[i] = digit; return next;
    });
    if (digit && otpRefs.current[i + 1]) otpRefs.current[i + 1].focus();
  }
  function onOtpKey(i, e) {
    if (e.key === 'Backspace' && !otp[i] && otpRefs.current[i - 1]) otpRefs.current[i - 1].focus();
  }
  function onOtpPaste(e) {
    const txt = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
    if (txt.length === 6) {
      e.preventDefault();
      setOtp(txt.split(''));
      setTimeout(() => otpRefs.current[5]?.focus(), 0);
    }
  }

  async function verifyAndBook() {
    const code = otp.join('');
    if (code.length !== 6) return toast('Enter all 6 digits', 'error');
    setBusy(true);
    try {
      if (DEMO_MODE) {
        if (code !== demoOtp) throw new Error('Invalid OTP');
        const id = 'NCH-' + Date.now().toString().slice(-8);
        setBookingId(id);
      } else {
        const v = await api.verifyOtp(otpToken, code, form.mobile);
        setSessionToken(v.sessionToken);
        const b = await api.bookAppt(v.sessionToken, form);
        setBookingId(b.bookingId);
      }
      setStep(4);
    } catch (e) { toast(e.message, 'error'); }
    finally { setBusy(false); }
  }

  const dept = HOSPITAL.departments.find(d => d.slug === form.department);
  const doc = HOSPITAL.doctors.find(d => d.slug === form.doctor);

  return (
    <>
      <PageHeader
        title="Book an Appointment"
        subtitle="Three quick steps. Mobile verification keeps your booking secure."
        breadcrumb={[{ label: 'Book Appointment' }]}
      />

      <section className="section">
        <div className="container split-with-sidebar">
          {/* MAIN */}
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}>
            {/* Stepper */}
            <div className="stepper">
              {STEPS.map(s => (
                <div key={s.num} className={`step ${step === s.num ? 'active' : step > s.num ? 'complete' : ''}`}>
                  <div className="step-num">{step > s.num ? <CheckCircle2 size={18} /> : s.num}</div>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            {DEMO_MODE && step === 1 && (
              <div className="alert alert-info">
                <ShieldCheck size={18} />
                <div>Running in <strong>demo mode</strong> — OTP is generated locally and shown on screen. Configure <code>VITE_API_BASE</code> to use the real backend with SMS OTP.</div>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h3 style={{ marginBottom: 8 }}>Choose your appointment</h3>
                <p style={{ marginBottom: 24 }}>Pick a department, date and time. Selecting a specific doctor is optional.</p>

                <div className="form-row">
                  <div className="form-group">
                    <label>Department <span className="required">*</span></label>
                    <select value={form.department} onChange={e => { update('department', e.target.value); update('doctor', ''); }} required>
                      <option value="">Select department</option>
                      {HOSPITAL.departments.map(d => <option key={d.slug} value={d.slug}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Doctor (optional)</label>
                    <select value={form.doctor} onChange={e => update('doctor', e.target.value)}>
                      <option value="">Any available doctor</option>
                      {filteredDoctors.map(d => <option key={d.slug} value={d.slug}>{d.name} — {d.specialty}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date <span className="required">*</span></label>
                    <input type="date" min={today} value={form.date} onChange={e => update('date', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Preferred Time <span className="required">*</span></label>
                    <select value={form.time} onChange={e => update('time', e.target.value)} required>
                      <option value="">Select time slot</option>
                      {['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                  <button className="btn btn-primary" onClick={next1}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h3 style={{ marginBottom: 8 }}>Patient details</h3>
                <p style={{ marginBottom: 24 }}>Tell us a bit about the patient. We'll send an OTP to your mobile to verify.</p>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name <span className="required">*</span></label>
                    <input type="text" autoComplete="name" value={form.name} onChange={e => update('name', e.target.value)} required />
                  </div>
                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <div className="form-group">
                      <label>Age <span className="required">*</span></label>
                      <input type="number" inputMode="numeric" min="0" max="120" value={form.age} onChange={e => update('age', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Gender <span className="required">*</span></label>
                      <select value={form.gender} onChange={e => update('gender', e.target.value)} required>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number <span className="required">*</span></label>
                    <input type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit Indian mobile" pattern="[6-9]\d{9}"
                      value={form.mobile} onChange={e => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
                    <div className="form-help">We'll send a 6-digit OTP to verify this number.</div>
                  </div>
                  <div className="form-group">
                    <label>Email (optional)</label>
                    <input type="email" autoComplete="email" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Reason / Notes (optional)</label>
                  <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Briefly describe your concern…" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button>
                  <button className="btn btn-primary" onClick={sendOtp} disabled={busy}>
                    {busy ? 'Sending OTP…' : <>Send OTP <ArrowRight size={16} /></>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <h3 style={{ marginBottom: 8 }}>Verify your mobile</h3>
                <p style={{ marginBottom: 8 }}>We've sent a 6-digit OTP to <strong>+91 {form.mobile}</strong>.</p>
                <button className="btn btn-sm" style={{ color: 'var(--primary)', marginBottom: 16 }} onClick={() => setStep(2)}>Change number</button>

                <div className="otp-group" onPaste={onOtpPaste}>
                  {otp.map((v, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="tel"
                      inputMode="numeric"
                      maxLength="1"
                      autoComplete={i === 0 ? 'one-time-code' : 'off'}
                      value={v}
                      onChange={e => onOtpChange(i, e.target.value)}
                      onKeyDown={e => onOtpKey(i, e)}
                    />
                  ))}
                </div>

                <div style={{ textAlign: 'center', fontSize: '.9rem', color: 'var(--text-light)' }}>
                  Didn't receive it?{' '}
                  {resendIn > 0
                    ? <span>Resend in {resendIn}s</span>
                    : <button onClick={sendOtp} style={{ color: 'var(--primary)', fontWeight: 600 }}>Resend OTP</button>
                  }
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</button>
                  <button className="btn btn-primary" onClick={verifyAndBook} disabled={busy}>
                    {busy ? 'Verifying…' : <>Verify &amp; Confirm <CheckCircle2 size={16} /></>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: '#d1fae5', display: 'grid', placeItems: 'center',
                  color: '#065f46', margin: '0 auto 24px',
                }}>
                  <CheckCircle2 size={40} />
                </div>
                <h2>Appointment Confirmed!</h2>
                <p style={{ marginBottom: 8 }}>Your booking ID is</p>
                <div style={{
                  display: 'inline-block', padding: '8px 20px', background: 'var(--primary-light)',
                  color: 'var(--primary-dark)', borderRadius: 100, fontWeight: 700, fontSize: '1.1rem',
                  letterSpacing: '.05em', marginBottom: 24,
                }}>{bookingId}</div>

                <div style={{
                  background: 'var(--bg-soft)', padding: 24, borderRadius: 12,
                  textAlign: 'left', maxWidth: 480, margin: '0 auto', display: 'grid', gap: 8, fontSize: '.95rem',
                }}>
                  <div><strong>Patient:</strong> {form.name} ({form.age}, {form.gender})</div>
                  <div><strong>Mobile:</strong> +91 {form.mobile}</div>
                  <div><strong>Department:</strong> {dept ? dept.name : '—'}</div>
                  <div><strong>Doctor:</strong> {doc ? doc.name : 'Will be assigned at OPD'}</div>
                  <div><strong>Date &amp; Time:</strong> {form.date} at {form.time}</div>
                </div>

                <p style={{ marginTop: 24, fontSize: '.92rem' }}>
                  We'll send an SMS confirmation to your mobile shortly. Please reach the hospital 15 minutes before your slot with a valid ID.
                </p>

                <div className="btn-group" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                  <Link to="/" className="btn btn-outline">Back to Home</Link>
                  <button onClick={() => window.print()} className="btn btn-primary">Print / Save</button>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--primary)', color: '#fff', padding: 24, borderRadius: 16 }}>
              <strong style={{ display: 'block', marginBottom: 8, color: '#fff' }}>Need help?</strong>
              <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '.92rem', marginBottom: 16 }}>
                Call us during OPD hours and our team will assist you with your booking.
              </p>
              <a href={`tel:${HOSPITAL.contact.phoneRaw}`} className="btn btn-white btn-block">
                <Phone size={16} /> {HOSPITAL.contact.phone}
              </a>
            </div>

            <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: 16 }}>Hospital Info</h4>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '.9rem' }}>{HOSPITAL.contact.address}</div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                <Clock size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '.9rem' }}>
                  <strong>OPD:</strong> {HOSPITAL.hours.opd}<br />
                  <strong>Emergency:</strong> {HOSPITAL.hours.emergency}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <ShieldCheck size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '.9rem' }}>NABH-accredited multi-specialty hospital</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-soft)', padding: 24, borderRadius: 16, fontSize: '.88rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 8 }}>What happens next?</strong>
              <ol style={{ paddingLeft: 18, display: 'grid', gap: 6 }}>
                <li>You'll get an SMS with your booking ID.</li>
                <li>Our team confirms within 30 minutes during OPD hours.</li>
                <li>Reach the hospital 15 minutes before the slot.</li>
                <li>Carry a valid ID and any prior reports.</li>
              </ol>
            </div>
          </aside>
        </div>

      </section>
    </>
  );
}
