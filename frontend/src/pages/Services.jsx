import { Link } from 'react-router-dom';
import { Stethoscope, Microscope, Activity, Bed, Pill, Scan, FlaskConical, Syringe } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';

const SERVICES = [
  { icon: <Stethoscope size={26} />, title: 'OPD Consultations',         desc: 'Walk-in or pre-booked consultations with specialists across 12 departments.' },
  { icon: <Bed size={26} />,         title: 'Inpatient Care (50 beds)',  desc: 'Private, semi-private, and shared rooms with dedicated nursing care.' },
  { icon: <Activity size={26} />,    title: 'ICU & SICU',                desc: 'Critical and surgical intensive care with 24×7 intensivist coverage.' },
  { icon: <Syringe size={26} />,     title: 'Surgical Care',             desc: '2 modular OTs with laminar flow — orthopedic, gynec, general, neuro surgeries.' },
  { icon: <Microscope size={26} />,  title: 'Pathology Lab',             desc: 'In-house lab for routine and specialty blood tests with rapid TAT.' },
  { icon: <Scan size={26} />,        title: 'Digital Imaging',           desc: 'Digital X-ray, ultrasound, ECG and 2D Echo on-site.' },
  { icon: <Pill size={26} />,        title: '24×7 Pharmacy',             desc: 'In-house pharmacy stocking essential and specialty medications.' },
  { icon: <FlaskConical size={26} />,title: 'Physiotherapy',             desc: 'Orthopedic, neurological, sports, and home-care physio rehabilitation.' },
];

export default function Services() {
  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Comprehensive medical, surgical, and diagnostic services under one roof."
        breadcrumb={[{ label: 'Services' }]}
      />

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {SERVICES.map((s, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="cta-banner">
            <h2>Looking for a specific service?</h2>
            <p>Browse departments to find the right specialist or talk to our front desk.</p>
            <div className="btn-group">
              <Link to="/departments" className="btn btn-white btn-lg">View Departments</Link>
              <Link to="/contact" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
