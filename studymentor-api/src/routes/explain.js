/**
 * @file src/routes/explain.js
 * @description POST /api/explain - AI-powered tiered explanations with vision support.
 */

const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { askClaudeJSON, askClaudeWithImage } = require('../lib/claude');
const upload = require('../lib/upload');
const requireAuth = require('../middleware/auth');
const fs = require('fs');

/**
 * POST /api/explain
 */
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  const { topic, level, subject, question, prompt } = req.body;
  // Frontend sends 'prompt' — use it as fallback for topic/question
  const resolvedTopic = topic || prompt || question || 'General Query';
  const image = req.file;

  try {
    // 1. Fetch user to check plan and limit
    const { data: user } = await supabase
      .from('users')
      .select('plan, explanation_count')
      .eq('id', req.user.id)
      .single();

    if (user.plan === 'free' && user.explanation_count >= 5) {
      return res.status(403).json({ error: 'Upgrade to Pro to get unlimited explanations' });
    }

    // 2. Map complexity level
    const levelMap = {
      eli5: "explain like I'm 5",
      beginner: "clear and simple",
      intermediate: "deeper, with practical examples",
      expert: "technical, advanced, and rigorous"
    };
    const mappedLevel = levelMap[level] || "clear and simple";

    // 3. Build prompt
    const aiPrompt = `Explain this ${resolvedTopic} for a ${subject || 'general'} student at ${mappedLevel} level.
    ${image ? "The student has also provided an image related to this query." : ""}

    Return JSON:
    {
      "summary": "1-line answer",
      "explanation": "2-3 paragraphs",
      "analogy": "helpful analogy in italics",
      "key_points": ["...", "...", "..."],
      "example": "worked example",
      "related_topics": ["topic1", "topic2", "topic3"]
    }`;

    // 4. Call Claude (with or without image)
    let explanation;
    if (image) {
      const base64Image = fs.readFileSync(image.path).toString('base64');
      explanation = await askClaudeWithImage(aiPrompt, base64Image, image.mimetype, "You are a world-class academic tutor.");
      // We need to parse it manually if it's from askClaudeWithImage as it returns text
      try {
        explanation = JSON.parse(explanation);
      } catch {
        const match = explanation.match(/\{[\s\S]*\}/);
        explanation = match ? JSON.parse(match[0]) : { summary: explanation };
      }
    } else {
      explanation = await askClaudeJSON(aiPrompt, "You are a world-class academic tutor.");
    }

    // 5. Update usage and save history
    await supabase.rpc('increment_explanation_count', { user_id: req.user.id });

    const { data: savedExp } = await supabase
      .from('explanations')
      .insert({
        user_id: req.user.id,
        topic: resolvedTopic,
        level,
        question: resolvedTopic,
        response_json: explanation,
        has_image: !!image
      })
      .select()
      .single();

    res.status(200).json({ explanation: explanation, id: savedExp?.id || null });
  } catch (err) {
    console.error(`[Explain] Error: ${err.message}`);
    res.status(500).json({ error: err.message });
  } finally {
    // Cleanup uploaded file
    if (image) fs.unlinkSync(image.path);
  }
});

module.exports = router;
