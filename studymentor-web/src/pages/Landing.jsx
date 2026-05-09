import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [billing, setBilling] = useState('monthly');

  return (
    <>
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo" style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '20px' }}>
            StudyMentor AI
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <header style={{ 
        padding: '160px 40px 80px', 
        textAlign: 'center', 
        background: 'var(--gradient-hero)',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          
          <div style={{ textAlign: 'left' }}>
            <div className="badge badge-pro" style={{ marginBottom: '24px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '14px', marginRight: '4px' }}>auto_awesome</span>
              POWERED BY CLAUDE AI
            </div>
            
            <h1 className="hero-h1" style={{ fontFamily: '"Playfair Display", serif', marginBottom: '24px', color: 'var(--on-surface)' }}>
              Master Any Subject with <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>AI-Powered</span> Mentorship
            </h1>
            
            <p style={{ fontSize: '20px', color: 'var(--on-surface-variant)', marginBottom: '40px', maxWidth: '500px', lineHeight: 1.6 }}>
              Upload your syllabus, snap photos of complex problems, and get personalized study plans that adapt to how you learn best.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Learning Free
                <span className="material-symbols-rounded">arrow_forward</span>
              </Link>
              <a href="#demo" className="btn btn-secondary btn-lg">
                View Demo
              </a>
            </div>
            
            <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
              <div style={{ display: 'flex' }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="material-symbols-rounded" style={{ color: '#fbbf24', fontSize: '20px' }}>star</span>
                ))}
              </div>
              <p>Trusted by 10,000+ top students worldwide</p>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', inset: '-20px', 
              background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
              filter: 'blur(40px)', opacity: 0.15, borderRadius: '50%'
            }}></div>
            <img src="/hero-student.png" alt="Student using StudyMentor AI" style={{ position: 'relative', zIndex: 1, borderRadius: '24px', boxShadow: 'var(--shadow-xl)' }} />
          </div>

        </div>
      </header>

      <section style={{ padding: 'var(--section-padding)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ marginBottom: '16px' }}>Your Personalized Academic Toolkit</h2>
            <p style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', margin: '0 auto' }}>Everything you need to study smarter, not harder.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface-container)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '28px' }}>calendar_month</span>
              </div>
              <h3 style={{ marginBottom: '12px' }}>Adaptive Study Plans</h3>
              <p style={{ color: 'var(--on-surface-variant)' }}>Upload your syllabus and let AI break it down into daily, manageable tasks optimized for your exam dates.</p>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface-container)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '28px' }}>school</span>
              </div>
              <h3 style={{ marginBottom: '12px' }}>Concept Explainer</h3>
              <p style={{ color: 'var(--on-surface-variant)' }}>Stuck on a concept? Get it explained like you're 5, or dive deep with university-level academic breakdowns.</p>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface-container)', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '28px' }}>psychology</span>
              </div>
              <h3 style={{ marginBottom: '12px' }}>Smart Quizzing</h3>
              <p style={{ color: 'var(--on-surface-variant)' }}>The AI generates practice questions based on your weak areas to ensure complete mastery before test day.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" style={{ padding: 'var(--section-padding)', background: 'var(--background)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ marginBottom: '16px' }}>See StudyMentor in Action</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--outline-variant)' }}>
              <img src="/dashboard-preview.png" alt="Dashboard Preview" />
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-rounded">person</span>
                </div>
                <div style={{ background: 'var(--surface-container-low)', padding: '16px', borderRadius: '16px', borderTopLeftRadius: '0' }}>
                  <p>Can you explain how backpropagation works in neural networks? I have a final tomorrow and I'm totally lost.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-rounded">auto_awesome</span>
                </div>
                <div style={{ background: 'var(--surface-container)', padding: '16px', borderRadius: '16px', borderTopLeftRadius: '0' }}>
                  <p style={{ marginBottom: '12px' }}>Don't panic! Let's break it down simply.</p>
                  <p>Imagine you're blindfolded on a mountain trying to find the lowest valley. You take a step, feel which way is downhill, and move that way. <strong>Backpropagation</strong> is the math that tells the neural network which way is "downhill" so it can fix its mistakes and learn the right answer.</p>
                  <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Generate Practice Quiz →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--section-padding)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px' }}>The Road to Mastery</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '60px' }}>
            {[
              { num: '01', title: 'Upload', desc: 'Drop your syllabus or textbook PDF.' },
              { num: '02', title: 'Plan', desc: 'Get a custom daily schedule.' },
              { num: '03', title: 'Learn', desc: 'Chat with your AI tutor anytime.' },
              { num: '04', title: 'Ace', desc: 'Walk into your exam with 100% confidence.' }
            ].map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--surface-container-high)', marginBottom: '16px', fontFamily: '"Playfair Display", serif' }}>{step.num}</div>
                <h4 style={{ marginBottom: '8px' }}>{step.title}</h4>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>{step.desc}</p>
                {i < 3 && <div style={{ position: 'absolute', top: '30px', right: '-12px', width: '24px', height: '2px', background: 'var(--outline-variant)' }}></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--section-padding)', background: 'var(--background)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ marginBottom: '16px' }}>Simple, Transparent Pricing</h2>
            <div style={{ display: 'inline-flex', background: 'var(--surface-container-low)', padding: '4px', borderRadius: 'var(--radius-full)' }}>
              <button className={`btn ${billing === 'monthly' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setBilling('monthly')} style={{ borderRadius: 'var(--radius-full)' }}>Monthly</button>
              <button className={`btn ${billing === 'yearly' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setBilling('yearly')} style={{ borderRadius: 'var(--radius-full)' }}>Yearly <span style={{ color: '#10b981', marginLeft: '4px', fontSize: '12px' }}>-20%</span></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
            <div className="card plan-card">
              <h3 style={{ marginBottom: '8px' }}>Basic</h3>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '24px' }}>For casual learners.</p>
              <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px' }}>
                ${billing === 'monthly' ? '0' : '0'}<span style={{ fontSize: '16px', color: 'var(--on-surface-variant)' }}>/mo</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div className="check-item">5 AI Explanations per month</div>
                <div className="check-item">1 Study Plan</div>
                <div className="check-item">Basic Progress Tracking</div>
              </div>
              <Link to="/register" className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>Get Started Free</Link>
            </div>

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
              <Link to="/register" className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>Upgrade to Pro</Link>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--surface)', padding: '60px 40px 24px', borderTop: '1px solid var(--outline-variant)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div className="logo" style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '20px', marginBottom: '16px' }}>StudyMentor AI</div>
            <p style={{ color: 'var(--on-surface-variant)', maxWidth: '300px' }}>Empowering students globally with accessible, personalized AI mentorship.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '16px' }}>Product</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--on-surface-variant)' }}>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '16px' }}>Resources</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--on-surface-variant)' }}>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Study Guides</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '16px' }}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--on-surface-variant)' }}>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--outline)', fontSize: '14px', paddingTop: '24px', borderTop: '1px solid var(--outline-variant)' }}>
          © 2026 StudyMentor AI. All rights reserved.
        </div>
      </footer>
    </>
  );
}
