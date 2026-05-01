import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BadgeCheck, Clock, ShieldCheck, ArrowRight, CalendarPlus, UserSearch,
  ClipboardCheck, Ambulance, Phone, CheckCircle,
} from 'lucide-react';
import { HOSPITAL } from '../data/hospital.js';
import DoctorCard from '../components/DoctorCard.jsx';

export default function Home() {
  const navigate = useNavigate();
  const [dept, setDept] = useState('');
  const [mobile, setMobile] = useState('');

  function quickSubmit(e) {
    e.preventDefault();
    if (!dept) return;
    const params = new URLSearchParams();
    params.set('dept', dept);
    if (mobile) params.set('mobile', mobile);
    navigate(`/book-appointment?${params.toString()}`);
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-badges">
              <span className="hero-badge"><BadgeCheck size={14} /> NABH Accredited</span>
              <span className="hero-badge"><Clock size={14} /> 24×7 Emergency</span>
              <span className="hero-badge"><ShieldCheck size={14} /> Cashless Insurance</span>
            </div>
            <h1>Compassionate Care.<br />Trusted Expertise.</h1>
            <p>A 50-bed NABH-accredited multi-specialty hospital in Beeramguda — bringing eminent doctors, modern infrastructure and 24×7 emergency services to the heart of R.C. Puram.</p>
            <div className="hero-cta">
              <Link to="/book-appointment" className="btn btn-white btn-lg">
                <CalendarPlus size={18} /> Book Appointment
              </Link>
              <Link to="/doctors" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>
                Find a Doctor
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <h3>Quick Appointment</h3>
            <p>Tell us a bit and we'll get back within 5 minutes during OPD hours.</p>
            <form onSubmit={quickSubmit}>
              <div className="form-group">
                <label>Department</label>
                <select value={dept} onChange={e => setDept(e.target.value)} required>
                  <option value="">Select department</option>
                  {HOSPITAL.departments.map(d => <option key={d.slug} value={d.slug}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" pattern="[6-9]\d{9}"
                  value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} required />
              </div>
              <button className="btn btn-primary btn-block btn-lg" type="submit">
                Continue <ArrowRight size={16} />
              </button>
            </form>
            <div className="hero-stats">
              <div><strong>50</strong><span>Beds</span></div>
              <div><strong>12</strong><span>Specialties</span></div>
              <div><strong>50K+</strong><span>Patients</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <div className="container">
        <div className="quick-actions">
          <Link to="/book-appointment" className="quick-action">
            <div className="quick-action-icon"><CalendarPlus size={26} /></div>
            <h4>Book Appointment</h4>
            <p>OPD consultation in 3 steps</p>
          </Link>
          <Link to="/doctors" className="quick-action accent">
            <div className="quick-action-icon"><UserSearch size={26} /></div>
            <h4>Find a Doctor</h4>
            <p>Browse our specialists</p>
          </Link>
          <Link to="/health-checkups" className="quick-action">
            <div className="quick-action-icon"><ClipboardCheck size={26} /></div>
            <h4>Health Checkups</h4>
            <p>Preventive packages</p>
          </Link>
          <Link to="/emergency" className="quick-action emergency">
            <div className="quick-action-icon"><Ambulance size={26} /></div>
            <h4>Emergency 24×7</h4>
            <p>Immediate trauma care</p>
          </Link>
        </div>
      </div>

      {/* SPECIALTIES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Specialties</span>
            <h2>Comprehensive care across 12 specialties</h2>
            <p>From routine consultations to complex procedures — our specialists are here for every stage of your health journey.</p>
          </div>
          <div className="grid-4">
            {HOSPITAL.departments.map(d => (
              <Link key={d.slug} to={`/departments#${d.slug}`} className="dept-card">
                <div className="dept-icon">{d.icon}</div>
                <h4>{d.name}</h4>
                <p>{d.desc}</p>
                <span className="arrow">Explore <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/departments" className="btn btn-outline">View all departments <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="section section-soft">
        <div className="container grid-2" style={{ alignItems: 'center', gap: 64 }}>
          <div>
            <span className="eyebrow">About Us</span>
            <h2>Care that's close, modern, and affordable.</h2>
            <p style={{ fontSize: '1.05rem', margin: '16px 0' }}>
              N Care Hospital was built to bring metro-grade healthcare to the western corridor of Hyderabad.
              Our 50-bed facility combines a dedicated team of senior consultants, modern operation theatres,
              and round-the-clock emergency services — all within a single campus.
            </p>
            <ul style={{ listStyle: 'none', margin: '24px 0', display: 'grid', gap: 12 }}>
              {[
                ['NABH-aligned protocols', 'ensure your safety at every step.'],
                ['2 Modular OTs', 'with laminar airflow for sterile surgical care.'],
                ['Sophisticated lab + digital X-ray', 'for fast, reliable diagnostics.'],
                ['Cashless coverage', 'with leading insurance partners.'],
              ].map(([head, tail], i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="var(--accent)" />
                  <div><strong>{head}</strong> {tail}</div>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn btn-primary">Learn more about us <ArrowRight size={16} /></Link>
          </div>
          <div>
            <div style={{
              aspectRatio: '4/3', borderRadius: 24,
              boxShadow: 'var(--shadow-lg)',
              position: 'relative', overflow: 'hidden',
            }}>
              <img
                src="/images/facility/exterior.png"
                alt="N Care Hospital exterior"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              <div style={{
                position: 'absolute', bottom: 24, left: 24, right: 24, padding: 20,
                background: 'rgba(255,255,255,.95)', borderRadius: 16, color: 'var(--text)',
                backdropFilter: 'blur(8px)',
              }}>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>10+ Years of Service</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Delivering trusted care to Beeramguda since 2014</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why Choose Us</span>
            <h2>Quality care, every time.</h2>
            <p>What patients across Beeramguda, R.C. Puram, Patancheru and Lingampally consistently appreciate.</p>
          </div>
          <div className="grid-3">
            {HOSPITAL.features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Meet our specialists</span>
            <h2>Eminent doctors. Personalized care.</h2>
          </div>
          <div className="grid-3">
            {HOSPITAL.doctors.slice(0, 3).map(d => <DoctorCard key={d.slug} doctor={d} />)}
          </div>
          <div className="text-center mt-4">
            <Link to="/doctors" className="btn btn-outline">View all doctors <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* HEALTH PACKAGES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Preventive care</span>
            <h2>Health checkup packages</h2>
            <p>Catch issues early. Our packages are curated for every age and lifestyle.</p>
          </div>
          <div className="grid-3">
            {HOSPITAL.packages.slice(0, 3).map((p, i) => (
              <div key={i} className={`pkg-card ${p.featured ? 'featured' : ''}`}>
                <h4>{p.name}</h4>
                <div className="price">₹{p.price.toLocaleString('en-IN')} <small>₹{p.mrp.toLocaleString('en-IN')}</small></div>
                <ul>{p.tests.slice(0, 5).map((t, j) => <li key={j}>{t}</li>)}</ul>
                <Link
                  to={`/book-appointment?dept=general-medicine&package=${encodeURIComponent(p.name)}`}
                  className="btn btn-outline btn-block btn-sm"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Trusted by thousands</span>
            <h2>The numbers behind our care.</h2>
          </div>
          <div className="stats-row">
            <div className="stat"><strong>50</strong><span>Inpatient Beds</span></div>
            <div className="stat"><strong>12</strong><span>Specialties</span></div>
            <div className="stat"><strong>10+</strong><span>Years of Service</span></div>
            <div className="stat"><strong>50K+</strong><span>Patients Cared For</span></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Patient stories</span>
            <h2>What our patients say</h2>
          </div>
          <div className="grid-3">
            {HOSPITAL.testimonials.slice(0, 3).map((t, i) => (
              <div key={i} className="testimonial">
                <div className="stars">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                <p>"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div><strong>{t.name}</strong><br /><small>{t.loc}</small></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSURANCE */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Cashless treatment</span>
            <h2>Insurance partners</h2>
            <p>We are empanelled with leading insurance companies and TPAs for cashless inpatient care.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 900, margin: '0 auto' }}>
            {HOSPITAL.insurance.map(i => (
              <span key={i} style={{
                padding: '10px 18px', background: '#fff', border: '1px solid var(--border)',
                borderRadius: 100, fontSize: '.88rem', color: 'var(--text)',
              }}>{i}</span>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/insurance" className="btn btn-outline">See full list <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Need to see a doctor?</h2>
            <p>Book your appointment online with secure OTP verification. We'll confirm within minutes during OPD hours.</p>
            <div className="btn-group">
              <Link to="/book-appointment" className="btn btn-white btn-lg">Book Online</Link>
              <a href={`tel:${HOSPITAL.contact.phoneRaw}`} className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>
                <Phone size={18} /> {HOSPITAL.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
