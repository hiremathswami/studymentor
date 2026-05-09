import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './TaskAssignmentModal.css';

export default function TaskAssignmentModal({ isOpen, onClose, task, subject, onComplete }) {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIndex: selectedOptionIndex }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { passed, score, message }

  useEffect(() => {
    if (isOpen && task) {
      setLoading(true);
      setQuestions([]);
      setCurrentIdx(0);
      setAnswers({});
      setResult(null);
      
      apiRequest('/api/tasks/assignment', {
        method: 'POST',
        body: JSON.stringify({ taskTitle: task.task || task.title, subject })
      })
      .then(res => {
        if (res.questions) setQuestions(res.questions);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load assignment:", err);
        setLoading(false);
      });
    }
  }, [isOpen, task, subject]); // eslint-disable-line

  if (!isOpen) return null;

  const handleSelectOption = (qIdx, optIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) score++;
    });

    try {
      const res = await apiRequest('/api/tasks/submit-assignment', {
        method: 'POST',
        body: JSON.stringify({
          taskId: task.id,
          score,
          total: questions.length,
          topic: task.task || task.title
        })
      });

      setResult({
        passed: res.passed,
        score,
        message: res.message || 'Task completed successfully!'
      });

      if (res.passed) {
        onComplete(task.id, res.completed_count, res.total_count);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content assignment-modal">
        <button className="modal-close" onClick={onClose}>
          <span className="material-symbols-rounded">close</span>
        </button>

        <h2>Task Assignment</h2>
        <p className="subtitle">Topic: {task?.task || task?.title}</p>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Generating questions with AI...</p>
          </div>
        ) : result ? (
          <div className="result-state">
            <div className={`result-icon ${result.passed ? 'passed' : 'failed'}`}>
              <span className="material-symbols-rounded">
                {result.passed ? 'celebration' : 'sentiment_dissatisfied'}
              </span>
            </div>
            <h3>{result.passed ? 'Task Complete!' : 'Not Quite There'}</h3>
            <p className="score-text">You scored {result.score} / {questions.length}</p>
            <p className="result-message">{result.message}</p>
            
            {result.passed ? (
              <button className="btn btn-primary" onClick={onClose}>Close & Continue</button>
            ) : (
              <button className="btn btn-secondary" onClick={() => {
                setResult(null);
                setAnswers({});
                setCurrentIdx(0);
              }}>Try Again</button>
            )}
          </div>
        ) : questions.length > 0 ? (
          <div className="quiz-container">
            <div className="quiz-progress">
              Question {currentIdx + 1} of {questions.length}
            </div>
            
            <div className="question-block">
              <h3>{questions[currentIdx].question}</h3>
              <div className="options-list">
                {questions[currentIdx].options.map((opt, idx) => (
                  <label key={idx} className={`option-label ${answers[currentIdx] === idx ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name={`q-${currentIdx}`} 
                      value={idx} 
                      checked={answers[currentIdx] === idx}
                      onChange={() => handleSelectOption(currentIdx, idx)} 
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="quiz-footer">
              <button className="btn btn-secondary" onClick={handlePrev} disabled={currentIdx === 0}>
                Previous
              </button>
              
              {currentIdx === questions.length - 1 ? (
                <button 
                  className="btn btn-primary" 
                  onClick={handleSubmit} 
                  disabled={submitting || Object.keys(answers).length < questions.length}
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              ) : (
                <button 
                  className="btn btn-primary" 
                  onClick={handleNext}
                  disabled={answers[currentIdx] === undefined}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="error-state">Failed to load assignment.</div>
        )}
      </div>
    </div>
  );
}
