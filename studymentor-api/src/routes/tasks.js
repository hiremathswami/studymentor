/**
 * @file src/routes/tasks.js
 * @description GET /api/tasks/today & POST /api/tasks/complete
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const supabase = require('../lib/supabase');
const requireAuth = require('../middleware/auth');
const { askClaudeJSON } = require('../lib/claude');

/**
 * GET /api/tasks/today
 */
router.get('/today', requireAuth, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Check if tasks already exist for today
    const { data: existingTasks } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('task_date', today)
      .maybeSingle();

    if (existingTasks) {
      return res.status(200).json(existingTasks);
    }

    // 2. Fetch active plan
    const { data: plan } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (!plan) {
      return res.status(200).json({
        greeting: 'Welcome to StudyMentor!',
        tip: 'Create a study plan to get started with daily tasks.',
        tasks_json: [],
        total_count: 0,
        completed_count: 0,
      });
    }

    // 3. Calculate current week and day
    const createdAt = new Date(plan.created_at);
    const diffDays = Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24));
    const weekIndex = Math.floor(diffDays / 7);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayName = dayNames[new Date().getDay()];

    const currentWeek = plan.plan_json?.weeks?.[weekIndex];
    if (!currentWeek) {
      return res.status(200).json({
        greeting: 'Congratulations!',
        tip: 'You have completed your study plan. Generate a new one to keep going!',
        tasks: [],
        total_count: 0,
        completed_count: 0,
      });
    }

    // 4. Extract today's tasks
    const todayTasksRaw = (currentWeek.daily_tasks || []).filter(t => 
      t.day && String(t.day).toLowerCase().startsWith(todayName.toLowerCase())
    );
    const tasks = todayTasksRaw.map(t => ({
      ...t,
      id: crypto.randomUUID(),
      completed: false,
    }));

    // 5. Get greeting + tip from Claude
    let meta = { greeting: `Good ${getTimeOfDay()}!`, tip: 'Stay focused and take breaks.' };
    try {
      const { data: user } = await supabase.from('users').select('name').eq('id', req.user.id).single();
      const prompt = `User ${user?.name || 'Scholar'} is on Day ${diffDays + 1} of Week ${weekIndex + 1} studying ${plan.subject}.
Today's tasks are: ${tasks.map(t => t.task).join(', ') || 'Rest day'}.
Generate JSON: { "greeting": "time-aware ${getTimeOfDay()} greeting using their name", "tip": "one-sentence motivating tip about today's tasks" }`;
      meta = await askClaudeJSON(prompt, 'You are a motivating academic mentor. Keep it brief.');
    } catch {
      // Silently fall back to default greeting
    }

    // 6. Insert into daily_tasks
    const { data: savedTasks, error: insertError } = await supabase
      .from('daily_tasks')
      .insert({
        user_id: req.user.id,
        plan_id: plan.id,
        task_date: today,
        tasks_json: tasks,
        total_count: tasks.length,
        completed_count: 0,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(200).json({
      ...savedTasks,
      greeting: meta.greeting,
      tip: meta.tip,
      current_week: weekIndex + 1,
      total_weeks: plan.plan_json?.weeks?.length || plan.weeks
    });
  } catch (err) {
    console.error(`[Tasks Today] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/tasks/complete
 * Body: { taskId }
 */
router.post('/complete', requireAuth, async (req, res) => {
  const { taskId } = req.body;
  const today = new Date().toISOString().split('T')[0];

  if (!taskId) return res.status(400).json({ error: 'taskId is required' });

  try {
    const { data, error } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('task_date', today)
      .single();

    if (error || !data) return res.status(404).json({ error: 'No tasks found for today' });

    // Mark the task completed
    const updatedTasks = data.tasks_json.map(t =>
      t.id === taskId ? { ...t, completed: true, completed_at: new Date().toISOString() } : t
    );
    const completedCount = updatedTasks.filter(t => t.completed).length;

    await supabase
      .from('daily_tasks')
      .update({ tasks_json: updatedTasks, completed_count: completedCount })
      .eq('id', data.id);

    // Upsert progress log
    try {
      await supabase.rpc('upsert_progress_log', {
        u_id: req.user.id,
        l_date: today,
        inc_tasks: 1,
      });
    } catch { /* non-critical */ }

    res.status(200).json({
      success: true,
      completed_count: completedCount,
      total_count: data.total_count,
    });
  } catch (err) {
    console.error(`[Task Complete] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/tasks/assignment
 * Generate a 10-question quiz for a specific task
 * Body: { taskTitle, subject }
 */
router.post('/assignment', requireAuth, async (req, res) => {
  const { taskTitle, subject } = req.body;
  if (!taskTitle || !subject) return res.status(400).json({ error: 'taskTitle and subject required' });

  const prompt = `Generate a 10-question multiple-choice quiz about the following topic:
Subject: ${subject}
Topic/Task: ${taskTitle}

Ensure the questions test actual understanding, not just trivia.
Format the response strictly as a JSON object matching this schema:
{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    }
  ]
}
Where correctIndex is an integer from 0 to 3.`;

  try {
    const quiz = await askClaudeJSON(prompt, "You are an expert academic examiner. Return ONLY valid JSON.");
    res.status(200).json(quiz);
  } catch (err) {
    console.error(`[Assignment Gen] ${err.message}`);
    res.status(500).json({ error: 'Failed to generate assignment' });
  }
});

/**
 * POST /api/tasks/submit-assignment
 * Body: { taskId, score, total, topic }
 */
router.post('/submit-assignment', requireAuth, async (req, res) => {
  const { taskId, score, total, topic } = req.body;
  const today = new Date().toISOString().split('T')[0];
  
  if (score === undefined || !total || !topic || !taskId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const passed = score >= 7;

  try {
    // 1. Record the quiz result
    await supabase.from('quiz_results').insert({
      user_id: req.user.id,
      topic: topic,
      score: score,
      total: total,
      passed: passed,
      created_at: new Date().toISOString()
    });

    if (!passed) {
      return res.status(200).json({ passed, message: 'Keep trying! You need 7/10 to pass.' });
    }

    // 2. Mark task complete if passed
    const { data, error } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('task_date', today)
      .single();

    if (error || !data) return res.status(404).json({ error: 'No tasks found for today' });

    const updatedTasks = data.tasks_json.map(t =>
      t.id === taskId ? { ...t, completed: true, completed_at: new Date().toISOString() } : t
    );
    const completedCount = updatedTasks.filter(t => t.completed).length;

    await supabase
      .from('daily_tasks')
      .update({ tasks_json: updatedTasks, completed_count: completedCount })
      .eq('id', data.id);

    // 3. Upsert progress log manually since RPC mock might be missing in some environments
    const { data: logData } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('log_date', today)
      .maybeSingle();
      
    if (logData) {
      await supabase.from('progress_logs').update({ tasks_done: (logData.tasks_done || 0) + 1 }).eq('id', logData.id);
    } else {
      await supabase.from('progress_logs').insert({ user_id: req.user.id, log_date: today, tasks_done: 1, hours_studied: 1 });
    }

    res.status(200).json({
      passed: true,
      success: true,
      completed_count: completedCount,
      total_count: data.total_count,
    });
  } catch (err) {
    console.error(`[Submit Assignment] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

module.exports = router;
