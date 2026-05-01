import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = doctor.name.replace('Dr. ', '').split(' ').map(n => n[0]).slice(0, 2).join('');
  const showImage = doctor.image && !imgFailed;

  return (
    <div className="doc-card">
      <div className="doc-img">
        {showImage ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="doc-initials">{initials}</span>
        )}
      </div>
      <div className="doc-info">
        <h4>{doctor.name}</h4>
        <div className="specialty">{doctor.specialty}</div>
        <div className="doc-meta"><span className="qualif">{doctor.qualifications}</span></div>
        <div className="doc-meta">
          <span><Briefcase size={12} /> {doctor.experience}+ yrs</span>
          <span><Clock size={12} /> {doctor.timings}</span>
        </div>
        <div className="doc-fee">
          <span style={{ fontSize: '.8rem', color: 'var(--text-light)' }}>Consultation</span>
          <strong>₹{doctor.fee}</strong>
        </div>
        <Link
          to={`/book-appointment?doctor=${doctor.slug}&dept=${doctor.department}`}
          className="btn btn-primary btn-block btn-sm"
          style={{ marginTop: 12 }}
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
