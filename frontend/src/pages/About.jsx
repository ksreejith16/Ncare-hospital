import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

export default function About() {
  return (
    <>
      <PageHeader title="About N Care Hospital" breadcrumb={[{ label: 'About' }]} />

      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center', gap: 64 }}>
          <div>
            <span className="eyebrow">Our Story</span>
            <h2>Built for the community we serve.</h2>
            <p style={{ fontSize: '1.05rem', margin: '16px 0' }}>
              N Care Hospital was established to bring metro-grade healthcare to the western corridor of Hyderabad.
              Patients living around Beeramguda, R.C. Puram, Patancheru and the surrounding suburbs once had to travel
              long distances for specialist care. We changed that.
            </p>
            <p>
              Today we are a 50-bed NABH-accredited multi-specialty facility delivering trusted care across 12 specialties —
              from routine consultations to complex orthopedic, gynecological and cardiac procedures.
            </p>
          </div>
          <div>
            <div style={{
              aspectRatio: '4/3', borderRadius: 24,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}>
              <img
                src="/images/facility/exterior.png"
                alt="N Care Hospital building"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h4>Our Mission</h4>
              <p>To provide affordable, trustworthy and professional healthcare to patients and our community — without compromise on quality or compassion.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👁️</div>
              <h4>Our Vision</h4>
              <p>To be the most trusted neighborhood multi-specialty hospital in west Hyderabad, known for clinical excellence and patient-first care.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h4>Our Values</h4>
              <p>Empathy, integrity, transparency and continuous learning. Every team member, every shift, every patient.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Infrastructure</span>
            <h2>Modern facility, sterile spaces, reliable diagnostics.</h2>
          </div>
          <div className="grid-3">
            {[
              ['🛏️', '50 Inpatient Beds', 'Private, semi-private and shared rooms with dedicated nursing care.'],
              ['🧑‍⚕️', 'ICU & SICU', 'Critical care unit and surgical ICU with 24×7 intensivist coverage.'],
              ['🏥', '2 Modular OTs', 'Operation theatres with laminar airflow for sterile surgical environments.'],
              ['🔬', 'Sophisticated Lab', 'In-house pathology and diagnostics with quick turnaround on critical reports.'],
              ['📷', 'Digital X-Ray', 'High-resolution digital imaging for accurate diagnosis.'],
              ['💊', '24×7 Pharmacy', 'In-house pharmacy stocking essential and specialty medications.'],
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

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Inside the hospital</span>
            <h2>Take a look around</h2>
            <p>Modern, calm, and clinically clean — built around patient comfort.</p>
          </div>
          <div className="gallery-grid">
            {[
              ['/images/facility/reception.png',     'Reception & Lobby'],
              ['/images/facility/clinic-room.png',   'Consultation Room'],
              ['/images/facility/doctor-cabin.png',  "Doctor's Cabin"],
              ['/images/facility/general-ward.png',  'General Ward'],
              ['/images/facility/patient-room.png',  'Patient Rooms'],
              ['/images/facility/exterior.png',      'Hospital Exterior'],
            ].map(([src, caption], i) => (
              <figure key={i} className="gallery-item">
                <img src={src} alt={caption} loading="lazy" />
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="stats-row">
            <div className="stat"><strong>50</strong><span>Inpatient Beds</span></div>
            <div className="stat"><strong>12</strong><span>Specialties</span></div>
            <div className="stat"><strong>10+</strong><span>Years of Service</span></div>
            <div className="stat"><strong>50K+</strong><span>Patients Cared For</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Visit us, anytime.</h2>
            <p>Walk in for an OPD consultation or book online with OTP verification — we'll handle the rest.</p>
            <div className="btn-group">
              <Link to="/book-appointment" className="btn btn-white btn-lg">Book Appointment</Link>
              <Link to="/contact" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>Get Directions</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
