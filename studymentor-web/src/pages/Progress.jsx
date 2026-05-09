import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Progress() {
  const { user, apiRequest } = useAuth();
  const [period, setPeriod] = useState('week');
  const [data, setData] = useState(null);

  useEffect(() => {
    apiRequest(`/api/progress?range=${period}`)
      .then(res => setData(res))
      .catch(console.error);
  }, [period, apiRequest]);

  const stats = [
    { label: 'ACTIVE DAYS', value: `${data?.stats?.totalDays || 0} Days`, icon: 'local_fire_department', color: '#f59e0b', trend: '', trendUp: true },
    { label: 'TASKS COMPLETED', value: data?.stats?.totalTasks || 0, icon: 'task_alt', color: '#4F46E5', trend: '', trendUp: true },
    { label: 'STUDY HOURS', value: `${data?.stats?.hoursStudied || 0}h`, icon: 'schedule', color: '#7C3AED', trend: '', trendUp: null },
    { label: 'QUIZ AVERAGE', value: `${Math.round(data?.stats?.quizAverage || 0)}%`, icon: 'quiz', color: '#10b981', trend: '', trendUp: true },
  ];

  // Build activity bars for the last 30 days
  const activityData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = data?.logs?.find(l => l.log_date === dateStr);
    return log ? Math.min(100, (log.tasks_done / 5) * 100) : 0; // Assume 5 tasks is 100%
  });

  // Build heatmap grid (7 rows x 15 cols = 105 days)
  const heatmapData = Array.from({ length: 105 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (104 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = data?.logs?.find(l => l.log_date === dateStr);
    if (!log) return 0;
    if (log.tasks_done >= 5) return 3;
    if (log.tasks_done >= 3) return 2;
    if (log.tasks_done >= 1) return 1;
    return 0;
  });

  const strengths = data?.strengths?.length > 0 ? data.strengths.map(s => ({
    name: s.topic, pct: Math.round(s.passRate * 100), color: '#4F46E5'
  })) : [
    { name: 'Complete tasks to see strengths', pct: 0, color: '#e2e8f0' }
  ];

  const weakTopics = data?.weakAreas?.length > 0 ? data.weakAreas.map(w => ({
    name: w.topic, icon: 'warning'
  })) : [
    { name: 'No weak areas identified yet!', icon: 'check_circle' }
  ];

  const defaultAchievements = [
    { id: 'first_task', name: 'FIRST STEP', desc: 'Complete your first task', icon: 'flag', unlocked: false },
    { id: 'fast_starter', name: 'FAST STARTER', desc: 'Complete 5 tasks', icon: 'rocket_launch', unlocked: false },
    { id: 'week_warrior', name: 'WEEK WARRIOR', desc: '7-day study streak', icon: 'military_tech', unlocked: false },
    { id: 'perfect_score', name: '100% SCORE', desc: 'Get a perfect quiz score', icon: 'emoji_events', unlocked: false },
    { id: 'deep_diver', name: 'DEEP DIVER', desc: 'Study 3+ topics', icon: 'scuba_diving', unlocked: false },
    { id: 'task_master', name: 'TASK MASTER', desc: 'Complete 25 tasks', icon: 'workspace_premium', unlocked: false },
    { id: 'streak_30', name: '30 DAY STREAK', desc: '30-day study streak', icon: 'local_fire_department', unlocked: false },
    { id: 'scholar', name: 'SCHOLAR', desc: 'Complete 100 tasks', icon: 'school', unlocked: false },
  ];

  const achievements = data?.achievements || defaultAchievements;

  return (
    <div className="progress-page">
      {/* Header */}
      <div className="progress-header">
        <div>
          <h1>Your Progress</h1>
          <p className="progress-subtitle">See how far you've come 🚀</p>
        </div>
        <div className="progress-header-right">
          <div className="period-tabs">
            {['week', 'month', '3months'].map(p => (
              <button key={p} className={`period-tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                {p === '3months' ? '3 Months' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary">
            <span className="material-symbols-rounded">download</span> Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="progress-stats">
        {stats.map((s, i) => (
          <div key={i} className="progress-stat-card">
            <div className="psc-top">
              <span className="material-symbols-rounded psc-icon" style={{ color: s.color }}>{s.icon}</span>
              {s.trend && (
                <span className={`psc-trend ${s.trendUp ? 'up' : s.trendUp === false ? 'down' : ''}`}>
                  {s.trend}
                </span>
              )}
            </div>
            <div className="psc-value">{s.value}</div>
            <div className="psc-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="progress-card">
        <div className="pc-header">
          <h3>Activity — Last 30 Days</h3>
          <div className="pc-legend"><span className="legend-dot"></span> Completed</div>
        </div>
        <div className="activity-bars">
          {activityData.map((val, i) => (
            <div key={i} className="activity-bar-wrapper">
              <div className="activity-bar" style={{ height: `${val}%` }}></div>
            </div>
          ))}
        </div>
        <div className="activity-labels">
          <span>Oct 1</span>
          <span>Oct 15</span>
          <span>Today</span>
        </div>
      </div>

      {/* Consistency + Strengths */}
      <div className="progress-split">
        <div className="progress-card">
          <h3>Consistency</h3>
          <div className="heatmap-grid">
            {heatmapData.map((lvl, i) => (
              <div key={i} className={`heatmap-cell level-${lvl}`}></div>
            ))}
          </div>
          <div className="heatmap-legend">
            <span>LESS</span>
            <div className="heatmap-cell level-0"></div>
            <div className="heatmap-cell level-1"></div>
            <div className="heatmap-cell level-2"></div>
            <div className="heatmap-cell level-3"></div>
            <span>MORE</span>
          </div>
        </div>
        <div className="progress-card">
          <h3>Your Strengths 💪</h3>
          <div className="strengths-list">
            {strengths.map((s, i) => (
              <div key={i} className="strength-row">
                <span className="strength-name">{s.name}</span>
                <div className="strength-bar-track">
                  <div className="strength-bar-fill" style={{ width: `${s.pct}%`, background: s.color }}></div>
                </div>
                <span className="strength-pct" style={{ color: s.color }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attention Needed */}
      <div className="progress-card attention-card">
        <div className="attention-header">
          <span className="material-symbols-rounded" style={{ color: '#f59e0b' }}>warning</span>
          <h3>Attention Needed</h3>
        </div>
        <p className="attention-desc">You've struggled with these topics recently. A quick review session could help stabilize your knowledge.</p>
        <div className="attention-topics">
          {weakTopics.map((wt, i) => (
            <div key={i} className="attention-topic-card">
              <span className="material-symbols-rounded" style={{ fontSize: 24, color: 'var(--primary)' }}>{wt.icon}</span>
              <h4>{wt.name}</h4>
              <button className="practice-btn">Practice now</button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Mentor Insight */}
      <div className="mentor-insight-card">
        <div className="mi-icon"><span className="material-symbols-rounded">tips_and_updates</span></div>
        <div className="mi-content">
          <div className="mi-header">
            <h4>AI Mentor Insight</h4>
            <span className="mi-time">UPDATED: JUST NOW</span>
          </div>
          <p>{data?.aiInsight || "Great start! Keep completing tasks to get personalized insights."}</p>
          <div className="mi-badges">
            <div className="mi-badge-avatars">🟢🟢🟡</div>
            <span className="mi-highlight">Your progress is being tracked in real-time.</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h3>Achievements</h3>
        <div className="achievements-grid">
          {achievements.map((a, i) => (
            <div key={i} className={`achievement-card ${a.unlocked ? 'unlocked' : 'locked'}`} title={a.desc || ''}>
              <div className="achievement-icon-wrap">
                <span className="material-symbols-rounded">{a.icon}</span>
                {!a.unlocked && <span className="material-symbols-rounded lock-icon">lock</span>}
              </div>
              <span className="achievement-name">{a.name}</span>
              {a.desc && <span className="achievement-desc">{a.desc}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
