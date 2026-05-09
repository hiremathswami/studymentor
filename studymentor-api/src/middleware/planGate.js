/**
 * @file src/middleware/planGate.js
 * @description Middleware to restrict access to Pro features based on user plan.
 *              Includes route-specific limit checks for free-tier users.
 */

const supabase = require('../lib/supabase');

/**
 * Check user.plan — allow pro/team through, apply route-specific free limits.
 */
async function requirePro(req, res, next) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('plan, explanation_count')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(500).json({ error: 'Failed to verify subscription plan' });
    }

    // Pro and Team users always pass
    if (user.plan === 'pro' || user.plan === 'team') return next();

    // Free user — check route-specific limits
    if (req.path.includes('/explain') && user.explanation_count < 5) return next();

    if (req.path.includes('/plan/regenerate') || req.path.includes('/plan/generate')) {
      return res.status(403).json({
        error: 'Plan regeneration requires Pro',
        upgrade_url: '/upgrade.html'
      });
    }

    res.status(403).json({
      error: "You've hit your free tier limit",
      upgrade_url: '/upgrade.html'
    });
  } catch (err) {
    console.error(`[PlanGate] ${err.message}`);
    res.status(500).json({ error: 'Internal server error during plan verification' });
  }
}

module.exports = requirePro;
