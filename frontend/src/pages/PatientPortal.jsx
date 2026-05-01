import { useState } from 'react';
import { Lock, FileText, Pill, Calendar, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { HOSPITAL } from '../data/hospital.js';
import { toast } from '../components/Toast.jsx';

export default function PatientPortal() {
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  function sendOtp(e) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) return toast('Enter a valid mobile', 'error');
    toast('Demo: OTP sent. Use 123456 to log in.');
    setOtpSent(true);
  }
  function verify(e) {
    e.preventDefault();
    if (otp !== '123456') return toast('Invalid OTP. (Demo: use 123456)', 'error');
    toast('Login successful — full portal coming soon!');
  }

  return (
    <>
      <PageHeader
        title="Patient Portal"
        subtitle="Access reports, prescriptions, and appointment history."
        breadcrumb={[{ label: 'Patient Portal' }]}
      />

      <section className="section">
        <div className="container split-equal" style={{ alignItems: 'flex-start' }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: 'var(--primary-light)',
              color: 'var(--primary)', display: 'grid', placeItems: 'center', marginBottom: 16,
            }}><Lock size={26} /></div>
            <h3>Sign in with mobile</h3>
            <p style={{ margin: '8px 0 24px' }}>We'll send a 6-digit OTP to your registered mobile number.</p>

            {!otpSent ? (
              <form onSubmit={sendOtp}>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="tel" inputMode="numeric" autoComplete="tel" pattern="[6-9]\d{9}" placeholder="10-digit mobile"
                    value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} required />
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Send OTP</button>
              </form>
            ) : (
              <form onSubmit={verify}>
                <div className="form-group">
                  <label>Enter OTP sent to +91 {mobile}</label>
                  <input type="tel" inputMode="numeric" autoComplete="one-time-code" maxLength="6"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit OTP" required />
                  <div className="form-help">Demo OTP: 123456</div>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Verify &amp; Sign In</button>
                <button type="button" onClick={() => setOtpSent(false)} className="btn btn-block btn-sm" style={{ marginTop: 8, color: 'var(--primary)' }}>Change mobile</button>
              </form>
            )}

            <div className="alert alert-info" style={{ marginTop: 24 }}>
              <ShieldCheck size={18} />
              <div><strong>Secure access:</strong> Your data is protected. We never share medical records without your consent.</div>
            </div>
          </div>

          <div>
            <h3>What you can do</h3>
            <p style={{ marginTop: 8, marginBottom: 24 }}>Once signed in, the portal gives you a single place to manage your healthcare.</p>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                [<FileText size={22} />, 'Lab reports', 'Download blood test, X-ray, and imaging reports as soon as they are ready.'],
                [<Pill size={22} />,     'Prescriptions', 'View and download e-prescriptions from your last visit.'],
                [<Calendar size={22} />, 'Appointments', 'See your upcoming bookings, reschedule, or cancel in one click.'],
                [<ShieldCheck size={22} />, 'Insurance status', 'Track your cashless requests, approvals, and claim status.'],
              ].map(([icon, title, desc], i) => (
                <div key={i} style={{
                  background: '#fff', padding: 20, borderRadius: 12, border: '1px solid var(--border)',
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                }}>
                  <div style={{ color: 'var(--primary)', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <strong style={{ fontSize: '1rem' }}>{title}</strong>
                    <p style={{ fontSize: '.88rem', marginTop: 4 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 24, fontSize: '.85rem', color: 'var(--text-light)' }}>
              Trouble signing in? Call us at <a href={`tel:${HOSPITAL.contact.phoneRaw}`}>{HOSPITAL.contact.phone}</a>.
            </p>
          </div>
        </div>

      </section>
    </>
  );
}
