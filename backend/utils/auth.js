import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-only-not-for-production';

export function sign(payload, ttlSec = 600) {
  return jwt.sign(payload, SECRET, { expiresIn: ttlSec });
}

export function verify(token) {
  try { return jwt.verify(token, SECRET); }
  catch { return null; }
}

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null;
  const p = t && verify(t);
  if (!p || !p.mobile) return res.status(401).json({ message: 'Unauthorized' });
  req.session = p;
  next();
}
