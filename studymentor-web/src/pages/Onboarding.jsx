import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    goals: '',
    weak_areas: '',
    pace: '',
    weeks: ''
  });
  
  const { apiRequest } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Map frontend state to backend expected format
    let hoursPerDay = 2;
    if (formData.pace.includes('3-4')) hoursPerDay = 4;
    if (formData.pace.includes('5+')) hoursPerDay = 6;
    
    const payload = {
      subject: formData.subject,
      goal: formData.goals,
      level: 'intermediate', // Default since UI doesn't ask
      weeks: formData.weeks,
      hoursPerDay: hoursPerDay,
      weakTopics: formData.weak_areas ? formData.weak_areas.split(',').map(s => s.trim()) : []
    };

    try {
      await apiRequest('/api/onboarding', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showToast('Study plan generated successfully!', 'success');
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div className="spinner" style={{ marginBottom: '24px' }}></div>
        <h2>Generating your study plan...</h2>
        <p style={{ color: 'var(--on-surface-variant)', marginTop: '8px' }}>AI is analyzing your goals and configuring the curriculum.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '40px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '40px' }}>
        
        <div className="progress-dots">
          {[1,2,3,4].map(i => (
            <div key={i} className={`dot ${step >= i ? 'active' : ''}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="onboarding-step active">
            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>What are you studying?</h2>
            <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '32px' }}>This helps the AI tailor your explanations.</p>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. AP Calculus BC, Organic Chemistry II" 
              value={formData.subject}
              onChange={e => updateForm('subject', e.target.value)}
              style={{ marginBottom: '32px' }}
            />
            <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }} onClick={handleNext} disabled={!formData.subject}>Next Step</button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step active">
            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>What are your goals?</h2>
            <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '32px' }}>Tell us what you want to achieve.</p>
            <textarea 
              className="input-field" 
              placeholder="e.g. I want to get an A on my final exam next month." 
              rows="4"
              value={formData.goals}
              onChange={e => updateForm('goals', e.target.value)}
              style={{ marginBottom: '16px', resize: 'vertical' }}
            ></textarea>
            
            <label className="input-label" style={{ marginTop: '24px', marginBottom: '12px' }}>Any specific weak areas?</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Integration by parts, SN2 reactions" 
              value={formData.weak_areas}
              onChange={e => updateForm('weak_areas', e.target.value)}
              style={{ marginBottom: '32px' }}
            />
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '14px' }} onClick={handlePrev}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: '14px' }} onClick={handleNext} disabled={!formData.goals}>Next Step</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step active">
            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Select your pace</h2>
            <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '32px' }}>How intensely do you want to study?</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {['Relaxed (1-2 hrs/day)', 'Moderate (3-4 hrs/day)', 'Intense (5+ hrs/day)'].map(pace => (
                <div 
                  key={pace}
                  className={`card ${formData.pace === pace ? 'selected' : ''}`}
                  style={{ 
                    cursor: 'pointer', 
                    padding: '16px', 
                    border: formData.pace === pace ? '2px solid var(--primary)' : '2px solid transparent' 
                  }}
                  onClick={() => updateForm('pace', pace)}
                >
                  <h4 style={{ margin: 0 }}>{pace}</h4>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '14px' }} onClick={handlePrev}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: '14px' }} onClick={handleNext} disabled={!formData.pace}>Next Step</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="onboarding-step active">
            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>How long will you study?</h2>
            <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', marginBottom: '32px' }}>Select the number of weeks for your plan.</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
              {[2, 4, 8, 12].map(w => (
                <div 
                  key={w}
                  className={`card ${formData.weeks === w ? 'selected' : ''}`}
                  style={{ 
                    cursor: 'pointer', 
                    padding: '16px', 
                    border: formData.weeks === w ? '2px solid var(--primary)' : '2px solid transparent',
                    minWidth: '100px',
                    textAlign: 'center'
                  }}
                  onClick={() => updateForm('weeks', w)}
                >
                  <h3 style={{ margin: 0 }}>{w}</h3>
                  <p style={{ margin: 0, color: 'var(--on-surface-variant)' }}>Weeks</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '14px' }} onClick={handlePrev}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: '14px' }} onClick={handleSubmit} disabled={!formData.weeks}>Complete Setup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
