import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, ClipboardList, MessageCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { HOSPITAL } from '../data/hospital.js';

export default function Insurance() {
  return (
    <>
      <PageHeader
        title="Insurance & Cashless Treatment"
        subtitle="We're empanelled with leading insurance companies and TPAs for cashless inpatient care."
        breadcrumb={[{ label: 'Insurance' }]}
      />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Cashless network</span>
            <h2>Our insurance partners</h2>
            <p>Show your card at admission — no upfront payment for covered procedures, subject to TPA approval.</p>
          </div>
          <div className="grid-4">
            {HOSPITAL.insurance.map(i => (
              <div key={i} style={{
                background: '#fff', padding: 20, borderRadius: 12, border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <ShieldCheck size={20} color="var(--accent-dark)" />
                <span style={{ fontSize: '.92rem', fontWeight: 500 }}>{i}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 24, fontSize: '.88rem', color: 'var(--text-light)', textAlign: 'center' }}>
            * The list is updated periodically. For the current empanelment status of your insurer, please call us at{' '}
            <a href={`tel:${HOSPITAL.contact.phoneRaw}`}>{HOSPITAL.contact.phone}</a>.
          </p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Cashless admission in 4 steps</h2>
          </div>
          <div className="grid-4">
            {[
              [<FileText size={26} />,      'Bring documents',       'Insurance card, valid photo ID, doctor referral (if planned), and prior reports.'],
              [<ClipboardList size={26} />, 'Pre-authorization',     'Our TPA desk submits the cashless request to your insurer with treatment details.'],
              [<ShieldCheck size={26} />,   'Approval',              'Insurer reviews and approves the cashless amount (planned: 24–48h, emergency: 6h).'],
              [<MessageCircle size={26} />, 'Treatment & discharge', 'Get treated. Pay only for non-covered items. We settle the rest with the insurer.'],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>{icon}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, border: '1px solid var(--border)' }}>
            <h3>Aarogyasri & Government Schemes</h3>
            <p style={{ marginTop: 8, marginBottom: 16 }}>
              We accept eligible patients under the Telangana State Aarogyasri scheme and other government healthcare programs.
              Bring your scheme card at the time of admission. Our TPA desk handles the paperwork.
            </p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 8, marginBottom: 16 }}>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><ShieldCheck size={18} color="var(--accent)" /> Aarogyasri (Telangana) — confirm coverage at the desk</li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><ShieldCheck size={18} color="var(--accent)" /> CGHS / ECHS empanelment for central government employees</li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><ShieldCheck size={18} color="var(--accent)" /> Corporate tie-ups available — contact our HR liaison</li>
            </ul>
            <Link to="/contact" className="btn btn-primary">Talk to our TPA desk</Link>
          </div>
        </div>
      </section>
    </>
  );
}
