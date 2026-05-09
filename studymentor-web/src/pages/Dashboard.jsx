import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TaskAssignmentModal from '../components/TaskAssignmentModal';

export default function Dashboard() {
  const { user, apiRequest } = useAuth();
  const [filter, setFilter] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [tip, setTip] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [weekInfo, setWeekInfo] = useState({ current: 1, total: 4 });
  const [stats, setStats] = useState({ streak: 0, average: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const h = new Date().getHours();
    const timeGreeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    setGreeting(timeGreeting);

    // Try to fetch real tasks
    (async () => {
      try {
        const data = await apiRequest('/api/tasks/today');
        const tasksList = data.tasks_json || data.tasks || [];
        if (Array.isArray(tasksList)) {
          setTasks(tasksList.map((t, i) => ({
            id: t.id || i,
            title: t.task || t.title,
            type: t.type || 'Read',
            subject: t.subject || 'General',
            completed: t.completed || false,
            time: `${t.duration_mins || 30}m`
          })));
        }
        if (data.greeting) setGreeting(data.greeting);
        if (data.tip) setTip(data.tip);
        if (data.current_week && data.total_weeks) {
          setWeekInfo({ current: data.current_week, total: data.total_weeks });
        }
      } catch { /* use defaults */ }
    })();

    // Fetch progress stats
    (async () => {
      try {
        const pData = await apiRequest('/api/progress?range=week');
        if (pData?.stats) {
          setStats({
            streak: pData.stats.totalDays || 0,
            average: pData.stats.quizAverage ? Math.round(pData.stats.quizAverage) : 0
          });
        }
      } catch { /* ignore */ }
    })();
  }, []);

  const handleTaskClick = (task) => {
    if (task.completed) return; // Prevent undoing after passing quiz
    setSelectedTask(task);
  };

  const handleAssignmentComplete = (taskId, completedCount, totalCount) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    setSelectedTask(null);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const filteredTasks = filter === 'all' ? tasks : filter === 'completed' ? tasks.filter(t => t.completed) : tasks.filter(t => !t.completed);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const typeIcons = { Read: 'menu_book', Practice: 'edit_note', Video: 'play_circle', Quiz: 'quiz' };

  return (
    <div className="dashboard-page">
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div>
            <h1 className="dash-greeting" style={{ margin: 0, fontSize: '32px', fontWeight: 800 }}>{greeting}, {user?.name || 'Student'} 👋</h1>
            <p className="dash-subtitle" style={{ margin: '4px 0 0', opacity: 0.7 }}>Track your daily tasks and achieve your goals.</p>
          </div>
          <div className="study-mode-badge" style={{ marginTop: '8px' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>bolt</span>
            STUDY MODE ACTIVE
          </div>
        </div>
        
        <div className="dash-date-time" style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '14px', fontWeight: 500 }}>
            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="dash-grid">
        {/* Left Column */}
        <div className="dash-left">
          {/* Stat Cards */}
          <div className="dash-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-top">
                <span className="dash-stat-label">TASKS TODAY</span>
                <span className="material-symbols-rounded dash-stat-icon" style={{ color: '#4F46E5' }}>task_alt</span>
              </div>
              <div className="dash-stat-row">
                <span className="dash-stat-big">{completedCount}</span>
                <span className="dash-stat-sub">/ {totalCount}</span>
                <span className="dash-stat-pct">{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%</span>
              </div>
              <div className="dash-progress-track">
                <div className="dash-progress-fill" style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-top">
                <span className="dash-stat-label">CURRENT STREAK</span>
                <span className="material-symbols-rounded dash-stat-icon" style={{ color: '#f59e0b' }}>local_fire_department</span>
              </div>
              <div className="dash-stat-big">{stats.streak} <span className="dash-stat-unit">days</span></div>
              <p className="dash-stat-trend up">Keep it up!</p>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-top">
                <span className="dash-stat-label">QUIZ AVERAGE</span>
                <span className="material-symbols-rounded dash-stat-icon" style={{ color: '#10b981' }}>trending_up</span>
              </div>
              <div className="dash-stat-big">{stats.average}<span className="dash-stat-unit">%</span></div>
              <p className="dash-stat-note">Your overall score</p>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="dash-tasks-section">
            <div className="dash-tasks-header">
              <h2>Today's Tasks</h2>
              <div className="dash-filter-tabs">
                {['all', 'pending', 'completed'].map(f => (
                  <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="dash-task-list">
              {filteredTasks.length === 0 ? (
                <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                  <div className="empty-tasks-icon">
                    <span className="material-symbols-rounded" style={{ fontSize: 48, color: 'var(--outline)' }}>
                      {filter === 'all' ? 'event_note' : 'filter_list'}
                    </span>
                  </div>
                  <h3 style={{ margin: '16px 0 8px', color: 'var(--on-surface)' }}>
                    {filter === 'all' ? "No tasks for today!" : "No tasks found."}
                  </h3>
                  <p style={{ color: 'var(--on-surface-variant)', marginBottom: '24px', maxWidth: '300px', margin: '0 auto 24px' }}>
                    {filter === 'all' ? (tasks.length === 0 ? "You haven't set up a study plan yet. Let's build one together!" : "Enjoy your rest day! You've earned it. 🎉") : "Try changing your filter to see more tasks."}
                  </p>
                  {tasks.length === 0 && filter === 'all' && (
                    <Link to="/onboarding" className="btn btn-primary">
                      <span className="material-symbols-rounded">add_circle</span> Create Study Plan
                    </Link>
                  )}
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div key={task.id} className={`dash-task-item ${task.completed ? 'completed' : ''}`}>
                    <div className={`task-checkbox ${task.completed ? 'checked' : ''}`} onClick={() => handleTaskClick(task)}>
                      {task.completed && <span className="material-symbols-rounded">check</span>}
                    </div>
                    <div className="task-info" onClick={() => handleTaskClick(task)} style={{cursor: 'pointer'}}>
                      <span className={`task-name ${task.completed ? 'done' : ''}`}>{task.title}</span>
                      <div className="task-meta">
                        <span className="material-symbols-rounded" style={{ fontSize: 14 }}>{typeIcons[task.type] || 'description'}</span>
                        <span>{task.type}</span>
                        <span className="task-subject-tag">{task.subject}</span>
                      </div>
                    </div>
                    {!task.completed && <button className="task-start-btn" onClick={() => handleTaskClick(task)}>Start</button>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mentor's Tip */}
          <div className="mentor-tip-card">
            <div className="mentor-tip-icon">
              <span className="material-symbols-rounded">tips_and_updates</span>
            </div>
            <div>
              <h4 className="mentor-tip-title">Mentor's Tip</h4>
              <p className="mentor-tip-text">
                {tip || "You've been focused for 45 minutes! Research shows that taking a short 5-minute break can improve information retention. Stretch, hydrate, and come back fresh."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dash-right">
          {/* Weekly Progress */}
          <div className="dash-widget">
            <h4 className="widget-title">WEEKLY PROGRESS</h4>
            <div className="weekly-bars">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
                // Calculate height based on tasks done vs total if possible
                // For now, if today, show real progress, otherwise fallback
                const isToday = i === (today.getDay() === 0 ? 6 : today.getDay() - 1);
                const total = tasks.length || 1;
                const done = tasks.filter(t => t.completed).length;
                const height = isToday ? (done / total) * 100 : [15, 25, 10, 40, 20, 0, 0][i];
                
                return (
                  <div key={i} className="bar-col">
                    <div className="bar-track">
                      <div className={`bar-fill ${isToday ? 'today' : ''}`} style={{ height: `${height}%` }}></div>
                    </div>
                    <span className={`bar-label ${isToday ? 'today' : ''}`}>{d}</span>
                  </div>
                );
              })}
            </div>
            <div className="widget-footer">
              <span>Today's completion</span>
              <strong>{Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100)}%</strong>
            </div>
          </div>

          {/* Coming Up */}
          <div className="dash-widget">
            <div className="widget-header">
              <h4 className="widget-title">COMING UP</h4>
              <Link to="/plan" className="widget-link">VIEW ALL</Link>
            </div>
            <div className="coming-up-list">
              {tasks.filter(t => !t.completed).length > 0 ? (
                tasks.filter(t => !t.completed).slice(0, 3).map((task, idx) => {
                  const colors = ['red', 'blue', 'orange', 'purple'];
                  return (
                    <div key={task.id} className="coming-up-item">
                      <div className={`coming-up-bar ${colors[idx % colors.length]}`}></div>
                      <div>
                        <strong>{task.title}</strong>
                        <span>{task.topic} · Next Session</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', opacity: 0.6 }}>
                  No upcoming tasks!
                </div>
              )}
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="dash-upgrade-card">
            <h3>Supercharge Your Learning</h3>
            <p>Get unlimited AI tutoring and priority study plan generation.</p>
            <Link to="/upgrade" className="upgrade-cta-btn">Go Pro Today</Link>
          </div>
        </div>
      </div>
      
      <TaskAssignmentModal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        task={selectedTask} 
        subject={selectedTask?.subject}
        onComplete={handleAssignmentComplete}
      />
    </div>
  );
}
