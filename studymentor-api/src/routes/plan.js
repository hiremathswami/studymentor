/**
 * @file src/routes/plan.js
 * @description POST /api/plan/generate & GET /api/plan — study plan CRUD.
 */

const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { askClaudeJSON } = require('../lib/claude');
const requireAuth = require('../middleware/auth');
const requirePro = require('../middleware/planGate');

/**
 * Internal helper — generates plan via Claude and saves to DB.
 * Exported so onboarding.js can call it directly.
 */
async function generatePlanInternal(userId, config) {
  const { subject, goal, level, weeks, hoursPerDay, weakTopics, days } = config;

  const systemMsg =
    "You are an expert academic study planner. Create personalized, " +
    "realistic study plans that adapt to the student's goals, level, and " +
    "available time. Output structured JSON only.";

  const prompt = `Create a detailed ${weeks}-week study plan for:
Subject: ${subject}
Level: ${level || 'intermediate'}
Goal: ${goal}
Available time: ${hoursPerDay} hours/day on ${days && days.length > 0 ? days.join(', ') : 'Everyday'}
Weak areas to prioritize: ${weakTopics && weakTopics.length > 0 ? weakTopics.join(', ') : 'None'}

Return JSON with this exact structure:
{
  "title": "...",
  "overview": "2-sentence description",
  "weeks": [
    {
      "week": 1,
      "theme": "Theme name",
      "goal": "Weekly goal",
      "topics": ["topic1", "topic2"],
      "daily_tasks": [
        {
          "day": "Mon",
          "task": "Task title",
          "description": "Brief desc",
          "type": "read|practice|video|quiz",
          "duration_mins": 30
        }
      ]
    }
  ]
}

Generate ${weeks} complete weeks. Match daily_tasks to user's available days.
Total daily duration must not exceed ${hoursPerDay * 60} minutes.
Front-load weak topics in early weeks.`;

  const planJson = await askClaudeJSON(prompt, systemMsg);

  if (!planJson.weeks || !Array.isArray(planJson.weeks)) {
    throw new Error('Claude returned invalid plan structure');
  }

  // Mark previous plans inactive
  await supabase
    .from('study_plans')
    .update({ is_active: false })
    .eq('user_id', userId);

  // Insert new plan
  const { data, error } = await supabase
    .from('study_plans')
    .insert({
      user_id: userId,
      subject,
      goal,
      level: level || 'intermediate',
      weeks: parseInt(weeks),
      hours_per_day: parseFloat(hoursPerDay),
      plan_json: planJson,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * GET /api/plan
 * Returns the active study plan for the authenticated user.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data: plan, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!plan) return res.status(200).json({ plan: null });

    res.status(200).json({ plan });
  } catch (err) {
    console.error(`[Plan GET] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/plan/generate
 * Middleware: requireAuth + requirePro (free users get first plan free via onboarding)
 */
router.post('/generate', requireAuth, async (req, res) => {
  const { subject, goal, level, weeks, hoursPerDay, weakTopics, days } = req.body;

  if (!subject || !goal) {
    return res.status(400).json({ error: 'Subject and goal are required' });
  }

  try {
    // Check if user already has a plan (re-generation needs Pro)
    const { data: existing } = await supabase
      .from('study_plans')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .maybeSingle();

    // If they already have a plan, check Pro status for re-generation
    if (existing) {
      const { data: user } = await supabase
        .from('users')
        .select('plan')
        .eq('id', req.user.id)
        .single();

      if (user?.plan === 'free') {
        return res.status(403).json({
          error: 'Plan regeneration requires Pro',
          upgrade_url: '/upgrade.html',
        });
      }
    }

    const plan = await generatePlanInternal(req.user.id, {
      subject, goal, level, weeks: weeks || 4, hoursPerDay: hoursPerDay || 2, weakTopics, days,
    });

    res.status(201).json({ plan });
  } catch (err) {
    console.error(`[Plan Generate] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

module.exports = {
  router,
  generatePlanInternal,
};
