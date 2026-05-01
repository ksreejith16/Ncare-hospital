import { Link } from 'react-router-dom';
import { Home, Phone } from 'lucide-react';
import { HOSPITAL } from '../data/hospital.js';

export default function NotFound() {
  return (
    <section className="section" style={{ padding: '120px 0', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <div style={{
          fontSize: '8rem', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}>404</div>
        <h1>Page not found</h1>
        <p style={{ marginTop: 12, marginBottom: 32 }}>The page you're looking for doesn't exist or has been moved.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary"><Home size={16} /> Back to Home</Link>
          <a href={`tel:${HOSPITAL.contact.phoneRaw}`} className="btn btn-outline"><Phone size={16} /> Call us</a>
        </div>
      </div>
    </section>
  );
}
