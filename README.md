## CareerCompass AI — Agentic Career Mentor

An agentic AI career companion that helps students and early-career professionals move from their current skill level to job readiness. The system thinks, plans, acts, and learns over time: it ingests resumes, reasons about realistic roles, plans adaptive skill roadmaps, recommends actions (applications, learning, tailoring), and incorporates feedback to improve.

### Why
Across campuses and first jobs, people struggle to decide which roles fit, what to learn next, when to apply, and why rejections happen. Career effort is scattered across platforms. This project tackles that by building a persistent, AI-first mentor that reduces uncertainty and converts effort into trackable progress.

### Core Capabilities
- Profile understanding: capture name, role, experience level, skills, interests, goals, and bio; maintain a career memory seeded from resumes and feedback. See backend profile model in [backend/app/models/schemas.py](backend/app/models/schemas.py).
- Resume ingestion: PDF upload with text extraction and metadata stub via [backend/app/services/resume_parser.py](backend/app/services/resume_parser.py); auto-fills analysis context.
- Agentic reasoning and planning: Gemini-powered (or mock) analysis that explains gaps, proposes roles, and builds a milestone roadmap in [backend/app/agents/core.py](backend/app/agents/core.py).
- Feedback-driven adaptation: log outcomes (rejected/interview/offer) so future plans incorporate real-world signals via [backend/app/main.py](backend/app/main.py#L37-L60).
- Frontend experience: Next.js UI for upload, profile entry, feedback logging, and roadmap visualization in [frontend/app/page.tsx](frontend/app/page.tsx) and components under [frontend/app/components](frontend/app/components).

### Architecture
- Backend: FastAPI service with SQLModel + SQLite persistence ([backend/app/main.py](backend/app/main.py), [backend/app/database/db.py](backend/app/database/db.py)).
- Agent layer: Gemini 2.5 Flash via `google-generativeai`; falls back to deterministic mock when `GOOGLE_API_KEY` is absent.
- Frontend: Next.js 16 with React 19; Tailwind 4 styling; fetches backend over REST.
- Data store: local SQLite file `career_compass.db` created on startup.

### Prerequisites
- Python 3.10+ and Node.js 18+ (or newer).
- Google API key with Gemini access (`GOOGLE_API_KEY`) if you want live LLM responses; otherwise the mock agent runs.

### Quickstart
1) Backend
```
cd backend
python -m venv .venv
.venv/Scripts/activate  # Windows
pip install -r requirements.txt
set GOOGLE_API_KEY=your_key  # optional
uvicorn app.main:app --reload --port 8000
```

2) Frontend (in a new terminal)
```
cd frontend
npm install
npm run dev -- --port 3000
```

The app expects the backend at `http://localhost:8000`. Open `http://localhost:3000` to use the UI.

### Key Flows
- Upload resume → backend extracts text and returns metadata → UI can prefill bio context.
- Submit profile → `/api/analyze` returns analysis, suggested roles, and roadmap; mock data used if no API key.
- Log application feedback → `/api/feedback` stores outcomes so future analyses can adapt.

### API Surface (backend)
- `POST /api/upload-resume` — multipart PDF upload; returns `text` and `metadata`.
- `POST /api/analyze` — body: `UserProfile`; response: `AgentResponse` with analysis, suggested paths, roadmap.
- `POST /api/feedback` — body: `ApplicationFeedback`; persists to SQLite.
- `GET /api/jobs` — mock job recommendations for the current profile.

### Configuration
- Environment: `GOOGLE_API_KEY` (optional) to enable Gemini calls.
- Database: SQLite file created automatically; adjust path or engine in [backend/app/database/db.py](backend/app/database/db.py) if needed.
- CORS: currently open to all origins for local development in [backend/app/main.py](backend/app/main.py#L9-L19).

### Project Structure (high level)
- Backend: FastAPI service, agent, models, resume parsing under [backend/app](backend/app).
- Frontend: Next.js UI under [frontend/app](frontend/app) with modular components.

### Roadmap Ideas (to extend)
- Interview simulation with STAR feedback and scoring.
- Active job scraping + alerts based on fit score.
- Auto-tailored resumes and cover letters per role.
- Calendar-driven milestone reminders and weekly progress summaries.
- Vectorized career memory to personalize reasoning across sessions.