/**
 * @file src/routes/auth.js
 * @description Authentication routes (register, login, logout, me).
 */

const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const requireAuth = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Body: { email, password, name }
 */
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Sign up via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // 2. Insert into custom users table
    if (authData.user) {
      await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          name: name || '',
          plan: 'free',
          explanation_count: 0,
        });
    }

    // 3. Return token + user
    res.status(201).json({
      token: authData.session?.access_token || null,
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        name: name || '',
      }
    });
  } catch (err) {
    console.error(`[Auth Register] ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('users')
      .select('name, plan, theme')
      .eq('id', data.user.id)
      .single();

    res.status(200).json({
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || '',
        plan: profile?.plan || 'free',
        theme: profile?.theme || 'light',
      }
    });
  } catch (err) {
    console.error(`[Auth Login] ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(`[Auth Logout] ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Returns the current user's profile (requires auth token).
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('name, email, plan, theme, explanation_count, onboarding_data')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.status(200).json({
      id: req.user.id,
      ...profile,
    });
  } catch (err) {
    console.error(`[Auth Me] ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
