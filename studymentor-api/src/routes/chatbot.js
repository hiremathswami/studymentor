/**
 * @file src/routes/chatbot.js
 * @description POST /api/chatbot - Public tour guide mentor for the homepage.
 */

const express = require('express');
const router = express.Router();
const { askClaude } = require('../lib/claude');
const rateLimit = require('../middleware/rateLimit');

/**
 * POST /api/chatbot
 */
router.post('/', rateLimit(30, 60 * 60 * 1000), async (req, res) => {
  const { message, history } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  const systemMsg = `You are 'Mentor', the friendly AI tour guide for StudyMentor AI's homepage.
You help visitors understand the product. Be warm, concise, helpful.

About StudyMentor AI:
- AI-powered personal study coach
- Generates personalized study plans (Claude AI)
- Daily tasks adapted to student's pace
- AI tutor for any subject (ELI5 → Expert)
- Photo homework help
- Smart quizzes after every task
- Progress tracking with streaks
- Plans: Free / $9 Pro / $29 Team

When asked about features, costs, or how it works, give brief helpful answers (max 3 sentences). Always end with a soft CTA.

If asked to scroll/show something, respond with a JSON action:
{ "reply": "Sure! Showing you the pricing section.", "action": "scroll", "target": "pricing" }
Otherwise just: { "reply": "..." }

Available scroll targets: hero, features, how-it-works, pricing, faq, testimonials`;

  try {
    // Build context from history
    const context = history ? history.slice(-5).map(h => `${h.role}: ${h.content}`).join('\n') : '';
    const fullPrompt = context ? `${context}\nuser: ${message}` : message;

    const responseText = await askClaude(fullPrompt, systemMsg);

    // Try to parse as JSON for actions
    try {
      const jsonResponse = JSON.parse(responseText);
      return res.status(200).json(jsonResponse);
    } catch {
      // Fallback to text
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return res.status(200).json(JSON.parse(match[0]));
        } catch {}
      }
      return res.status(200).json({ reply: responseText });
    }
  } catch (err) {
    console.error(`[Chatbot] Error: ${err.message}`);
    res.status(500).json({ error: 'Mentor is taking a short break' });
  }
});

module.exports = router;
