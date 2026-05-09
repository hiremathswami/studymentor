/**
 * @file src/routes/progress.js
 * @description GET /api/progress & GET /api/progress/weekly-summary
 */

const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const requireAuth = require('../middleware/auth');
const { askClaude, askClaudeJSON } = require('../lib/claude');

/**
 * GET /api/progress
 */
router.get('/', requireAuth, async (req, res) => {
  const { range } = req.query; // week|month|3months|all

  try {
    let days = 7;
    if (range === 'month') days = 30;
    if (range === '3months') days = 90;
    if (range === 'all') days = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const dateLimit = startDate.toISOString().split('T')[0];

    // 1. Fetch filtered logs for the charts/stats
    const { data: logsData } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('log_date', dateLimit)
      .order('log_date', { ascending: true });
    const logs = logsData || [];

    // 2. Fetch ALL logs for lifetime stats
    const { data: allLogsData } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .order('log_date', { ascending: true });
    const allLogs = allLogsData || [];

    // 3. Fetch all quizzes for topic stats
    const { data: quizzesData } = await supabase
      .from('quiz_results')
      .select('topic, passed, score, total')
      .eq('user_id', req.user.id);
    const quizzes = quizzesData || [];

    const topicStats = {};
    quizzes.forEach(q => {
      if (!topicStats[q.topic]) topicStats[q.topic] = { passed: 0, total: 0, scores: [] };
      topicStats[q.topic].total++;
      if (q.passed) topicStats[q.topic].passed++;
      topicStats[q.topic].scores.push(q.score / q.total);
    });

    const topicArray = Object.keys(topicStats).map(t => ({
      topic: t,
      passRate: topicStats[t].passed / topicStats[t].total,
      avgScore: topicStats[t].scores.reduce((a, b) => a + b, 0) / topicStats[t].scores.length
    }));

    const strengths = topicArray.filter(t => t.passRate >= 0.8).sort((a, b) => b.passRate - a.passRate).slice(0, 3);
    const weakAreas = topicArray.filter(t => t.passRate < 0.6).sort((a, b) => a.passRate - b.passRate).slice(0, 3);

    const totalTasks = logs.reduce((acc, log) => acc + (log.tasks_done || 0), 0);
    const lifetimeTasks = allLogs.reduce((acc, log) => acc + (log.tasks_done || 0), 0);
    const totalHours = logs.reduce((acc, log) => acc + parseFloat(log.hours_studied || 0), 0);
    
    // 4. Calculate Streak
    let streak = 0;
    if (allLogs.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const lastLogDate = allLogs[allLogs.length - 1].log_date;
      
      if (lastLogDate === today || lastLogDate === yesterday) {
        streak = 1;
        for (let i = allLogs.length - 2; i >= 0; i--) {
          const d1 = new Date(allLogs[i+1].log_date);
          const d2 = new Date(allLogs[i].log_date);
          const diff = Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
          if (diff === 1) streak++;
          else if (diff === 0) continue; // Same day log
          else break;
        }
      }
    }

    // 5. Define achievements
    const achievements = [
      { id: 'first_task', name: 'FIRST STEP', desc: 'Complete your first task', icon: 'flag', unlocked: lifetimeTasks >= 1 },
      { id: 'fast_starter', name: 'FAST STARTER', desc: 'Complete 5 tasks', icon: 'rocket_launch', unlocked: lifetimeTasks >= 5 },
      { id: 'week_warrior', name: 'WEEK WARRIOR', desc: '7-day study streak', icon: 'military_tech', unlocked: streak >= 7 },
      { id: 'perfect_score', name: '100% SCORE', desc: 'Get a perfect quiz score', icon: 'emoji_events', unlocked: quizzes.some(q => q.score === q.total) },
      { id: 'deep_diver', name: 'DEEP DIVER', desc: 'Study 3+ topics', icon: 'scuba_diving', unlocked: Object.keys(topicStats).length >= 3 },
      { id: 'task_master', name: 'TASK MASTER', desc: 'Complete 25 tasks', icon: 'workspace_premium', unlocked: lifetimeTasks >= 25 },
      { id: 'streak_30', name: '30 DAY STREAK', desc: '30-day study streak', icon: 'local_fire_department', unlocked: streak >= 30 },
      { id: 'scholar', name: 'SCHOLAR', desc: 'Complete 100 tasks', icon: 'school', unlocked: lifetimeTasks >= 100 },
    ];

    const avgScore = quizzes.length ? (quizzes.reduce((acc, q) => acc + (q.score/q.total), 0) / quizzes.length) * 100 : 0;
    const totalDays = logs.length;

    // 6. Generate AI Insight using Claude
    let aiInsight = "Great start! Keep completing tasks to get personalized insights.";
    try {
      const prompt = `User Stats:
- Total Tasks: ${totalTasks}
- Quiz Average: ${Math.round(avgScore)}%
- Active Days: ${totalDays}
- Topics Covered: ${Object.keys(topicStats).join(', ') || 'None yet'}
- Achievement Progress: ${achievements.filter(a => a.unlocked).length}/${achievements.length} unlocked

Generate a one-sentence, motivating academic mentor insight for this student. Mention their strongest topic or streak if applicable.`;
      const insightData = await askClaudeJSON(prompt, "You are a motivating academic mentor. Return JSON: { \"insight\": \"...\" }");
      if (insightData.insight) aiInsight = insightData.insight;
    } catch (err) {
      console.warn('AI Insight generation failed:', err.message);
    }

    res.status(200).json({
      stats: {
        totalDays,
        totalTasks,
        hoursStudied: totalHours,
        quizAverage: avgScore
      },
      logs,
      strengths,
      weakAreas,
      achievements,
      aiInsight
    });
  } catch (err) {
    console.error(`[Progress] Error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/progress/weekly-summary
 */
router.get('/weekly-summary', requireAuth, async (req, res) => {
  try {
    const lastSunday = new Date();
    lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());

    const { data: logs } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('log_date', lastSunday.toISOString().split('T')[0]);

    const { data: quizzes } = await supabase
      .from('quiz_results')
      .select('topic, passed')
      .eq('user_id', req.user.id)
      .gte('created_at', lastSunday.toISOString());

    const { data: user } = await supabase.from('users').select('name').eq('id', req.user.id).single();

    const tasksCount = (logs || []).reduce((acc, l) => acc + (l.tasks_done || 0), 0);
    const strongTopics = (quizzes || []).filter(q => q.passed).map(q => q.topic).join(', ');
    const weakTopics = (quizzes || []).filter(q => !q.passed).map(q => q.topic).join(', ');

    const prompt = `User ${user?.name || 'Alex'} completed ${tasksCount} tasks this week.
    Strong in: ${strongTopics || 'N/A'}.
    Weak in: ${weakTopics || 'N/A'}.
    Generate a 3-paragraph encouraging weekly summary with specific recommendations for their studies.`;

    const summary = await askClaude(prompt, "You are a supportive academic coach.");

    res.status(200).json({ summary, generated_at: new Date().toISOString() });
  } catch (err) {
    console.error(`[Weekly Summary] Error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
