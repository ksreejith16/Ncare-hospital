import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  MapPin, Clock, Phone, PhoneCall, CalendarPlus, Menu, X,
} from 'lucide-react';
import { HOSPITAL } from '../data/hospital.js';

// Desktop navbar — kept tight.
const NAV = [
  { to: '/',            label: 'Home' },
  { to: '/departments', label: 'Departments' },
  { to: '/doctors',     label: 'Doctors' },
  { to: '/services',    label: 'Services' },
  { to: '/gallery',     label: 'Gallery' },
  { to: '/contact',     label: 'Contact' },
];

// Mobile drawer — broader, since the off-canvas menu has room.
const MOBILE_NAV = [
  { to: '/',                label: 'Home' },
  { to: '/about',           label: 'About' },
  { to: '/departments',     label: 'Departments' },
  { to: '/doctors',         label: 'Doctors' },
  { to: '/services',        label: 'Services' },
  { to: '/gallery',         label: 'Gallery' },
  { to: '/health-checkups', label: 'Health Checkups' },
  { to: '/insurance',       label: 'Insurance' },
  { to: '/contact',         label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <div className="topbar">
        <div className="marquee" aria-label="Hospital information">
          <div className="marquee-track">
            {[0, 1].map(k => (
              <div className="marquee-group" key={k} aria-hidden={k === 1}>
                <span className="marquee-item">
                  <MapPin size={14} /> {HOSPITAL.contact.addressShort}
                </span>
                <span className="marquee-dot" />
                <span className="marquee-item">
                  <Clock size={14} /> {HOSPITAL.hours.opd}
                </span>
                <span className="marquee-dot" />
                <span className="marquee-item">
                  <Phone size={14} /> Emergency:{' '}
                  <a href={`tel:${HOSPITAL.contact.emergencyRaw}`}>
                    <strong>{HOSPITAL.contact.emergency}</strong>
                  </a>
                </span>
                <span className="marquee-dot" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="logo" aria-label={HOSPITAL.name}>
            <img src="/hospital-logo.jpg" alt={HOSPITAL.name} className="logo-img" />
          </Link>

          <nav className="nav" aria-label="Primary">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-cta">
            <a href={`tel:${HOSPITAL.contact.emergencyRaw}`} className="btn btn-emergency btn-sm" aria-label="Call emergency">
              <PhoneCall size={16} /> Emergency
            </a>
            <Link to="/book-appointment" className="btn btn-primary btn-sm">
              <CalendarPlus size={16} /> Book Appointment
            </Link>
            <button className="menu-toggle" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`mobile-menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <button className="close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
        <Link to="/" className="logo" onClick={() => setOpen(false)} aria-label={HOSPITAL.name}>
          <img src="/hospital-logo.jpg" alt={HOSPITAL.name} className="logo-img" />
        </Link>
        <nav>
          {MOBILE_NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/book-appointment" onClick={() => setOpen(false)} className="btn btn-primary btn-block">Book Appointment</Link>
        <a href={`tel:${HOSPITAL.contact.emergencyRaw}`} className="btn btn-emergency btn-block">
          <PhoneCall size={16} /> Call Emergency
        </a>
      </aside>
    </>
  );
}
