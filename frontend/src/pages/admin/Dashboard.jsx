import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Inbox, Clock, CheckCircle2, LogOut, Search, RefreshCw,
  X, Phone, Mail, MessageSquare,
} from 'lucide-react';
import { adminApi, adminAuth } from '../../lib/admin.js';
import { toast } from '../../components/Toast.jsx';
import { HOSPITAL } from '../../data/hospital.js';

const STATUS_LABELS = {
  pending:   { label: 'Pending',   color: '#92400e', bg: '#fef3c7' },
  confirmed: { label: 'Confirmed', color: '#065f46', bg: '#d1fae5' },
  completed: { label: 'Completed', color: '#1e40af', bg: '#dbeafe' },
  cancelled: { label: 'Cancelled', color: '#991b1b', bg: '#fee2e2' },
  'no-show': { label: 'No-show',   color: '#475569', bg: '#e2e8f0' },
};

export default function AdminDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState('appointments');
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', date: '', q: '' });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [contactItems, setContactItems] = useState([]);
  const [contactPage, setContactPage] = useState(1);
  const [contactFilter, setContactFilter] = useState({ read: '', q: '' });

  // -------- Auth gate --------
  useEffect(() => {
    if (!adminAuth.isLoggedIn()) nav('/admin/login', { replace: true });
  }, [nav]);

  // -------- Stats --------
  const loadStats = useCallback(async () => {
    try { setStats(await adminApi.stats()); }
    catch (err) { toast(err.message, 'error'); }
  }, []);

  // -------- Appointments list --------
  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.listAppointments({ ...filters, page, limit: 20 });
      setItems(res.items);
      setTotal(res.total);
    } catch (err) {
      toast(err.message, 'error');
      if (err.message.includes('Session')) nav('/admin/login', { replace: true });
    } finally { setLoading(false); }
  }, [filters, page, nav]);

  // -------- Contacts list --------
  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.listContacts({ ...contactFilter, page: contactPage, limit: 20 });
      setContactItems(res.items);
    } catch (err) {
      toast(err.message, 'error');
    } finally { setLoading(false); }
  }, [contactFilter, contactPage]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { if (tab === 'appointments') loadAppointments(); }, [tab, loadAppointments]);
  useEffect(() => { if (tab === 'contacts') loadContacts(); }, [tab, loadContacts]);

  // -------- Status update --------
  async function updateStatus(id, status) {
    try {
      const updated = await adminApi.updateAppointment(id, { status });
      toast(`Marked as ${status}`);
      setItems(items.map(i => (i.bookingId === updated.bookingId ? updated : i)));
      if (selected) setSelected(updated);
      loadStats();
    } catch (err) { toast(err.message, 'error'); }
  }
  async function saveAdminNotes(id, adminNotes) {
    try {
      const updated = await adminApi.updateAppointment(id, { adminNotes, notify: false });
      toast('Notes saved');
      setItems(items.map(i => (i.bookingId === updated.bookingId ? updated : i)));
      setSelected(updated);
    } catch (err) { toast(err.message, 'error'); }
  }
  async function markContactRead(id, read) {
    try {
      const updated = await adminApi.markContactRead(id, read);
      setContactItems(contactItems.map(c => (c._id === updated._id ? updated : c)));
      loadStats();
    } catch (err) { toast(err.message, 'error'); }
  }

  function logout() { adminAuth.clear(); nav('/admin/login', { replace: true }); }

  return (
    <div className="admin-shell">
      {/* TOPBAR */}
      <header className="admin-topbar">
        <div>
          <strong style={{ fontSize: '1.05rem' }}>{HOSPITAL.name} — Admin</strong>
          <div style={{ fontSize: '.78rem', color: 'var(--text-light)' }}>Welcome, {adminAuth.name || 'Staff'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm btn-outline" onClick={() => { loadStats(); tab === 'appointments' ? loadAppointments() : loadContacts(); }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-sm btn-emergency" onClick={logout}><LogOut size={14} /> Sign out</button>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="admin-stats">
        <StatCard icon={<Calendar size={22} />}    label="Today's bookings" value={stats?.today ?? '–'} accent="var(--primary)" />
        <StatCard icon={<Clock size={22} />}        label="Pending review"   value={stats?.pending ?? '–'} accent="#f59e0b" />
        <StatCard icon={<CheckCircle2 size={22} />} label="Confirmed"        value={stats?.confirmed ?? '–'} accent="#10b981" />
        <StatCard icon={<Inbox size={22} />}        label="Total bookings"   value={stats?.total ?? '–'} accent="#6366f1" />
        <StatCard icon={<MessageSquare size={22} />} label="Unread messages" value={stats?.contactsUnread ?? '–'} accent="var(--emergency)" />
      </div>

      {/* TABS */}
      <div className="admin-tabs">
        <button className={tab === 'appointments' ? 'active' : ''} onClick={() => setTab('appointments')}>
          Appointments ({stats?.total ?? '…'})
        </button>
        <button className={tab === 'contacts' ? 'active' : ''} onClick={() => setTab('contacts')}>
          Contact Messages ({stats?.contactsUnread ?? '…'} unread)
        </button>
      </div>

      {/* APPOINTMENTS TAB */}
      {tab === 'appointments' && (
        <>
          <div className="admin-filters">
            <div className="admin-search">
              <Search size={16} />
              <input
                placeholder="Search name, mobile, booking ID…"
                value={filters.q}
                onChange={e => { setFilters({ ...filters, q: e.target.value }); setPage(1); }}
              />
            </div>
            <select value={filters.status} onChange={e => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}>
              <option value="">All statuses</option>
              {Object.keys(STATUS_LABELS).map(s => <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
            </select>
            <input type="date" value={filters.date} onChange={e => { setFilters({ ...filters, date: e.target.value }); setPage(1); }} />
            <button className="btn btn-sm btn-outline" onClick={() => { setFilters({ status: '', date: '', q: '' }); setPage(1); }}>Clear</button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Patient</th>
                  <th>Mobile</th>
                  <th>Department</th>
                  <th>Doctor</th>
                  <th>Slot</th>
                  <th>Status</th>
                  <th>Booked</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: 32, color: 'var(--text-light)' }}>Loading…</td></tr> :
                  items.length === 0 ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: 32, color: 'var(--text-light)' }}>No bookings match these filters.</td></tr> :
                  items.map(a => (
                    <tr key={a.bookingId} onClick={() => setSelected(a)}>
                      <td><strong style={{ color: 'var(--primary)' }}>{a.bookingId}</strong></td>
                      <td>{a.name} <span style={{ color: 'var(--text-light)' }}>({a.age}{a.gender ? ', ' + a.gender[0] : ''})</span></td>
                      <td><a href={`tel:+91${a.mobile}`} onClick={e => e.stopPropagation()}>+91 {a.mobile}</a></td>
                      <td style={{ textTransform: 'capitalize' }}>{a.department.replace(/-/g, ' ')}</td>
                      <td>{a.doctor ? a.doctor.replace(/^dr-/, 'Dr. ').replace(/-/g, ' ') : <em style={{ color: 'var(--text-light)' }}>any</em>}</td>
                      <td>{a.date}<br /><small style={{ color: 'var(--text-light)' }}>{a.time}</small></td>
                      <td><StatusPill status={a.status} /></td>
                      <td><small style={{ color: 'var(--text-light)' }}>{new Date(a.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</small></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} setPage={setPage} total={total} limit={20} />
        </>
      )}

      {/* CONTACTS TAB */}
      {tab === 'contacts' && (
        <>
          <div className="admin-filters">
            <div className="admin-search">
              <Search size={16} />
              <input placeholder="Search name, mobile, message…" value={contactFilter.q} onChange={e => { setContactFilter({ ...contactFilter, q: e.target.value }); setContactPage(1); }} />
            </div>
            <select value={contactFilter.read} onChange={e => { setContactFilter({ ...contactFilter, read: e.target.value }); setContactPage(1); }}>
              <option value="">All</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
          </div>

          <div className="admin-contact-list">
            {loading ? <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-light)' }}>Loading…</div> :
              contactItems.length === 0 ? <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-light)' }}>No messages.</div> :
              contactItems.map(c => (
                <div key={c._id} className={`contact-card ${c.read ? '' : 'unread'}`}>
                  <div className="contact-head">
                    <div>
                      <strong>{c.name}</strong>
                      <small style={{ color: 'var(--text-light)', marginLeft: 8 }}>
                        {new Date(c.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </small>
                      {!c.read && <span className="unread-dot" />}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a href={`tel:+91${c.mobile}`} className="btn btn-sm btn-outline"><Phone size={12} /> Call</a>
                      {c.email && <a href={`mailto:${c.email}`} className="btn btn-sm btn-outline"><Mail size={12} /> Email</a>}
                      <button className="btn btn-sm btn-outline" onClick={() => markContactRead(c._id, !c.read)}>
                        {c.read ? 'Mark unread' : 'Mark read'}
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '.85rem', color: 'var(--text-light)', marginTop: 4 }}>
                    +91 {c.mobile}{c.email && ' · ' + c.email}{c.subject && ' · ' + c.subject}
                  </div>
                  <p style={{ marginTop: 8, fontSize: '.92rem' }}>{c.message}</p>
                </div>
              ))}
          </div>
        </>
      )}

      {/* DETAIL DRAWER */}
      {selected && (
        <BookingDrawer
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(s) => updateStatus(selected.bookingId, s)}
          onSaveNotes={(n) => saveAdminNotes(selected.bookingId, n)}
        />
      )}
    </div>
  );
}

// --------- Sub-components ---------
function StatCard({ icon, label, value, accent }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon" style={{ background: accent }}>{icon}</div>
      <div>
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-label">{label}</div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const s = STATUS_LABELS[status] || { label: status, color: 'var(--text)', bg: 'var(--bg-muted)' };
  return <span className="status-pill" style={{ background: s.bg, color: s.color }}>{s.label}</span>;
}

function Pagination({ page, setPage, total, limit }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="admin-pagination">
      <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
      <span>Page {page} of {pages} · {total} total</span>
      <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
    </div>
  );
}

function BookingDrawer({ booking, onClose, onStatusChange, onSaveNotes }) {
  const [notes, setNotes] = useState(booking.adminNotes || '');
  useEffect(() => { setNotes(booking.adminNotes || ''); }, [booking]);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{booking.bookingId}</strong>
            <div style={{ fontSize: '.85rem', color: 'var(--text-light)' }}>
              Created {new Date(booking.createdAt).toLocaleString('en-IN')}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-outline" aria-label="Close"><X size={16} /></button>
        </header>

        <div style={{ marginBottom: 16 }}><StatusPill status={booking.status} /></div>

        <h4 style={{ fontSize: '.78rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '.05em', margin: '20px 0 8px' }}>Patient</h4>
        <table className="drawer-table">
          <tbody>
            <tr><td>Name</td><td><strong>{booking.name}</strong></td></tr>
            <tr><td>Age / Gender</td><td>{booking.age} · {booking.gender}</td></tr>
            <tr><td>Mobile</td><td><a href={`tel:+91${booking.mobile}`}>+91 {booking.mobile}</a></td></tr>
            <tr><td>Email</td><td>{booking.email ? <a href={`mailto:${booking.email}`}>{booking.email}</a> : '—'}</td></tr>
          </tbody>
        </table>

        <h4 style={{ fontSize: '.78rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '.05em', margin: '20px 0 8px' }}>Appointment</h4>
        <table className="drawer-table">
          <tbody>
            <tr><td>Department</td><td style={{ textTransform: 'capitalize' }}>{booking.department.replace(/-/g, ' ')}</td></tr>
            <tr><td>Doctor</td><td>{booking.doctor ? booking.doctor.replace(/^dr-/, 'Dr. ').replace(/-/g, ' ') : <em>any</em>}</td></tr>
            <tr><td>Date</td><td><strong>{booking.date}</strong></td></tr>
            <tr><td>Time</td><td><strong>{booking.time}</strong></td></tr>
            {booking.notes && <tr><td>Patient notes</td><td>{booking.notes}</td></tr>}
          </tbody>
        </table>

        <h4 style={{ fontSize: '.78rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '.05em', margin: '20px 0 8px' }}>Update status</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {Object.keys(STATUS_LABELS).map(s => (
            <button
              key={s}
              className="btn btn-sm"
              style={{
                background: booking.status === s ? STATUS_LABELS[s].bg : '#fff',
                color: STATUS_LABELS[s].color,
                border: `1.5px solid ${booking.status === s ? STATUS_LABELS[s].color : 'var(--border)'}`,
              }}
              onClick={() => onStatusChange(s)}
              disabled={booking.status === s}
            >
              {STATUS_LABELS[s].label}
            </button>
          ))}
        </div>

        <h4 style={{ fontSize: '.78rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '.05em', margin: '20px 0 8px' }}>Internal notes (staff only)</h4>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add a note for the team — patient won't see this." style={{ minHeight: 100 }} />
        <button className="btn btn-primary btn-block btn-sm" style={{ marginTop: 8 }} onClick={() => onSaveNotes(notes)}>Save notes</button>
      </aside>
    </>
  );
}
