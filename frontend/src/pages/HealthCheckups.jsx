import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Award, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { HOSPITAL } from '../data/hospital.js';

export default function HealthCheckups() {
  return (
    <>
      <PageHeader
        title="Health Checkup Packages"
        subtitle="Catch issues early with curated preventive care packages."
        breadcrumb={[{ label: 'Health Checkups' }]}
      />

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {HOSPITAL.packages.map((p, i) => (
              <div key={i} className={`pkg-card ${p.featured ? 'featured' : ''}`}>
                <h4>{p.name}</h4>
                <div className="price">₹{p.price.toLocaleString('en-IN')} <small>₹{p.mrp.toLocaleString('en-IN')}</small></div>
                <ul>{p.tests.map((t, j) => <li key={j}>{t}</li>)}</ul>
                <Link to={`/book-appointment?dept=general-medicine&package=${encodeURIComponent(p.name)}`} className="btn btn-primary btn-block btn-sm">
                  Book Package
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why us</span>
            <h2>Why choose our health checkups?</h2>
          </div>
          <div className="grid-4">
            {[
              [<ShieldCheck size={26} />, 'NABH Lab',          'Quality-assured pathology and diagnostics, in-house.'],
              [<Award size={26} />,       'Specialist Reading','Reports interpreted by experienced physicians, not just printed.'],
              [<Clock size={26} />,       'Same-day Reports',  'Most blood and imaging reports ready before you leave.'],
              [<CheckCircle2 size={26} />,'No Hidden Charges', 'Package price is final — no surprise add-ons.'],
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
          <div className="cta-banner">
            <h2>Need a custom checkup?</h2>
            <p>Looking for tests not in these packages? Talk to us — we'll build the right plan for you.</p>
            <div className="btn-group">
              <Link to="/contact" className="btn btn-white btn-lg">Get in touch</Link>
              <a href={`tel:${HOSPITAL.contact.phoneRaw}`} className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>{HOSPITAL.contact.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
