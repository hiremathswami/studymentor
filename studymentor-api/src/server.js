/**
 * @file src/server.js
 * @description Express entry point — middleware, routes, and static files.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for easier dev with CDN assets
}));
app.use(cors());

// Parse JSON for all routes EXCEPT the webhook (which needs raw body)
app.use((req, res, next) => {
  if (req.path === '/api/billing/webhook') return next();
  express.json()(req, res, next);
});
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Static files (Stitch frontend)
app.use(express.static(path.join(__dirname, '../public')));

// ── API Routes ──────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/onboarding', require('./routes/onboarding'));
app.use('/api/plan',       require('./routes/plan').router);
app.use('/api/tasks',      require('./routes/tasks'));
app.use('/api/explain',    require('./routes/explain'));
app.use('/api/chatbot',    require('./routes/chatbot'));
app.use('/api/quiz',       require('./routes/quiz'));
app.use('/api/progress',   require('./routes/progress'));
app.use('/api/user/theme', require('./routes/theme'));
app.use('/api/billing',    require('./routes/billing'));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${err.stack}`);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 StudyMentor API is running on http://localhost:${PORT}`);
});

module.exports = app;
