import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('demo@student.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Brand Panel */}
      <div style={{ flex: 1, background: 'var(--gradient-primary)', padding: '60px', color: 'white', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="logo" style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 'auto' }}>StudyMentor AI</div>
          
          <div style={{ marginTop: 'auto', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2 }}>Welcome back to smarter learning.</h2>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '24px', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-rounded" style={{ color: '#fbbf24', fontSize: '18px' }}>star</span>)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '16px', opacity: 0.9 }}>"I raised my GPA from 2.8 to 3.8 in one semester. The AI explanations make complex physics actually make sense."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>SJ</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Sarah Jenkins</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Computer Science '26</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ marginBottom: '8px' }}>Sign in to your account</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '32px' }}>Enter your details to access your study plan.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label className="input-label">Email address</label>
              <input 
                type="email" 
                className="input-field" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <input 
                type="password" 
                className="input-field" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--on-surface-variant)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
