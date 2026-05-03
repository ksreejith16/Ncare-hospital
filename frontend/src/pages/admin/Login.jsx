import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, LogIn } from 'lucide-react';
import { adminApi, adminAuth } from '../../lib/admin.js';
import { toast } from '../../components/Toast.jsx';
import { HOSPITAL } from '../../data/hospital.js';

export default function AdminLogin() {
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (adminAuth.isLoggedIn()) nav('/admin', { replace: true });
  }, [nav]);

  async function submit(e) {
    e.preventDefault();
    if (!username || !password) return toast('Username and password required', 'error');
    setBusy(true);
    try {
      const res = await adminApi.login(username, password);
      adminAuth.set(res.token, res.name);
      toast(`Welcome, ${res.name}`);
      nav('/admin', { replace: true });
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-h) - var(--topbar-h))',
      display: 'grid', placeItems: 'center', padding: '40px 16px',
      background: 'linear-gradient(135deg, var(--bg-soft) 0%, var(--primary-light) 100%)',
    }}>
      <div style={{
        background: '#fff',
        padding: 40,
        borderRadius: 20,
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: 420,
      }}>
        <div style={{
          width: 56, height: 56,
          borderRadius: 14,
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          color: '#fff',
          display: 'grid', placeItems: 'center',
          margin: '0 auto 20px',
        }}>
          <ShieldCheck size={28} />
        </div>

        <h1 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: 8 }}>Staff Login</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: 28 }}>
          {HOSPITAL.name} — Admin Dashboard
        </p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : <><LogIn size={18} /> Sign in</>}
          </button>
        </form>

        <div className="alert alert-info" style={{ marginTop: 24, fontSize: '.82rem' }}>
          <Lock size={16} />
          <div>This area is for hospital staff only. All actions are logged.</div>
        </div>
      </div>
    </div>
  );
}
