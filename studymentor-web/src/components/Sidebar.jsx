import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sidebar">
      <div className="logo">StudyMentor AI</div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-rounded">dashboard</span> Dashboard
        </NavLink>
        <NavLink to="/plan" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-rounded">calendar_month</span> Study Plan
        </NavLink>
        <NavLink to="/tutor" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-rounded">school</span> AI Tutor
        </NavLink>
        <NavLink to="/progress" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-rounded">insights</span> Progress
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-link" onClick={toggleTheme} style={{cursor: 'pointer', marginBottom: '16px'}}>
          <span className="material-symbols-rounded">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span> 
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </div>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name ? user.name[0].toUpperCase() : 'U'}</div>
          <div className="sidebar-user-info">
            {user?.name || 'Student'}
            <small onClick={logout} style={{cursor: 'pointer', color: 'var(--error)'}}>Sign Out</small>
          </div>
        </div>
      </div>
    </div>
  );
}
