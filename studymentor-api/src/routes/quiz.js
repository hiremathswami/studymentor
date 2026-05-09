/**
 * @file src/routes/quiz.js
 * @description POST /api/quiz/generate & POST /api/quiz/submit
 */

const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { askClaudeJSON } = require('../lib/claude');
const requireAuth = require('../middleware/auth');

/**
 * POST /api/quiz/generate
 */
router.post('/generate', requireAuth, async (req, res) => {
  const { topic, taskId } = req.body;

  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  const prompt = `Generate exactly 10 multiple-choice quiz questions on "${topic}".
  Return JSON:
  {
    "questions": [
      {
        "id": 1,
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "correct": 0,
        "explanation": "why this is correct"
      }
    ]
  }
  Mix difficulty (3 easy, 5 medium, 2 hard). Include 'why correct' explanations.`;

  try {
    const quizData = await askClaudeJSON(prompt, "You are an academic examiner.");

    // Save to database
    const { data: savedQuiz, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: req.user.id,
        topic,
        questions_json: quizData.questions,
        score: null, // Pending submission
      })
      .select()
      .single();

    if (error) throw error;

    // Return questions without 'correct' indices
    const safeQuestions = quizData.questions.map(({ correct, explanation, ...q }) => q);

    res.status(200).json({ quizId: savedQuiz.id, questions: safeQuestions });
  } catch (err) {
    console.error(`[Quiz Generate] Error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/quiz/submit
 */
router.post('/submit', requireAuth, async (req, res) => {
  const { quizId, answers, taskId } = req.body;

  try {
    // 1. Fetch quiz
    const { data: quiz, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('id', quizId)
      .eq('user_id', req.user.id)
      .single();

    if (error) return res.status(404).json({ error: 'Quiz not found' });

    // 2. Calculate score
    const questions = quiz.questions_json;
    let score = 0;
    const weakAreas = [];

    answers.forEach((ans, index) => {
      if (ans === questions[index].correct) {
        score++;
      } else {
        weakAreas.push(questions[index].topic || 'General'); // Assuming questions might have topics
      }
    });

    const passed = score >= 8;

    // 3. Update result
    const { error: updateError } = await supabase
      .from('quiz_results')
      .update({
        score,
        total: 10,
        passed,
        weak_areas: weakAreas
      })
      .eq('id', quizId);

    if (updateError) throw updateError;

    // 4. If passed, mark task complete
    if (passed && taskId) {
      await supabase.rpc('mark_task_complete_by_id', { u_id: req.user.id, t_id: taskId });
    }

    res.status(200).json({ 
      score, 
      total: 10, 
      passed, 
      correct_answers: questions.map(q => q.correct),
      explanations: questions.map(q => q.explanation),
      weak_areas: [...new Set(weakAreas)]
    });
  } catch (err) {
    console.error(`[Quiz Submit] Error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
