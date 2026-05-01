import { Phone, Ambulance, Clock, Heart, AlertTriangle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { HOSPITAL } from '../data/hospital.js';

export default function Emergency() {
  return (
    <>
      <PageHeader
        title="24×7 Emergency Care"
        subtitle="Trauma. Cardiac. Stroke. Pediatric. We're ready, day and night."
        breadcrumb={[{ label: 'Emergency' }]}
      />

      <section className="section">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--emergency) 0%, var(--emergency-dark) 100%)',
            color: '#fff', padding: 48, borderRadius: 24, textAlign: 'center',
          }}>
            <AlertTriangle size={48} style={{ margin: '0 auto 16px' }} />
            <h2 style={{ color: '#fff' }}>In an emergency?</h2>
            <p style={{ color: 'rgba(255,255,255,.9)', fontSize: '1.1rem', marginBottom: 24 }}>
              Call us immediately. Our emergency team is available 24×7.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={`tel:${HOSPITAL.contact.emergencyRaw}`} className="btn btn-white btn-lg">
                <Phone size={20} /> {HOSPITAL.contact.emergency}
              </a>
              <a href="tel:108" className="btn btn-white btn-lg">
                <Ambulance size={20} /> Ambulance: 108
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Emergencies we handle</span>
            <h2>Trained for every critical moment</h2>
          </div>
          <div className="grid-3">
            {[
              [<Heart size={26} />,         'Cardiac Emergencies',     'Chest pain, heart attack, arrhythmia — rapid ECG and stabilization with cardiology backup.'],
              [<AlertTriangle size={26} />, 'Trauma & Accidents',      'Road accidents, falls, fractures, head injuries — immediate triage in our resus bay.'],
              [<Ambulance size={26} />,     'Stroke / Neurological',   'Sudden weakness, slurred speech — fast neuro assessment for time-critical care.'],
              [<Heart size={26} />,         'Pediatric Emergencies',   'High fever, seizures, breathing difficulty in children — pediatric ER protocols.'],
              [<AlertTriangle size={26} />, 'Obstetric Emergencies',   'Pregnancy complications, labour issues — gynec team on call 24×7.'],
              [<Heart size={26} />,         'Poisoning & Burns',       'Accidental ingestion, snake bites, burns — immediate decontamination and treatment.'],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: '#fee2e2', color: 'var(--emergency)' }}>{icon}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: 32 }}>
            <div style={{ background: '#fff', padding: 32, borderRadius: 16, border: '1px solid var(--border)' }}>
              <h3>What to do before you arrive</h3>
              <ol style={{ paddingLeft: 20, marginTop: 16, display: 'grid', gap: 8, color: 'var(--text-muted)' }}>
                <li>Call our emergency line — we'll prepare for your arrival.</li>
                <li>If safe, note any prior medical history and current medications.</li>
                <li>Carry the patient's ID and any prior reports if possible.</li>
                <li>For trauma, do not move the patient unnecessarily — wait for help.</li>
                <li>For cardiac symptoms, keep the patient seated/calm. Avoid food and water.</li>
              </ol>
            </div>
            <div style={{ background: 'var(--primary-light)', padding: 32, borderRadius: 16 }}>
              <h3>Find us fast</h3>
              <p style={{ margin: '12px 0' }}>Our emergency entrance is at the main hospital — clearly signposted on arrival.</p>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <MapPin size={22} color="var(--primary)" />
                <div>{HOSPITAL.contact.address}</div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <Clock size={22} color="var(--primary)" />
                <div><strong>Open 24 hours, 7 days a week</strong></div>
              </div>
              <Link to="/contact" className="btn btn-primary">Get Directions</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
