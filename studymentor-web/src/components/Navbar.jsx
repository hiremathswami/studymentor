import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/plan', icon: 'calendar_month', label: 'Study Plan' },
    { to: '/tutor', icon: 'psychology', label: 'AI Tutor' },
    { to: '/progress', icon: 'insights', label: 'Analytics' },
  ];

  return (
    <nav className="top-navbar">
      <div className="nav-left">
        <Link to="/dashboard" className="nav-logo">
          <div className="nav-logo-icon">S</div>
          <span>StudyMentor AI</span>
        </Link>
        <div className="nav-links">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="material-symbols-rounded">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="nav-right">
        <div className="nav-search">
          <span className="material-symbols-rounded search-icon">search</span>
          <input type="text" placeholder="Search resources..." />
        </div>

        <button className="nav-icon-btn" onClick={toggleTheme} title="Toggle theme">
          <span className="material-symbols-rounded">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <div className="nav-user" onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="nav-user-info">
            <span className="nav-user-name">{user?.name || 'Student'}</span>
            <span className={`nav-plan-badge ${user?.plan === 'pro' ? 'pro' : 'free'}`}>
              {user?.plan === 'pro' ? 'PRO' : 'FREE PLAN'}
            </span>
          </div>
          <div className="nav-avatar">
            {user?.name ? user.name[0].toUpperCase() : 'S'}
          </div>
        </div>

        {showUserMenu && (
          <div className="nav-dropdown" onMouseLeave={() => setShowUserMenu(false)}>
            <Link to="/upgrade" className="nav-dropdown-item">
              <span className="material-symbols-rounded">workspace_premium</span>
              Upgrade to Pro
            </Link>
            <div className="nav-dropdown-item" onClick={logout}>
              <span className="material-symbols-rounded">logout</span>
              Sign Out
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
