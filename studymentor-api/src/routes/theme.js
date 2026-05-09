/**
 * @file src/routes/theme.js
 * @description PUT /api/user/theme — Save user theme preference.
 */

const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const requireAuth = require('../middleware/auth');

/**
 * PUT /api/user/theme
 * Body: { theme: 'light' | 'dark' }
 */
router.put('/', requireAuth, async (req, res) => {
  const { theme } = req.body;

  if (!['light', 'dark'].includes(theme)) {
    return res.status(400).json({ error: 'Invalid theme. Must be "light" or "dark".' });
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({ theme })
      .eq('id', req.user.id);

    if (error) throw error;

    res.status(200).json({ success: true, theme });
  } catch (err) {
    console.error(`[Theme] ${err.message}`);
    res.status(500).json({ error: 'Failed to save theme preference' });
  }
});

module.exports = router;
