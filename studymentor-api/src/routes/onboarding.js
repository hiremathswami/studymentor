/**
 * @file src/routes/onboarding.js
 * @description POST /api/onboarding - Saves wizard data and triggers plan generation.
 */

const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const requireAuth = require('../middleware/auth');
const { generatePlanInternal } = require('./plan'); // I'll export this from plan.js

/**
 * POST /api/onboarding
 * Body: { subject, level, goal, targetDate, hoursPerDay, days[], weakTopics[] }
 */
router.post('/', requireAuth, async (req, res) => {
  const { subject, level, goal, weeks, hoursPerDay, weakTopics } = req.body;

  // 1. Validate all required fields
  if (!subject || !level || !goal || !weeks || !hoursPerDay) {
    return res.status(400).json({ error: 'Missing required onboarding fields' });
  }

  try {
    // 2. Save to users.onboarding_data
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ 
        onboarding_data: { subject, level, goal, weeks, hoursPerDay, weakTopics } 
      })
      .eq('id', req.user.id);

    if (userUpdateError) throw userUpdateError;

    // 3. Auto-trigger plan generation
    const plan = await generatePlanInternal(req.user.id, {
      subject, goal, level, weeks, hoursPerDay, weakTopics, days: []
    });

    // 5. Return success
    res.status(200).json({ success: true, planId: plan.id });
  } catch (err) {
    console.error(`[Onboarding] Error: ${err.message}`);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

module.exports = router;
