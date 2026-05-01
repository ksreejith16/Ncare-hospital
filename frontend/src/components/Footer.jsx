import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { HOSPITAL } from '../data/hospital.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo footer-logo" aria-label={HOSPITAL.name}>
              <img src="/hospital-logo.jpg" alt={HOSPITAL.name} className="logo-img" />
            </Link>
            <p>{HOSPITAL.about}</p>
            <div className="footer-social">
              <a href={HOSPITAL.social.facebook}  aria-label="Facebook"><Facebook size={18} /></a>
              <a href={HOSPITAL.social.instagram} aria-label="Instagram"><Instagram size={18} /></a>
              <a href={HOSPITAL.social.youtube}   aria-label="YouTube"><Youtube size={18} /></a>
              <a href={HOSPITAL.social.linkedin}  aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>

          <div>
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/departments">Departments</Link></li>
              <li><Link to="/doctors">Find a Doctor</Link></li>
              <li><Link to="/book-appointment">Book Appointment</Link></li>
              <li><Link to="/health-checkups">Health Checkups</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h5>Patient Care</h5>
            <ul>
              <li><Link to="/emergency">24×7 Emergency</Link></li>
              <li><Link to="/insurance">Insurance & TPAs</Link></li>
              <li><Link to="/patient-portal">Patient Portal</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/blog">Health Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h5>Get in Touch</h5>
            <div className="footer-contact">
              <div><MapPin size={18} /><span>{HOSPITAL.contact.address}</span></div>
              <div><Phone size={18} /><span><a href={`tel:${HOSPITAL.contact.phoneRaw}`}>{HOSPITAL.contact.phone}</a></span></div>
              <div><Mail size={18} /><span><a href={`mailto:${HOSPITAL.contact.email}`}>{HOSPITAL.contact.email}</a></span></div>
              <div><Clock size={18} /><span>{HOSPITAL.hours.opd}<br />{HOSPITAL.hours.emergency}</span></div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} {HOSPITAL.name}. All rights reserved.</div>
          <div>
            <Link to="/privacy-policy">Privacy Policy</Link> &nbsp;·&nbsp;
            <Link to="/terms">Terms</Link> &nbsp;·&nbsp;
            <Link to="/contact">Feedback</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
