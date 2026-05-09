import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Upgrade() {
  const [billing, setBilling] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleUpgrade = async (plan) => {
    try {
      setLoading(plan); // Set loading to the specific plan name
      const token = localStorage.getItem('studymentor_token');
      
      const response = await fetch('http://localhost:3000/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          plan, 
          interval: billing 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Error initiating checkout: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ marginBottom: '16px' }}>Upgrade to StudyMentor Pro</h1>
        <p style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', margin: '0 auto', fontSize: '18px' }}>
          Unlock unlimited AI mentorship and take your academic performance to the next level.
        </p>
        
        <div style={{ display: 'inline-flex', background: 'var(--surface-container-low)', padding: '4px', borderRadius: 'var(--radius-full)', marginTop: '32px' }}>
          <button className={`btn ${billing === 'monthly' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setBilling('monthly')} style={{ borderRadius: 'var(--radius-full)' }}>Monthly</button>
          <button className={`btn ${billing === 'yearly' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setBilling('yearly')} style={{ borderRadius: 'var(--radius-full)' }}>Yearly <span style={{ color: '#10b981', marginLeft: '4px', fontSize: '12px' }}>-20%</span></button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="card plan-card featured" style={{ background: 'var(--inverse-surface)', color: 'var(--inverse-on-surface)', transform: 'scale(1.05)' }}>
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gradient-primary)', color: 'white', padding: '4px 16px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>MOST POPULAR</div>
          <h3 style={{ marginBottom: '8px' }}>Pro Student</h3>
          <p style={{ color: '#9aa4b8', marginBottom: '24px' }}>For serious academic success.</p>
          <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px' }}>
            ${billing === 'monthly' ? '15' : '12'}<span style={{ fontSize: '16px', color: '#9aa4b8' }}>/mo</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div className="check-item">Unlimited AI Explanations</div>
            <div className="check-item">Unlimited Study Plans</div>
            <div className="check-item">Image Upload (Math/Diagrams)</div>
            <div className="check-item">Priority Claude 3.5 Access</div>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 'auto' }}
            onClick={() => handleUpgrade('pro')}
            disabled={loading}
          >
            {loading === 'pro' ? 'Redirecting...' : 'Upgrade to Pro'}
          </button>
        </div>

        <div className="card plan-card">
          <h3 style={{ marginBottom: '8px' }}>Study Group</h3>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '24px' }}>For study groups up to 4 people.</p>
          <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px' }}>
            ${billing === 'monthly' ? '39' : '32'}<span style={{ fontSize: '16px', color: 'var(--on-surface-variant)' }}>/mo</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div className="check-item">Everything in Pro</div>
            <div className="check-item">Shared Study Plans</div>
            <div className="check-item">Group Progress Tracking</div>
            <div className="check-item">Collaborative Workspaces</div>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: 'auto' }}
            onClick={() => handleUpgrade('team')}
            disabled={loading}
          >
            {loading === 'team' ? 'Redirecting...' : 'Create Group Plan'}
          </button>
        </div>
      </div>
    </>
  );
}
