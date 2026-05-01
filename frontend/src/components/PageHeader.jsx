import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Compact breadcrumb strip — no big banner, content shows immediately.
// `title` is rendered as a visually-hidden h1 for SEO / accessibility.
export default function PageHeader({ title, breadcrumb = [] }) {
  return (
    <>
      {title && <h1 className="visually-hidden">{title}</h1>}
      <div className="breadcrumb-bar">
        <div className="container">
          <nav aria-label="Breadcrumb" className="breadcrumb-trail">
            <Link to="/">Home</Link>
            {breadcrumb.map((b, i) => (
              <span key={i} className="breadcrumb-segment">
                <ChevronRight size={14} aria-hidden="true" />
                {b.to ? <Link to={b.to}>{b.label}</Link> : <span>{b.label}</span>}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
