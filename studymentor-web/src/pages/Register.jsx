import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, name);
      showToast('Account created successfully!', 'success');
      navigate('/onboarding');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Brand Panel */}
      <div style={{ flex: 1, background: 'var(--inverse-surface)', padding: '60px', color: 'var(--inverse-on-surface)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="logo" style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 'auto', color: 'white' }}>StudyMentor AI</div>
          
          <div style={{ marginTop: 'auto', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2, color: 'white' }}>Join the future of learning.</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ color: 'white', marginBottom: '4px' }}>98%</h4>
                <div style={{ fontSize: '13px', opacity: 0.7 }}>Report better grades</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ color: 'white', marginBottom: '4px' }}>2.5x</h4>
                <div style={{ fontSize: '13px', opacity: 0.7 }}>Faster concept mastery</div>
              </div>
            </div>

            <p style={{ opacity: 0.7, fontSize: '14px', marginBottom: '16px' }}>TRUSTED BY STUDENTS AT</p>
            <div style={{ display: 'flex', gap: '24px', opacity: 0.5 }}>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>STANFORD</div>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>MIT</div>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>HARVARD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ marginBottom: '8px' }}>Create an account</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '32px' }}>Start your personalized learning journey today.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label className="input-label">Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Jane Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required 
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="input-label">Email address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="jane@student.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label className="input-label">Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
                minLength="6"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--on-surface-variant)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
