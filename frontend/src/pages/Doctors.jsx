import { useState, useMemo } from 'react';
import { Stethoscope, Award, Users, Phone } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import DoctorCard from '../components/DoctorCard.jsx';
import { HOSPITAL } from '../data/hospital.js';

export default function Doctors() {
  const [activeDept, setActiveDept] = useState('all');

  const filtered = useMemo(() =>
    activeDept === 'all'
      ? HOSPITAL.doctors
      : HOSPITAL.doctors.filter(d => d.department === activeDept),
    [activeDept]
  );

  const deptCounts = useMemo(() => {
    const counts = {};
    HOSPITAL.doctors.forEach(d => { counts[d.department] = (counts[d.department] || 0) + 1; });
    return counts;
  }, []);

  const deptsWithDocs = HOSPITAL.departments.filter(d => deptCounts[d.slug]);

  const avgExp = Math.round(
    HOSPITAL.doctors.reduce((s, d) => s + d.experience, 0) / HOSPITAL.doctors.length
  );

  return (
    <>
      <PageHeader title="Our Doctors" breadcrumb={[{ label: 'Doctors' }]} />

      {/* Hero intro */}
      <section className="section" style={{ paddingBottom: 32 }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
            <span className="eyebrow">Meet our team</span>
            <h2 style={{ marginBottom: 12 }}>Eminent specialists. Personalised care.</h2>
            <p>Our consultants bring together decades of experience across {HOSPITAL.departments.length} specialties — backed by modern infrastructure and a patient-first approach.</p>
          </div>

          {/* Stats */}
          <div className="doc-stats">
            {[
              [<Users size={24} />,       `${HOSPITAL.doctors.length}+`, 'Specialists on panel'],
              [<Stethoscope size={24} />, HOSPITAL.departments.length,    'Departments'],
              [<Award size={24} />,       `${avgExp}+ yrs`,               'Average experience'],
            ].map(([icon, value, label], i) => (
              <div key={i} className="doc-stat-card">
                <div className="doc-stat-icon">{icon}</div>
                <div>
                  <div className="doc-stat-value">{value}</div>
                  <div className="doc-stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department filter pills */}
      <section className="filter-strip">
        <div className="container">
          <div className="filter-pills">
            <button
              onClick={() => setActiveDept('all')}
              className={`filter-pill ${activeDept === 'all' ? 'active' : ''}`}
            >
              All Doctors
              <span className="count">{HOSPITAL.doctors.length}</span>
            </button>
            {deptsWithDocs.map(d => (
              <button
                key={d.slug}
                onClick={() => setActiveDept(d.slug)}
                className={`filter-pill ${activeDept === d.slug ? 'active' : ''}`}
              >
                <span className="filter-pill-icon">{d.icon}</span>
                {d.name}
                <span className="count">{deptCounts[d.slug]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors grid */}
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-light)' }}>
              <p>No doctors in this department yet. Visiting consultants available — please call us.</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(d => <DoctorCard key={d.slug} doctor={d} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section section-soft">
        <div className="container">
          <div className="cta-banner">
            <h2>Don't see your specialist?</h2>
            <p>We have visiting consultants across {HOSPITAL.departments.length} specialties. Call us and we'll find the right doctor for you.</p>
            <div className="btn-group">
              <a href={`tel:${HOSPITAL.contact.phoneRaw}`} className="btn btn-white btn-lg">
                <Phone size={18} /> {HOSPITAL.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
