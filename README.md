<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=🎓+StudyMentor+AI;Your+Personal+AI+Study+Coach;Built+with+Claude+API" alt="StudyMentor AI" />

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-6366F1?style=for-the-badge&logoColor=white)](https://github.com/hiremathswami/studymentor)
[![GitHub Stars](https://img.shields.io/github/stars/hiremathswami/studymentor?style=for-the-badge&color=F59E0B&logo=github)](https://github.com/hiremathswami/studymentor/stargazers)
[![Claude API](https://img.shields.io/badge/Powered_by-Claude_API-D97706?style=for-the-badge&logoColor=white)](https://anthropic.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-72.1%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](.)
[![CSS](https://img.shields.io/badge/CSS-27.4%25-1572B6?style=for-the-badge&logo=css3)](.)

<br/>

> **"The AI tutor every student deserves — but couldn't afford. Until now."**

</div>

---

## 🖼️ Screenshots

<div align="center">

### 🏠 Homepage
![Homepage](web%20application/stitch/projects/14750634141614937933/screens/9e4b402d96d24129bb978058bc06ffa1)

---

### 📊 Dashboard
![Dashboard](web%20application/stitch/projects/14750634141614937933/screens/5d2400bfc18f41bf82a8ce85a5e6c5e9)

---

### 📋 Study Plan
![Study Plan](<img width="1920" height="1140" alt="Screenshot 2026-05-09 174658" src="https://github.com/user-attachments/assets/d09e7db7-4cd0-4a2e-8e86-712062edab03" />
)

---

### 📈 Analytics
![Analytics](web application/stitch/projects/14750634141614937933/screens/5d2400bfc18f41bf82a8ce85a5e6c5e9)

---

### 💡 AI Tutor
![AI Tutor](web application/stitch/projects/14750634141614937933/screens/9e4b402d96d24129bb978058bc06ffa1)

</div>

---

## ✨ What is StudyMentor AI?

**StudyMentor AI** is a full-stack AI-powered study companion that acts as your personal tutor, planner, and accountability coach — all in one place.

Most students fail not because they're lazy, but because they have **no structured plan**, **no instant help** when stuck, and **no feedback loop** to confirm they actually learned something. StudyMentor AI fixes all three.

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🏠 Smart Landing Page
A guided homepage with an AI chatbot that tours the platform and answers questions — before the student even signs up.

</td>
<td width="50%">

### 📋 Personalized Study Plans
Claude AI builds a complete multi-week study roadmap based on your subject, goals, level, and available hours. Export PDF, edit, or regenerate anytime.

</td>
</tr>
<tr>
<td width="50%">

### ✅ Daily AI Tasks
Focused tasks generated every morning based on exactly where you are in your plan. Filter by All, Pending, or Completed.

</td>
<td width="50%">

### 🧠 Assignment Quiz System
Complete a task → Claude generates **10 MCQ questions** on that topic. Score **8/10 to pass**. Fail? Task auto-retasks tomorrow with fresh questions.

</td>
</tr>
<tr>
<td width="50%">

### 💡 AI Concept Explainer
Ask anything at 4 levels — ELI5, Beginner, Intermediate, Expert. Upload a photo of your notes or a PDF — Claude reads and explains it with structured responses including summary, analogy, and key points.

</td>
<td width="50%">

### 📊 Deep Analytics
Streak calendar, quiz score chart with pass line, activity heatmap, strength/weakness detection, AI Mentor insight summaries, and achievement badges.

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
| 🤖 **AI Engine** | Anthropic Claude API |
| 🗄️ **Database** | Supabase (PostgreSQL + Auth) |
| 💳 **Payments** | Switch |
| 📁 **File Upload** | Multer + Claude Vision API |
| 🚀 **Deploy** | Vercel + Railway |

</div>

---

## 🏗️ Project Structure

```
studymentor/
├── studymentor-web/              # React frontend
│   └── src/
│       ├── pages/
│       │   ├── HomePage.jsx      # Landing + chatbot tour
│       │   ├── Dashboard.jsx     # Daily tasks + stat cards
│       │   ├── StudyPlan.jsx     # Week-by-week plan
│       │   ├── AITutor.jsx       # Claude chat explainer
│       │   ├── Analytics.jsx     # Progress + achievements
│       │   └── Upgrade.jsx       # Switch pricing
│       └── components/
│
├── studymentor-api/              # Node.js + Express backend
│   └── src/
│       ├── routes/
│       │   ├── auth.js           # Register & login
│       │   ├── plan.js           # Study plan generation
│       │   ├── tasks.js          # Daily task management
│       │   ├── assignments.js    # Quiz generation + grading
│       │   ├── explain.js        # AI explainer + file upload
│       │   ├── progress.js       # Analytics & streaks
│       │   └── billing.js        # Switch payments
│       ├── middleware/
│       │   ├── auth.js           # JWT verification
│       │   └── planGate.js       # Free vs Pro gating
│       └── lib/
│           ├── claude.js         # Anthropic SDK wrapper
│           └── supabase.js       # Database client
│
├── raw_screens/                  # App screenshots
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- [Supabase](https://supabase.com) account
- [Anthropic API key](https://console.anthropic.com)

### 1. Clone

```bash
git clone https://github.com/hiremathswami/studymentor.git
cd studymentor
```

### 2. Backend setup

```bash
cd studymentor-api
npm install
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY
```

### 3. Database

Run `studymentor-api/database/schema.sql` in your Supabase SQL Editor.

### 4. Seed demo data

```bash
node src/seed.js
# ✅ Login: demo@studymentor.ai / demo1234
```

### 5. Start backend

```bash
npm run dev   # http://localhost:3000
```

### 6. Frontend setup

```bash
cd ../studymentor-web
npm install
npm run dev   # http://localhost:5173
```

---

## 🔌 API Endpoints

<details>
<summary><b>👤 Auth</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Login → JWT token |

</details>

<details>
<summary><b>📚 Study Plan</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/plan/generate` | Claude generates plan |
| `GET` | `/api/plan` | Fetch current plan |

</details>

<details>
<summary><b>✅ Tasks</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks/today` | Today's AI tasks |
| `POST` | `/api/tasks/complete` | Complete task → triggers quiz |

</details>

<details>
<summary><b>🧠 Assignments</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assignments/generate` | Generate 10 MCQs |
| `POST` | `/api/assignments/submit` | Grade → pass/fail/retask |
| `GET` | `/api/assignments/:id` | Get quiz questions |

</details>

<details>
<summary><b>💡 AI Tutor</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/explain` | Explain any concept |
| `POST` | `/api/explain` + file | Photo/PDF upload (Pro) |

</details>

<details>
<summary><b>📊 Analytics</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/progress` | Stats + AI insight |
| `GET` | `/api/progress/streak` | Streak count |

</details>

<details>
<summary><b>💳 Billing</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/billing/checkout` | Switch checkout |
| `POST` | `/api/billing/webhook` | Payment webhook |

</details>

---

## 💰 Pricing

<div align="center">

| | Free | Pro ($9/mo) | Team ($29/mo) |
|--|------|-------------|---------------|
| Study plans | 1 | ✅ Unlimited | ✅ Unlimited |
| AI explanations | 5/mo | ✅ Unlimited | ✅ Unlimited |
| Assignment quizzes | 5/mo | ✅ Unlimited | ✅ Unlimited |
| File + photo upload | ❌ | ✅ | ✅ |
| PDF export | ❌ | ✅ | ✅ |
| Seats | 1 | 1 | 10 |
| Teacher dashboard | ❌ | ❌ | ✅ |

</div>

---

## 🗺️ Roadmap

- [x] Landing page with AI chatbot tour
- [x] Authentication (login / register)
- [x] AI study plan generation
- [x] Daily task assignment
- [x] Assignment quiz + 8/10 pass rule
- [x] Smart retask on failure
- [x] AI Tutor with 4 difficulty levels
- [x] File + photo upload (Claude Vision)
- [x] Deep analytics + streak calendar
- [x] AI Mentor insight summaries
- [x] Achievement badges
- [x] Switch payments
- [ ] Voice study mentor
- [ ] Mobile app (React Native)
- [ ] Emotion detection while studying
- [ ] Smart exam prediction

---

## 👨‍💻 Author

<div align="center">

**Rohan Hiremathswami**

*Learning AI APIs and vibe coding — building real products along the way.*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/hiremathswami)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/hiremathswami)

</div>

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

**⭐ If this project helped you, please star it — it means a lot!**

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=14&pause=1000&color=6366F1&center=true&vCenter=true&width=500&lines=Built+with+%E2%9D%A4%EF%B8%8F+and+Claude+AI;Learning+in+public.+Building+in+public." alt="footer" />

</div>
