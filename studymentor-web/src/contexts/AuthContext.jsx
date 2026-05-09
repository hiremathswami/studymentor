import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('studymentor_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
      // Don't logout in mock mode — set fallback user
      setUser({ name: 'Student', email: 'demo@student.edu', plan: 'free' });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
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
    setToken(null);
    navigate('/login');
  };

  const apiRequest = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    
    // For FormData, let browser set Content-Type
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
    <AuthContext.Provider value={{ token, user, loading, login, register, logout, apiRequest }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
