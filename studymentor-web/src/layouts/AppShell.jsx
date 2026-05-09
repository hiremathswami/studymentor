import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

export default function AppShell() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div className="spinner"></div>
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>© 2025 StudyMentor AI</span>
        <div className="footer-links">
          <a href="#">Settings</a>
          <a onClick={() => {}} style={{ cursor: 'pointer' }}>Sign Out</a>
        </div>
      </footer>
    </div>
  );
}
