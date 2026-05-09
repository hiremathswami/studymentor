<div align="center">



<img src="blob:https://gemini.google.com/97d703db-0063-40dc-bc32-6d991338ac3b" alt="StudyMentor AI" />

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-6366F1?style=for-the-badge&logoColor=white)](https://studymentor.ai)
[![GitHub Stars](https://img.shields.io/github/stars/hiremathswami/studymentor?style=for-the-badge&color=F59E0B&logo=github)](https://github.com/hiremathswami/studymentor/stargazers)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)
[![Made with Claude](https://img.shields.io/badge/Powered_by-Claude_API-D97706?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com)

<br/>

> **"The AI tutor every student deserves — but couldn't afford. Until now."**

<br/>

![Dashboard Preview](https://raw.githubusercontent.com/hiremathswami/studymentor/main/raw_screens/dashboard.png.png)

</div>
---

## ✨ What is StudyMentor AI?

**StudyMentor AI** is a full-stack AI-powered study companion that acts as your personal tutor, planner, and accountability coach — all in one app.

Most students fail not because they're lazy, but because they have **no structured plan**, **no instant help** when stuck, and **no feedback loop** to know if they actually learned something.

StudyMentor AI fixes all three.

---

## 🎯 Try Live Demo

> **No signup required for the demo!** Experience StudyMentor AI instantly:

### Option 1: Visit the Live App
👉 **[Click here to access StudyMentor AI](https://studymentor.ai)** - Fully functional demo with all features

### Option 2: Local Development
Want to run it locally? Follow the [Quick Start](#-quick-start) guide below to set up the entire stack on your machine.

### Demo Features You Can Try:
- ✅ Create a personalized study plan using AI
- ✅ Get daily AI-generated tasks
- ✅ Take assignment quizzes powered by Claude
- ✅ Test the AI concept explainer
- ✅ View progress tracking and streaks

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 📋 Personalized Study Plans
Claude AI analyzes your subject, goals, level, and available hours — then builds a complete multi-week study roadmap tailored just for you.

</td>
<td width="50%">

### ✅ Daily AI Task Assignment
Every morning, 4 laser-focused tasks are generated based on exactly where you are in your plan. Cached so they load instantly.

</td>
</tr>
<tr>
<td width="50%">

### 🧠 Assignment Quiz After Every Task
Complete a task → Claude generates 10 MCQ questions on that topic. **Score 8/10 to pass.** Fail? The task auto-retasks tomorrow with fresh questions.

</td>
<td width="50%">

### 💡 AI Concept Explainer
Ask anything. Choose your level — ELI5, Beginner, Intermediate, or Expert. Upload a photo of your notes or a PDF — Claude explains it instantly.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Progress & Streak Tracking
Streak calendar, quiz score chart with pass line, activity graph, and a weekly AI-generated summary. Claude keeps you accountable.

</td>
<td width="50%">

### 🔄 Smart Retask System
Scored below 8/10? The system marks the task as failed, inserts it into tomorrow's plan automatically, and generates brand-new questions.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| 🎨 **Frontend** | React.js + CSS |
| ⚡ **Backend** | Node.js + Express.js |
| 🤖 **AI Engine** | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| 🗄️ **Database** | Supabase (PostgreSQL + Auth) |
| 💳 **Payments** | Switch |
| 📁 **File Upload** | Multer + Claude Vision API |
| 🚀 **Deploy** | Vercel / Railway |

</div>

---

## 📸 Screenshots

<div align="center">

| Dashboard | AI Tutor | Assignment Quiz |
|-----------|----------|-----------------|
| ![Dashboard](https://raw.githubusercontent.com/hiremathswami/studymentor/main/raw_screens/dashboard.png.png) | ![AI Tutor](https://raw.githubusercontent.com/hiremathswami/studymentor/main/raw_screens/tutor.png) | ![Quiz](https://raw.githubusercontent.com/hiremathswami/studymentor/main/raw_screens/dashboards.png.png) |

| Study Plan | Progress | Upgrade |
|------------|----------|---------|
| ![Plan](https://raw.githubusercontent.com/hiremathswami/studymentor/main/raw_screens/plan.png.png) | ![Progress](https://raw.githubusercontent.com/hiremathswami/studymentor/main/raw_screens/progress.png) | ![Upgrade](https://raw.githubusercontent.com/hiremathswami/studymentor/main/raw_screens/upgrade.png) |

| Stitch Study Plan (New) |
|--------------------------|
| ![Stitch Plan](https://raw.githubusercontent.com/hiremathswami/studymentor/main/raw_screens/plan.png.png) |

</div>

## 🏗️ Project Structure

```
studymentor/
├── studymentor-web/          # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudyPlan.jsx
│   │   │   ├── AITutor.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Upgrade.jsx
│   │   ├── components/
│   │   └── App.jsx
│   └── public/
│
├── studymentor-api/          # Node.js + Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js       # Register & login
│   │   │   ├── plan.js       # Claude study plan generation
│   │   │   ├── tasks.js      # Daily task management
│   │   │   ├── assignments.js # Quiz generation + grading
│   │   │   ├── explain.js    # AI concept explainer + file upload
│   │   │   ├── progress.js   # Analytics & streaks
│   │   │   └── billing.js    # Switch payments
│   │   ├── middleware/
│   │   │   ├── auth.js       # JWT verification
│   │   │   └── planGate.js   # Free vs Pro gating
│   │   └── lib/
│   │       ├── claude.js     # Anthropic SDK wrapper
│   │       └── supabase.js   # Database client
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- Supabase account
- Anthropic API key

### 1. Clone the repo

```bash
git clone https://github.com/hiremathswami/studymentor.git
cd studymentor
```

### 2. Setup the backend

```bash
cd studymentor-api
npm install
cp .env.example .env
```

Fill in your `.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
ANTHROPIC_API_KEY=your_claude_api_key
SWITCH_SECRET_KEY=your_switch_key
PORT=3000
```

### 3. Setup the database

Go to your Supabase SQL Editor and run:

```sql
-- Users, study plans, daily tasks, progress logs,
-- explanations, and assignments tables
-- Full schema in /studymentor-api/database/schema.sql
```

### 4. Seed demo data

```bash
node src/seed.js
# ✅ Demo ready: demo@studymentor.ai / demo1234
```

### 5. Start the backend

```bash
npm run dev
# 🚀 API running on http://localhost:3000
```

### 6. Setup and start the frontend

```bash
cd ../studymentor-web
npm install
npm run dev
# 🎓 App running on http://localhost:5173
```

---

## 🔌 API Endpoints

<details>
<summary><b>📋 Auth Routes</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Create new account |
| `POST` | `/api/auth/login` | ❌ | Login — returns JWT token |

</details>

<details>
<summary><b>📚 Study Plan Routes</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/plan/generate` | ✅ | Claude generates personalized plan |
| `GET` | `/api/plan` | ✅ | Fetch current study plan |

</details>

<details>
<summary><b>✅ Task Routes</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/tasks/today` | ✅ | Get today's 4 AI tasks |
| `POST` | `/api/tasks/complete` | ✅ | Mark task complete → triggers quiz |

</details>

<details>
<summary><b>🧠 Assignment Routes</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/assignments/generate` | ✅ | Claude generates 10 MCQs |
| `POST` | `/api/assignments/submit` | ✅ | Grade answers → pass/fail/retask |
| `GET` | `/api/assignments/:id` | ✅ | Get quiz (without correct answers) |

</details>

<details>
<summary><b>💡 Explain Routes</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/explain` | ✅ | Claude explains any concept |
| `POST` | `/api/explain` (with file) | ✅ Pro | Upload photo or PDF — Claude reads it |

</details>

<details>
<summary><b>📊 Progress Routes</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/progress` | ✅ | Stats + logs + Claude summary |
| `GET` | `/api/progress/streak` | ✅ | Current streak count |

</details>

<details>
<summary><b>💳 Billing Routes</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/billing/checkout` | ✅ | Start Switch checkout |
| `POST` | `/api/billing/webhook` | ❌ | Switch calls this on payment |

</details>

<details>
<summary><b>🛠 Dev Routes</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Server health check |
| `GET` | `/api/demo/reset` | ❌ | Reset demo data (dev only) |

</details>

---

## 💰 Pricing Tiers

<div align="center">

| | Free | Student Pro | Team |
|--|------|------------|------|
| **Price** | $0/mo | $9/mo | $29/mo |
| Study plans | 1 | ✅ Unlimited | ✅ Unlimited |
| AI explanations | 5/month | ✅ Unlimited | ✅ Unlimited |
| Assignments | 5/month | ✅ Unlimited | ✅ Unlimited |
| File + photo upload | ❌ | ✅ | ✅ |
| Adaptive re-planning | ❌ | ✅ | ✅ |
| Student seats | 1 | 1 | 10 |
| Teacher dashboard | ❌ | ❌ | ✅ |

</div>

---

## 🗺️ Roadmap

- [x] Personalized study plan generation
- [x] Daily AI task assignment
- [x] Assignment quiz with retask system
- [x] AI concept explainer
- [x] File + photo upload (Claude Vision)
- [x] Progress tracking + streak calendar
- [x] Switch payment integration
- [ ] Voice study mentor (speak your doubt)
- [ ] Emotion detection while studying
- [ ] Mobile app (React Native)
- [ ] College syllabus integration
- [ ] Smart exam prediction
- [ ] AI career mentor

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m 'Add amazing feature'

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

---

## 👨‍💻 Author

<div align="center">

**Rohan Hiremathswami**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/hiremathswami)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/hiremathswami)

*Learning AI APIs and vibe coding — building real projects along the way.*

</div>

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**If this helped you, please give it a ⭐ — it means a lot!**

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=14&pause=1000&color=6366F1&center=true&vCenter=true&width=500&lines=Built+with+❤️+and+Claude+AI;Learning+in+public.+Building+in+public." alt="footer" />

</div>
