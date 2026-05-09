# StudyMentor AI Platform API

A robust Node.js + Express backend for the StudyMentor AI Platform.

## Features
- **AI-Powered Learning**: Integration with Anthropic Claude for study plans, quizzes, and topic explanations.
- **Secure Authentication**: Supabase Auth integration.
- **Subscription Management**: Tiered plans (Free, Pro, Team).
- **Academic Modernism Design**: Serving high-fidelity frontend assets.

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude 3.5 Sonnet
- **Security**: JWT, Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase account
- Anthropic API key

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` based on `.env.example`
4. Run migrations on Supabase (use schema in root)

### Running Locally
- Dev mode: `npm run dev`
- Production: `npm start`

## API Documentation
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Sign in
- `POST /api/plan/generate` - Create study plan
- `POST /api/explain` - Topic explanation (AI)
- `POST /api/quiz/generate` - Create academic quiz

## License
MIT
