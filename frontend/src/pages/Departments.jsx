import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { HOSPITAL } from '../data/hospital.js';

export default function Departments() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [hash]);

  return (
    <>
      <PageHeader title="Our Departments" breadcrumb={[{ label: 'Departments' }]} />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Specialties</span>
            <h2>Comprehensive care across 12 specialties</h2>
            <p>From routine consultations to specialized procedures — find the right team for your concern.</p>
          </div>
          <div className="grid-3">
            {HOSPITAL.departments.map(d => (
              <a key={d.slug} href={`#${d.slug}`} className="dept-card">
                <div className="dept-icon">{d.icon}</div>
                <h4>{d.name}</h4>
                <p>{d.desc}</p>
                <span className="arrow">Read more <ArrowRight size={14} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {HOSPITAL.departments.map(d => {
            const docs = HOSPITAL.doctors.filter(doc => doc.department === d.slug);
            return (
              <div key={d.slug} id={d.slug} className="dept-detail">
                <div className="dept-detail-head">
                  <div className="dept-icon" style={{ marginBottom: 0 }}>{d.icon}</div>
                  <h2 style={{ margin: 0 }}>{d.name}</h2>
                </div>
                <p style={{ fontSize: '1.05rem' }}>{d.desc}</p>

                {docs.length > 0 ? (
                  <div style={{ marginTop: 20 }}>
                    <strong style={{ fontSize: '.9rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Specialists</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
                      {docs.map(doc => (
                        <Link
                          key={doc.slug}
                          to={`/book-appointment?dept=${d.slug}&doctor=${doc.slug}`}
                          style={{
                            padding: '10px 16px', background: 'var(--primary-light)', color: 'var(--primary-dark)',
                            borderRadius: 100, fontSize: '.88rem', fontWeight: 600,
                          }}
                        >
                          {doc.name} <span style={{ opacity: .7, fontWeight: 400 }}>— {doc.specialty}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ marginTop: 16, color: 'var(--text-light)', fontSize: '.9rem' }}>
                    <em>Visiting consultants available — please call {HOSPITAL.contact.phone} to schedule.</em>
                  </p>
                )}

                <div style={{ marginTop: 24 }}>
                  <Link to={`/book-appointment?dept=${d.slug}`} className="btn btn-primary">
                    Book Appointment <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Not sure which department to choose?</h2>
            <p>Tell us your concern — our front-desk team will guide you to the right specialist.</p>
            <div className="btn-group">
              <Link to="/book-appointment" className="btn btn-white btn-lg">Book Appointment</Link>
              <Link to="/contact" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>Talk to us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
