import { Briefcase, Heart, GraduationCap, Mail } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { HOSPITAL } from '../data/hospital.js';

const OPENINGS = [
  { title: 'Staff Nurse — ICU',       dept: 'Critical Care',    type: 'Full-time', exp: '2+ years',  qualif: 'B.Sc / GNM Nursing, valid TS Nursing Council registration' },
  { title: 'Lab Technician',          dept: 'Pathology',        type: 'Full-time', exp: '1+ years',  qualif: 'DMLT / B.Sc MLT' },
  { title: 'Physiotherapist',         dept: 'Physiotherapy',    type: 'Full-time', exp: '0–2 years', qualif: 'BPT / MPT' },
  { title: 'Front Desk Executive',    dept: 'Patient Services', type: 'Full-time', exp: '1+ years',  qualif: 'Graduate, English + Telugu fluency' },
  { title: 'Junior Resident',         dept: 'General Medicine', type: 'Full-time', exp: '0–1 years', qualif: 'MBBS with valid TSMC registration' },
  { title: 'Pharmacist',              dept: 'Pharmacy',         type: 'Full-time', exp: '1+ years',  qualif: 'D.Pharm / B.Pharm' },
];

export default function Careers() {
  return (
    <>
      <PageHeader
        title="Careers at N Care"
        subtitle="Join a team that puts patients first."
        breadcrumb={[{ label: 'Careers' }]}
      />

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {[
              [<Heart size={26} />,         'Patient-first culture', 'We measure ourselves on patient outcomes — and on how patients feel during their care.'],
              [<GraduationCap size={26} />, 'Learn & grow',          'Continuous learning, conferences, internal training, and mentorship from senior consultants.'],
              [<Briefcase size={26} />,     'Stable & supportive',   'Competitive compensation, paid leave, insurance, and a supportive work environment.'],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{icon}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Current openings</span>
            <h2>Open positions</h2>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {OPENINGS.map((o, i) => (
              <div key={i} className="opening-card">
                <div>
                  <h4>{o.title}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: '.85rem', color: 'var(--text-light)', marginTop: 4 }}>
                    <span><strong>Dept:</strong> {o.dept}</span>
                    <span><strong>Type:</strong> {o.type}</span>
                    <span><strong>Exp:</strong> {o.exp}</span>
                  </div>
                  <p style={{ marginTop: 8, fontSize: '.9rem' }}>{o.qualif}</p>
                </div>
                <a href={`mailto:${HOSPITAL.contact.careersEmail}?subject=${encodeURIComponent('Application — ' + o.title)}`} className="btn btn-primary">
                  Apply
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ background: 'var(--primary-light)', padding: 40, borderRadius: 16, textAlign: 'center' }}>
            <Mail size={40} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
            <h3>Don't see a fit?</h3>
            <p style={{ margin: '8px 0 16px' }}>Send us your CV — we keep promising candidates on file.</p>
            <a href={`mailto:${HOSPITAL.contact.careersEmail}`} className="btn btn-primary">{HOSPITAL.contact.careersEmail}</a>
          </div>
        </div>
      </section>
    </>
  );
}
