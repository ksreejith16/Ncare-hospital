import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { HOSPITAL } from '../data/hospital.js';

export default function Blog() {
  return (
    <>
      <PageHeader
        title="Health Blog"
        subtitle="Articles, tips, and guides from our specialists."
        breadcrumb={[{ label: 'Blog' }]}
      />

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {HOSPITAL.blogPosts.map(p => (
              <article key={p.slug} style={{
                background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)',
                transition: 'all .2s', cursor: 'pointer',
              }}>
                <div style={{
                  aspectRatio: '16/9',
                  background: 'linear-gradient(135deg, var(--primary-light), var(--bg-muted))',
                  display: 'grid', placeItems: 'center', fontSize: '4rem', color: 'var(--primary)',
                }}>📝</div>
                <div style={{ padding: 24 }}>
                  <span className="eyebrow" style={{ marginBottom: 8 }}>{p.category}</span>
                  <h4 style={{ marginBottom: 8 }}>{p.title}</h4>
                  <p style={{ fontSize: '.9rem', marginBottom: 12 }}>{p.excerpt}</p>
                  <small style={{ color: 'var(--text-light)' }}>{new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 48, textAlign: 'center', padding: 32, background: 'var(--bg-soft)', borderRadius: 16 }}>
            <h3>More articles coming soon</h3>
            <p style={{ margin: '8px 0 16px' }}>We publish new health and wellness content every month — bookmark this page or follow us on social.</p>
            <Link to="/" className="btn btn-outline">Back to Home</Link>
          </div>
        </div>
      </section>
    </>
  );
}
