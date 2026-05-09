import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Tutor() {
  const { apiRequest } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState('intermediate');
  const [image, setImage] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Gibbs Free Energy explained...', time: '2 hours ago' },
    { id: 2, title: 'Calculus limits tutorial', time: 'Yesterday' },
    { id: 3, title: 'Spanish verb conjugation', time: 'Oct 12' },
  ]);
  const [currentTopic, setCurrentTopic] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
      setImage(file);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    const userMsg = input.trim();
    const newMessages = [...messages];
    if (userMsg) newMessages.push({ id: Date.now(), role: 'user', content: userMsg });
    if (image) newMessages.push({ id: Date.now() + 1, role: 'user', content: `📎 ${image.name}`, isFile: true });

    setMessages(newMessages);
    setInput('');
    setLoading(true);
    if (!currentTopic && userMsg) setCurrentTopic(userMsg.slice(0, 40));

    try {
      const formData = new FormData();
      formData.append('prompt', userMsg);
      formData.append('level', level);
      if (image) formData.append('image', image);

      const response = await apiRequest('/api/explain', { method: 'POST', body: formData });
      const exp = response.explanation;

      // Build structured AI message
      const aiContent = typeof exp === 'object' ? exp : { summary: String(exp), explanation: '', key_points: [], related_topics: [] };
      setMessages([...newMessages, { id: Date.now() + 2, role: 'ai', structured: aiContent }]);
    } catch (err) {
      setMessages([...newMessages, { id: Date.now() + 2, role: 'ai', content: `I couldn't process that right now. ${err.message}` }]);
    } finally {
      setLoading(false);
      setImage(null);
    }
  };

  const newChat = () => {
    if (messages.length > 0 && currentTopic) {
      setChatHistory(prev => [{ id: Date.now(), title: currentTopic + '...', time: 'Just now' }, ...prev]);
    }
    setMessages([]);
    setCurrentTopic('');
  };

  return (
    <div className="tutor-page">
      {/* Sidebar */}
      <aside className="tutor-sidebar">
        <button className="new-chat-btn" onClick={newChat}>
          <span className="material-symbols-rounded">add</span> New Chat
        </button>
        <div className="chat-history">
          <span className="chat-history-label">RECENT</span>
          {chatHistory.map(ch => (
            <div key={ch.id} className="chat-history-item">
              <span className="ch-title">{ch.title}</span>
              <span className="ch-time">{ch.time}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat */}
      <div className="tutor-main">
        {/* Top Bar */}
        <div className="tutor-topbar">
          <div className="tutor-topbar-left">
            <h2>AI Tutor</h2>
            {currentTopic && <span className="tutor-topic-label">{currentTopic.toUpperCase()}</span>}
          </div>
          <div className="tutor-topbar-right">
            <div className="level-selector">
              {['eli5', 'beginner', 'intermediate', 'expert'].map(l => (
                <button key={l} className={`level-pill ${level === l ? 'active' : ''}`} onClick={() => setLevel(l)}>
                  {l === 'eli5' ? 'ELI5' : l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
            <button className="btn btn-ghost" onClick={() => setMessages([])}>
              <span className="material-symbols-rounded">delete_sweep</span> Clear
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="tutor-messages">
          {messages.length === 0 && (
            <div className="tutor-empty">
              <span className="material-symbols-rounded" style={{ fontSize: 48, color: 'var(--primary)', marginBottom: 16 }}>school</span>
              <h3>Ask me anything</h3>
              <p>I can explain concepts, solve problems, and help you understand any topic.</p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`tutor-msg ${msg.role}`}>
              {msg.role === 'ai' && (
                <div className="tutor-ai-avatar">
                  <span className="material-symbols-rounded">psychology</span>
                </div>
              )}
              <div className={`tutor-bubble ${msg.role}`}>
                {msg.role === 'user' && <p>{msg.content}</p>}
                {msg.role === 'ai' && msg.structured && (
                  <div className="structured-response">
                    {msg.structured.summary && (
                      <>
                        <span className="sr-label">SUMMARY</span>
                        <h3 className="sr-summary">{msg.structured.summary}</h3>
                      </>
                    )}
                    {msg.structured.explanation && (
                      <>
                        <span className="sr-label">EXPLANATION</span>
                        <div className="sr-explanation">{msg.structured.explanation}</div>
                      </>
                    )}
                    {msg.structured.analogy && (
                      <div className="sr-analogy">
                        <em><strong>Think of it like this:</strong> {msg.structured.analogy}</em>
                      </div>
                    )}
                    {msg.structured.key_points?.length > 0 && (
                      <>
                        <span className="sr-label">KEY POINTS</span>
                        <ul className="sr-keypoints">
                          {msg.structured.key_points.map((kp, i) => (
                            <li key={i}><span className="material-symbols-rounded" style={{ fontSize: 16, color: 'var(--primary)' }}>check_circle</span> {kp}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {msg.structured.related_topics?.length > 0 && (
                      <>
                        <span className="sr-label">RELATED CONCEPTS</span>
                        <div className="sr-related">
                          {msg.structured.related_topics.map((rt, i) => <span key={i} className="related-tag">{rt}</span>)}
                        </div>
                      </>
                    )}
                    <div className="sr-actions">
                      <button title="Like"><span className="material-symbols-rounded">thumb_up</span></button>
                      <button title="Dislike"><span className="material-symbols-rounded">thumb_down</span></button>
                      <button title="Regenerate"><span className="material-symbols-rounded">refresh</span> Regenerate</button>
                      <div style={{ flex: 1 }}></div>
                      <button title="Copy"><span className="material-symbols-rounded">content_copy</span></button>
                      <button title="Bookmark"><span className="material-symbols-rounded">bookmark</span></button>
                    </div>
                  </div>
                )}
                {msg.role === 'ai' && msg.content && !msg.structured && <p>{msg.content}</p>}
              </div>
            </div>
          ))}

          {loading && (
            <div className="tutor-msg ai">
              <div className="tutor-ai-avatar"><span className="material-symbols-rounded">psychology</span></div>
              <div className="tutor-bubble ai">
                <div className="typing-indicator"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="tutor-input-area">
          {image && (
            <div className="tutor-file-preview">
              <span className="material-symbols-rounded">image</span> {image.name}
              <span className="material-symbols-rounded remove-file" onClick={() => setImage(null)}>close</span>
            </div>
          )}
          <form className="tutor-input-form" onSubmit={handleSend}>
            <label className="tutor-attach-btn">
              <span className="material-symbols-rounded">attach_file</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            </label>
            <label className="tutor-attach-btn">
              <span className="material-symbols-rounded">photo_camera</span>
              <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleImageChange} />
            </label>
            <input
              type="text"
              className="tutor-text-input"
              placeholder="Ask Mentor anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="tutor-send-btn" disabled={loading || (!input.trim() && !image)}>
              <span className="material-symbols-rounded">send</span>
            </button>
          </form>
          <p className="tutor-footer-text">POWERED BY NVIDIA AI · MENTOR LEARNS WITH EACH ANSWER</p>
        </div>
      </div>
    </div>
  );
}
