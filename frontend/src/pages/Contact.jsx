import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { HOSPITAL } from '../data/hospital.js';
import { api, DEMO_MODE } from '../lib/api.js';
import { toast } from '../components/Toast.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);
  function up(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.name || form.name.length < 2) return toast('Enter a valid name', 'error');
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return toast('Enter a valid mobile', 'error');
    if (!form.message || form.message.length < 5) return toast('Enter a message', 'error');
    setBusy(true);
    try {
      if (DEMO_MODE) {
        console.log('[DEMO] Contact form submitted:', form);
        toast('Message received! We will reply within 1 business day.');
      } else {
        await api.contact(form);
        toast('Message received! We will reply within 1 business day.');
      }
      setForm({ name: '', email: '', mobile: '', subject: '', message: '' });
    } catch (err) { toast(err.message, 'error'); }
    finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="We're here to help. Reach out by phone, email, or visit us in person."
        breadcrumb={[{ label: 'Contact' }]}
      />

      <section className="section">
        <div className="container grid-4" style={{ gap: 16 }}>
          {[
            [<MapPin size={26} />, 'Visit us',     <span>{HOSPITAL.contact.address}<br /><a href={HOSPITAL.contact.mapsLink} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>Get directions →</a></span>],
            [<Phone size={26} />,  'Call us',      <span><a href={`tel:${HOSPITAL.contact.phoneRaw}`}>{HOSPITAL.contact.phone}</a><br /><strong style={{ color: 'var(--emergency)' }}>Emergency: {HOSPITAL.contact.emergency}</strong></span>],
            [<Mail size={26} />,   'Email us',     <span><a href={`mailto:${HOSPITAL.contact.email}`}>{HOSPITAL.contact.email}</a><br /><a href={`mailto:${HOSPITAL.contact.appointmentEmail}`}>{HOSPITAL.contact.appointmentEmail}</a></span>],
            [<Clock size={26} />,  'Hours',        <span><strong>OPD:</strong> {HOSPITAL.hours.opd}<br /><strong>Emergency:</strong> 24×7</span>],
          ].map(([icon, title, body], i) => (
            <div key={i} style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid var(--border)' }}>
              <div className="feature-icon">{icon}</div>
              <h4 style={{ marginBottom: 8 }}>{title}</h4>
              <p style={{ fontSize: '.9rem' }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container split-equal">
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}>
            <h3>Send us a message</h3>
            <p style={{ marginBottom: 24 }}>Have a question or feedback? Drop us a note and we'll get back within 1 business day.</p>

            <form onSubmit={submit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input type="text" autoComplete="name" value={form.name} onChange={e => up('name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Mobile <span className="required">*</span></label>
                  <input type="tel" inputMode="numeric" autoComplete="tel" pattern="[6-9]\d{9}" value={form.mobile} onChange={e => up('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" autoComplete="email" value={form.email} onChange={e => up('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select value={form.subject} onChange={e => up('subject', e.target.value)}>
                    <option value="">Select</option>
                    <option>Appointment query</option>
                    <option>Insurance / TPA</option>
                    <option>Feedback / Grievance</option>
                    <option>Health checkup</option>
                    <option>Careers</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Message <span className="required">*</span></label>
                <textarea value={form.message} onChange={e => up('message', e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
                {busy ? 'Sending…' : <>Send Message <Send size={16} /></>}
              </button>
            </form>
          </div>

          <div>
            <h3>Find us on the map</h3>
            <p style={{ marginBottom: 24 }}>{HOSPITAL.contact.address}</p>
            <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <iframe
                src={HOSPITAL.contact.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="N Care Hospital location"
              />
            </div>
            <a href={HOSPITAL.contact.mapsLink} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ marginTop: 16 }}>
              Open in Google Maps
            </a>
          </div>
        </div>

      </section>
    </>
  );
}
