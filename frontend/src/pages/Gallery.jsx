import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';

const PHOTOS = [
  { src: '/images/facility/exterior.png',     caption: 'Hospital Exterior' },
  { src: '/images/facility/reception.png',    caption: 'Reception & Lobby' },
  { src: '/images/facility/clinic-room.png',  caption: 'Consultation Room' },
  { src: '/images/facility/doctor-cabin.png', caption: "Doctor's Cabin" },
  { src: '/images/facility/general-ward.png', caption: 'General Ward' },
  { src: '/images/facility/patient-room.png', caption: 'Patient Rooms' },
];

export default function Gallery() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape')     setActive(null);
      if (e.key === 'ArrowRight') setActive(i => (i + 1) % PHOTOS.length);
      if (e.key === 'ArrowLeft')  setActive(i => (i - 1 + PHOTOS.length) % PHOTOS.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <>
      <PageHeader title="Photo Gallery" breadcrumb={[{ label: 'Gallery' }]} />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Inside the hospital</span>
            <h2>Take a look around</h2>
            <p>Modern, calm and clinically clean — built around patient comfort. Click any photo to enlarge.</p>
          </div>

          <div className="gallery-grid">
            {PHOTOS.map((p, i) => (
              <button key={i} className="gallery-item" onClick={() => setActive(i)} aria-label={`Enlarge ${p.caption}`}>
                <img src={p.src} alt={p.caption} loading="lazy" />
                <figcaption>{p.caption}</figcaption>
              </button>
            ))}
          </div>
        </div>
      </section>

      {active !== null && (
        <div className="lightbox" onClick={() => setActive(null)} role="dialog" aria-label="Photo viewer">
          <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); setActive(null); }} aria-label="Close">
            <X size={24} />
          </button>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => { e.stopPropagation(); setActive(i => (i - 1 + PHOTOS.length) % PHOTOS.length); }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} />
          </button>
          <figure className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={PHOTOS[active].src} alt={PHOTOS[active].caption} />
            <figcaption>{PHOTOS[active].caption}</figcaption>
          </figure>
          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); setActive(i => (i + 1) % PHOTOS.length); }}
            aria-label="Next photo"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      <section className="section section-soft">
        <div className="container">
          <div className="cta-banner">
            <h2>Want to see for yourself?</h2>
            <p>Walk in for an OPD consultation, or schedule a guided tour with us.</p>
            <div className="btn-group">
              <Link to="/book-appointment" className="btn btn-white btn-lg">Book Appointment</Link>
              <Link to="/contact" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>Get in touch</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
