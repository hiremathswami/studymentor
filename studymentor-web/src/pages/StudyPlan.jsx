import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function StudyPlan() {
  const navigate = useNavigate();
  const { user, apiRequest } = useAuth();
  const [activeWeek, setActiveWeek] = useState(1);
  const [plan, setPlan] = useState(null);

  // Default mock plan data matching reference image
  const defaultPlan = {
    title: 'Master AP Chemistry in 8 Weeks',
    overview: 'This AI-optimized curriculum balances foundational theory with high-frequency AP exam topics. Designed to maximize retention through active recall and spaced repetition concepts.',
    subject: 'AP Chemistry',
    weeks: 8,
    hours_per_day: 2,
    level: 'Beginner',
    totalTasks: 164,
    progress: 0,
    plan_json: {
      weeks: Array.from({ length: 8 }, (_, i) => ({
        week: i + 1,
        theme: ['Atomic Structure', 'Chemical Equations', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Kinetics', 'Equilibrium', 'Final Review'][i],
        goal: 'Master the fundamentals',
        topics: ['Ionic bonds', 'Covalent bonds', 'Lewis structures', 'VSEPR'],
        progress: i < 2 ? 100 : i === 2 ? 60 : 0,
        daily_tasks: i === 2 ? [
          { day: 'Mon', task: 'Intro to Electrostatics & Lattice Energy', type: 'Read', duration_mins: 45, completed: true },
          { day: 'Tue', task: 'Lewis Structures Practice Set', type: 'Practice', duration_mins: 60, completed: true },
          { day: 'Wed', task: 'VSEPR Theory & Molecular Geometry', type: 'Video', duration_mins: 35, completed: false, isToday: true },
          { day: 'Thu', task: 'Bond Polarity & Electronegativity', type: 'Read', duration_mins: 40, completed: false },
          { day: 'Fri', task: 'Weekly Review Quiz (Bonding)', type: 'Quiz', duration_mins: 30, completed: false },
        ] : [
          { day: 'Mon', task: `${['Atomic Structure', 'Chemical Equations', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Kinetics', 'Equilibrium', 'Final Review'][i]} Introduction`, type: 'Read', duration_mins: 45, completed: i < 2 },
          { day: 'Wed', task: `${['Atomic Structure', 'Chemical Equations', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Kinetics', 'Equilibrium', 'Final Review'][i]} Practice`, type: 'Practice', duration_mins: 60, completed: i < 2 },
          { day: 'Fri', task: 'Weekly Review', type: 'Quiz', duration_mins: 30, completed: i < 2 },
        ]
      }))
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest('/api/plan');
        if (data.plan) setPlan(data.plan);
      } catch { /* use defaults */ }
    })();
  }, []);

  const p = plan || defaultPlan;
  const currentWeek = p.plan_json?.weeks?.[activeWeek - 1];
  const typeIcons = { Read: 'menu_book', Practice: 'edit_note', Video: 'play_circle', Quiz: 'quiz', read: 'menu_book', practice: 'edit_note', video: 'play_circle', quiz: 'quiz' };

  return (
    <div className="plan-page">
      {/* Header */}
      <div className="plan-header">
        <div className="plan-header-left">
          <h1>Your Study Plan</h1>
          <span className="plan-subject-badge">{p.subject || 'General'}</span>
        </div>
        <div className="plan-header-actions">
          <button className="btn btn-secondary" onClick={() => alert('Edit plan feature coming soon!')}><span className="material-symbols-rounded">edit</span> Edit Plan</button>
          <button className="btn btn-secondary" onClick={() => window.print()}><span className="material-symbols-rounded">picture_as_pdf</span> Export PDF</button>
          <button className="btn btn-primary" onClick={() => navigate('/onboarding')}><span className="material-symbols-rounded">refresh</span> Regenerate</button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="plan-overview-card">
        <div className="plan-overview-left">
          <h2>{p.plan_json?.title || p.title || 'Your Study Plan'}</h2>
          <p className="plan-overview-desc">{p.plan_json?.overview || p.overview || 'AI-generated study plan tailored to your goals.'}</p>
        </div>
        <div className="plan-overview-stats">
          <div className="plan-overview-stat">
            <span className="plan-stat-label">DURATION</span>
            <span className="plan-stat-value">{p.weeks || 8} weeks</span>
          </div>
          <div className="plan-overview-stat">
            <span className="plan-stat-label">TOTAL TASKS</span>
            <span className="plan-stat-value">{p.totalTasks || 164}</span>
          </div>
          <div className="plan-overview-stat">
            <span className="plan-stat-label">HOURS/DAY</span>
            <span className="plan-stat-value">{p.hours_per_day || 2} hrs</span>
          </div>
          <div className="plan-overview-stat">
            <span className="plan-stat-label">LEVEL</span>
            <span className="plan-stat-value">{p.level || 'Beginner'}</span>
          </div>
        </div>
        <div className="plan-progress-section">
          <div className="plan-progress-header">
            <span>Overall Progress</span>
            <span className="plan-progress-pct">{p.progress || 0}% Complete</span>
          </div>
          <div className="plan-progress-track">
            <div className="plan-progress-fill" style={{ width: `${p.progress || 0}%` }}></div>
          </div>
        </div>
      </div>

      {/* Week Tabs */}
      <div className="plan-week-tabs">
        {(p.plan_json?.weeks || []).map((w, i) => (
          <button
            key={i}
            className={`plan-week-tab ${activeWeek === i + 1 ? 'active' : ''} ${w.progress === 100 ? 'done' : ''}`}
            onClick={() => setActiveWeek(i + 1)}
          >
            {w.progress === 100 && <span className="material-symbols-rounded" style={{ fontSize: 16 }}>check_circle</span>}
            Week {i + 1}
          </button>
        ))}
      </div>

      {/* Week Detail */}
      {currentWeek && (
        <div className="plan-week-detail">
          <div className="plan-week-heading">
            <h3>Week {activeWeek}: {currentWeek.theme}</h3>
            <span className="plan-week-pct-badge">{currentWeek.progress || 0}% COMPLETED</span>
          </div>
          <p className="plan-week-desc">{currentWeek.goal}</p>
          {currentWeek.topics && (
            <div className="plan-topic-tags">
              {currentWeek.topics.map((t, i) => <span key={i} className="topic-tag">{t}</span>)}
            </div>
          )}

          {/* Task Table */}
          <div className="plan-task-table">
            <div className="plan-table-header">
              <span>DAY</span>
              <span>TASK</span>
              <span>TYPE</span>
              <span>DURATION</span>
              <span>STATUS</span>
            </div>
            {(currentWeek.daily_tasks || []).map((task, i) => (
              <div key={i} className={`plan-table-row ${task.isToday ? 'today-row' : ''}`}>
                <span className={`plan-cell-day ${task.isToday ? 'today' : ''}`}>{task.day}</span>
                <span className="plan-cell-task">{task.task}</span>
                <span className="plan-cell-type">
                  <span className="material-symbols-rounded" style={{ fontSize: 16 }}>{typeIcons[task.type] || 'description'}</span>
                  {task.type}
                </span>
                <span className={`plan-cell-duration ${task.isToday ? 'bold' : ''}`}>{task.duration_mins}m</span>
                <span className="plan-cell-status">
                  {task.completed ? (
                    <span className="status-done"><span className="material-symbols-rounded" style={{ fontSize: 16 }}>check_circle</span> Done</span>
                  ) : task.isToday ? (
                    <span className="status-today">TODAY</span>
                  ) : (
                    <span className="status-pending">—</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adaptive Insight */}
      <div className="plan-insight-card">
        <div className="insight-icon">
          <span className="material-symbols-rounded">tips_and_updates</span>
        </div>
        <div className="insight-content">
          <h4>Adaptive Insight</h4>
          <p>You're ahead of schedule by 2 days! Want to push the Friday quiz to today and start Week 4 early?</p>
        </div>
        <div className="insight-actions">
          <button className="btn btn-secondary">Stay on track</button>
          <button className="btn btn-primary">Move ahead</button>
        </div>
      </div>
    </div>
  );
}
