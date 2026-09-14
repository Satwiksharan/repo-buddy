# 🩺 RepoBuddy

> **Your GitHub project. Your technical interview.**
> *RepoBuddy understands what you built, teaches you how to explain it, and prepares you to defend it in a technical interview.*

---

## 🎯 Product Vision & Core Differentiator

RepoBuddy is an AI-powered GitHub repository analysis and technical interview preparation platform designed for computer science students, software engineering applicants, campus placement candidates, and developers.

### The Problem
Students build impressive projects and place them on resumes, but struggle during technical interviews when asked:
- *"Tell me about your project."*
- *"Why did you choose MongoDB over PostgreSQL?"*
- *"Explain your architecture and how data flows through your backend."*
- *"How would you handle rate limiting under high traffic spikes?"*

### The RepoBuddy Solution
Generic preparation tools generate textbook questions without understanding your code. RepoBuddy scans your **actual GitHub repository** to:
1. **Understand**: Detect your technology stack, directory structure, files, and architecture deterministically.
2. **Explain**: Generate 30-second, 1-minute, and 2-3 minute technical pitches tailored to your repository.
3. **Practice**: Conduct interactive pitch practice sessions with instant AI evaluation scores across 5 criteria.
4. **Defend**: Run mock technical interviews with project-grounded questions (`sourceFiles` & `expectedConcepts`) and adaptive follow-up questions.
5. **Improve**: Detect technical weaknesses, derive readiness scores, and build personalized preparation plans.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Axios, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Cookie Parser, Helmet
- **Database**: MongoDB & Mongoose Object Data Modeling
- **GitHub Integration**: GitHub REST API & OAuth 2.0
- **AI Service Layer**: Hosted AI API Layer with Grounded Deterministic Fallback Engine

---

## 📁 Complete Repository Structure

```text
repobuddy/
├── client/                 # React + Vite + TypeScript Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable Components (Navbar, ScoreCard, ArchitectureDiagram, etc.)
│   │   ├── pages/          # App Pages (Dashboard, Repositories, Interview, Progress, etc.)
│   │   ├── services/       # Client API Services (api.ts, authService.ts, repositoryService.ts, etc.)
│   │   ├── context/        # React Context Providers (AuthContext.tsx)
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── App.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                 # Express REST API Server
│   ├── src/
│   │   ├── config/         # Environment & Mongoose Configuration
│   │   ├── controllers/    # API Controllers (auth, github, repository, explanation, interview, progress)
│   │   ├── middleware/     # Auth (JWT), Rate Limiter, Error Handler
│   │   ├── models/         # Mongoose Schemas (User, Repository, Scan, Question, Interview)
│   │   ├── routes/         # Express Endpoint Routes
│   │   ├── services/       # Business Logic (scanner, technologyDetector, architectureAnalyzer, etc.)
│   │   ├── ai/             # AI Service Layer (aiService.js, promptBuilder.js, responseParser.js)
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/              # 11 Automated Test Suites (Jest & Supertest)
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
├── README.md
└── package.json            # Root Workspace & Concurrently Script Runner
```

---

## ⚙️ Environment Variables Setup

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/repobuddy

# GitHub OAuth Setup
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Auth & AI Service Layer Setup
JWT_SECRET=repobuddy_secure_jwt_secret_key_98765
AI_API_KEY=your_ai_api_key
AI_MODEL=gemini-2.5-flash
AI_BASE_URL=https://generativelanguage.googleapis.com
```

---

## 🚀 Getting Started

### 1. Installation
Install dependencies across root, server, and client:
```bash
npm run setup
```

### 2. Running in Development
Start Express backend (port 5000) and Vite frontend (port 5173) concurrently:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Testing & Verification

Run automated test suites across all 11 test modules:

```bash
npm test --prefix server
```

```text
PASS tests/progress.test.js
PASS tests/interviewIntelligence.test.js
PASS tests/interviewEngine.test.js
PASS tests/auth.test.js
PASS tests/explanation.test.js
PASS tests/explanationPractice.test.js
PASS tests/authProtection.test.js
PASS tests/health.test.js
PASS tests/scanner.test.js
PASS tests/github.test.js
PASS tests/healthScore.test.js

Test Suites: 11 passed, 11 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        1.244 s
Ran all test suites.
```

Verify production client build:
```bash
npm run build --prefix client
```
`✓ built in 1.57s with 0 TypeScript errors.`

---

## 🔒 Security & Privacy Guarantees

1. **Secret Redaction**: Automatic secret redactor (`redactSecrets()`) scrubs database passwords, API tokens, AWS keys, and JWTs from files before sending data to AI or client.
2. **Access Control**: GitHub access tokens are marked with `{ select: false }` in Mongoose and are never exposed to the frontend.
3. **Session Security**: Authenticated sessions use HTTP-only, SameSite cookies or Bearer JWT headers.
4. **Rate Limiting**: Integrated rate limiter middleware protects API routes from brute-force attacks.

---

## 🐳 Docker Deployment

Run RepoBuddy using Docker Compose:

```bash
docker-compose up --build
```

---

## 🗺️ Completed Development Roadmap (Phases 1 - 11)

- [x] **Phase 1: Project Scaffolding & Health API**
- [x] **Phase 2: GitHub OAuth & Repository Listing**
- [x] **Phase 3: Repository Scanner & Tech Stack Detection**
- [x] **Phase 4: Health Analysis (Quality, Security, Testing & Documentation)**
- [x] **Phase 5: Auth Middleware & User Context Persistence**
- [x] **Phase 6: Project Explanation Engine**
- [x] **Phase 7: Explanation Practice & Live AI Feedback**
- [x] **Phase 8: AI Mock Technical Interview Engine**
- [x] **Phase 9: Interview Intelligence (Weakness Detection & Preparation Plan)**
- [x] **Phase 10: Progress Analytics & Retake History**
- [x] **Phase 11: Production Polish, Security Audit & Deployment Setup**
