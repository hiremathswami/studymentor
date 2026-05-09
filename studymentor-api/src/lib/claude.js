/**
 * @file src/lib/claude.js
 * @description OpenAI wrapper for AI operations, connecting to NVIDIA NIM.
 * Kept the file name 'claude.js' to prevent import breaks across the application.
 * Model: NVIDIABuild-Autogen-39
 */

const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173', // Optional, for including your app on openrouter.ai rankings.
    'X-Title': 'StudyMentor', // Optional. Shows in rankings on openrouter.ai.
  }
});

const MODEL = 'openai/gpt-4o-mini';
const VISION_MODEL = 'openai/gpt-4o-mini';

/**
 * Standard one-shot call
 */
async function askClaude(prompt, systemMsg = '', maxTokens = 2000) {
  try {
    const messages = [];
    if (systemMsg) {
      messages.push({ role: 'system', content: systemMsg });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error('NVIDIA AI error:', err.message);
    throw new Error('AI service temporarily unavailable');
  }
}

/**
 * Vision support — pass base64 image
 */
async function askClaudeWithImage(prompt, base64Image, mimeType, systemMsg = '') {
  try {
    const messages = [];
    if (systemMsg) {
      messages.push({ role: 'system', content: systemMsg });
    }
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
      ]
    });

    const response = await openai.chat.completions.create({
      model: VISION_MODEL,
      messages,
      max_tokens: 2000,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error('NVIDIA AI Vision error:', err.message);
    throw new Error('AI vision service unavailable');
  }
}

/**
 * Streaming for chat UX
 */
async function streamClaude(prompt, systemMsg, onChunk) {
  try {
    const messages = [];
    if (systemMsg) {
      messages.push({ role: 'system', content: systemMsg });
    }
    messages.push({ role: 'user', content: prompt });

    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 2000,
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        onChunk(chunk.choices[0].delta.content);
      }
    }
  } catch (err) {
    console.error('NVIDIA AI Stream error:', err.message);
    throw new Error('AI streaming service unavailable');
  }
}

/**
 * JSON-mode helper — wraps prompt to force JSON output + parses safely
 */
async function askClaudeJSON(prompt, systemMsg) {
  try {
    const messages = [];
    if (systemMsg) {
      messages.push({ role: 'system', content: systemMsg });
    }
    messages.push({ role: 'user', content: prompt + '\n\nIMPORTANT: Return ONLY a valid JSON object. No other text.' });

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });
    const text = response.choices[0].message.content;
    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error('AI returned invalid JSON');
    }
  } catch (err) {
    console.error('NVIDIA AI JSON error:', err.message);
    throw new Error(`AI returned invalid JSON: ${err.message}`);
  }
}

module.exports = { askClaude, askClaudeWithImage, streamClaude, askClaudeJSON };
