import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
const DEMO_USER = {
  id: 'demo-user',
  name: 'Demo Student',
  email: 'demo@student.edu',
  plan: 'Premium Demo',
  demoMode: true
};

const DEMO_PLAN = {
  title: 'Master AP Chemistry in 8 Weeks',
  overview: 'This AI-optimized curriculum balances foundational theory with high-frequency AP exam topics for a strong exam-ready finish.',
  subject: 'AP Chemistry',
  weeks: 8,
  hours_per_day: 2,
  level: 'Beginner',
  totalTasks: 48,
  progress: 34,
  plan_json: {
    weeks: Array.from({ length: 8 }, (_, i) => ({
      week: i + 1,
      theme: ['Atomic Structure', 'Chemical Equations', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Kinetics', 'Equilibrium', 'Final Review'][i],
      goal: 'Build confidence with core concepts and consistent practice',
      topics: ['Concept review', 'Practice problems', 'Mini quiz', 'Targeted revision'].slice(0, 4),
      progress: i < 2 ? 100 : i === 2 ? 60 : 0,
      daily_tasks: i === 2 ? [
        { id: `week-${i + 1}-task-1`, day: 'Mon', task: 'Intro to Electrostatics & Lattice Energy', type: 'Read', subject: 'Chemistry', completed: true, duration_mins: 45 },
        { id: `week-${i + 1}-task-2`, day: 'Tue', task: 'Lewis Structures Practice Set', type: 'Practice', subject: 'Chemistry', completed: true, duration_mins: 60 },
        { id: `week-${i + 1}-task-3`, day: 'Wed', task: 'VSEPR Theory & Molecular Geometry', type: 'Video', subject: 'Chemistry', completed: false, duration_mins: 35, isToday: true },
        { id: `week-${i + 1}-task-4`, day: 'Thu', task: 'Bond Polarity & Electronegativity', type: 'Read', subject: 'Chemistry', completed: false, duration_mins: 40 },
        { id: `week-${i + 1}-task-5`, day: 'Fri', task: 'Weekly Review Quiz (Bonding)', type: 'Quiz', subject: 'Chemistry', completed: false, duration_mins: 30 }
      ] : [
        { id: `week-${i + 1}-task-1`, day: 'Mon', task: `${['Atomic Structure', 'Chemical Equations', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Kinetics', 'Equilibrium', 'Final Review'][i]} Introduction`, type: 'Read', subject: 'Chemistry', completed: i < 2, duration_mins: 45 },
        { id: `week-${i + 1}-task-2`, day: 'Wed', task: `${['Atomic Structure', 'Chemical Equations', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Kinetics', 'Equilibrium', 'Final Review'][i]} Practice`, type: 'Practice', subject: 'Chemistry', completed: i < 2, duration_mins: 60 },
        { id: `week-${i + 1}-task-3`, day: 'Fri', task: 'Weekly Review', type: 'Quiz', subject: 'Chemistry', completed: i < 2, duration_mins: 30 }
      ]
    }))
  }
};

const demoProgressData = {
  stats: {
    totalDays: 14,
    totalTasks: 34,
    hoursStudied: 18,
    quizAverage: 92
  },
  logs: Array.from({ length: 30 }, (_, i) => ({
    log_date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    tasks_done: [0, 1, 2, 3, 4, 5][i % 6]
  })),
  strengths: [
    { topic: 'Chemical Bonding', passRate: 0.95 },
    { topic: 'Stoichiometry', passRate: 0.9 },
    { topic: 'Thermodynamics', passRate: 0.85 }
  ],
  weakAreas: [
    { topic: 'Equilibrium Calculations' },
    { topic: 'Rate Law Interpretation' }
  ],
  achievements: [
    { id: 'first_task', name: 'FIRST STEP', desc: 'Complete your first task', unlocked: true, icon: 'flag' },
    { id: 'fast_starter', name: 'FAST STARTER', desc: 'Complete 5 tasks', unlocked: true, icon: 'rocket_launch' },
    { id: 'week_warrior', name: 'WEEK WARRIOR', desc: '7-day study streak', unlocked: true, icon: 'military_tech' },
    { id: 'perfect_score', name: '100% SCORE', desc: 'Get a perfect quiz score', unlocked: false, icon: 'emoji_events' }
  ],
  aiInsight: 'This demo mode is fully self-contained. No real API calls are made.',
};

const mockApiRequest = async (url, options = {}) => {
  if (url.includes('/api/tasks/today')) {
    return {
      tasks: [
        { id: 'demo-task-1', task: 'Review ionic bonds', type: 'Read', subject: 'AP Chemistry', completed: false, duration_mins: 35 },
        { id: 'demo-task-2', task: 'Practice Lewis structures', type: 'Practice', subject: 'AP Chemistry', completed: false, duration_mins: 50 },
        { id: 'demo-task-3', task: 'Watch VSEPR geometry video', type: 'Video', subject: 'AP Chemistry', completed: false, duration_mins: 30 },
        { id: 'demo-task-4', task: 'Take a bonding quiz', type: 'Quiz', subject: 'AP Chemistry', completed: false, duration_mins: 25 }
      ],
      greeting: 'Welcome back, Demo Student',
      tip: 'Try a short review session next to lock in concepts faster.',
      current_week: 3,
      total_weeks: 8
    };
  }

  if (url.includes('/api/progress')) {
    return demoProgressData;
  }

  if (url.includes('/api/plan')) {
    return { plan: DEMO_PLAN };
  }

  if (url.includes('/api/onboarding')) {
    return { success: true, plan: DEMO_PLAN };
  }

  if (url.includes('/api/explain')) {
    let prompt = 'Explain this topic.';
    if (options.body instanceof FormData) {
      prompt = options.body.get('prompt') || prompt;
    } else if (options.body) {
      try {
        const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        prompt = body.prompt || prompt;
      } catch (err) {
        prompt = prompt;
      }
    }

    return {
      explanation: {
        summary: `Demo explanation for: ${prompt}`,
        explanation: `In Demo Mode, StudyMentor AI returns a fully local explanation so you can preview the experience without any API calls. ${prompt} is broken down into simple steps.`,
        key_points: ['Focus on the main concept', 'Practice with examples', 'Review the summary', 'Use active recall'],
        related_topics: ['Chemical bonding', 'Thermodynamics', 'Equilibrium']
      }
    };
  }

  if (url.includes('/api/tasks/assignment')) {
    return {
      questions: [
        { question: 'Which bond is most polar?', options: ['C-H', 'N-H', 'O-H', 'F-H'], correctIndex: 2 },
        { question: 'What is the electron geometry of CO2?', options: ['Tetrahedral', 'Trigonal planar', 'Linear', 'Bent'], correctIndex: 2 },
        { question: 'Which type of bond shares two electron pairs?', options: ['Single', 'Double', 'Ionic', 'Hydrogen'], correctIndex: 1 }
      ]
    };
  }

  if (url.includes('/api/tasks/submit-assignment')) {
    try {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const total = Number(body.total || 3);
      const score = Number(body.score || total);
      const passed = score >= Math.ceil(total * 0.7);
      return {
        passed,
        score,
        total_count: total,
        completed_count: total,
        message: passed ? 'Nice work — you passed the demo assignment!' : 'Almost there — review the concept and try again.'
      };
    } catch (err) {
      return {
        passed: true,
        score: 3,
        total_count: 3,
        completed_count: 3,
        message: 'Demo assignment completed.'
      };
    }
  }

  return { message: 'Demo response: no real API call made.' };
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (isDemoMode && localStorage.getItem('demoUser')) return 'demo-token';
    return localStorage.getItem('studymentor_token');
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemoMode) {
      const demoRaw = localStorage.getItem('demoUser');
      if (demoRaw) {
        try {
          const demo = JSON.parse(demoRaw);
          setUser(demo);
          setToken('demo-token');
        } catch (err) {
          console.warn('Failed to parse demoUser', err);
          localStorage.removeItem('demoUser');
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
      return;
    }

    if (token) {
      localStorage.setItem('studymentor_token', token);
      fetchUser(token);
    } else {
      localStorage.removeItem('studymentor_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async (authToken) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!res.ok) throw new Error('Auth failed');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    if (isDemoMode) {
      localStorage.setItem('demoUser', JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
      setToken('demo-token');
      setLoading(false);
      return { user: DEMO_USER };
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (email, password, name) => {
    if (isDemoMode) {
      localStorage.setItem('demoUser', JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
      setToken('demo-token');
      setLoading(false);
      return { user: DEMO_USER };
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    if (isDemoMode) {
      localStorage.removeItem('demoUser');
    }
    localStorage.removeItem('studymentor_token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const apiRequest = async (url, options = {}) => {
    if (isDemoMode) {
      return mockApiRequest(url, options);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      logout();
      throw new Error('Session expired');
    }

    if (res.status === 403) {
      navigate('/upgrade');
      throw new Error('Upgrade required');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout, apiRequest, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
