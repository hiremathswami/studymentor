/**
 * @file src/middleware/auth.js
 * @description Authentication middleware to verify Supabase JWT.
 */

const supabase = require('../lib/supabase');

/**
 * Verify JWT via supabase.auth.getUser
 */
async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: 'Invalid or expired token' });

    req.user = data.user;
    next();
  } catch (err) {
    console.error(`[Auth Middleware] ${err.message}`);
    res.status(500).json({ error: 'Auth check failed' });
  }
}

module.exports = requireAuth;
