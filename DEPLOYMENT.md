# DEBOT Deployment & Operational Guide

DEBOT (**Definitive Editorial & Balancing Optimization Technology**) is an AI-powered writing refinement platform combining modular generative models (Google Gemini via official `google-genai` SDK) with deterministic token and entity integrity verification.

---

## 1. Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Default | Required | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | *(empty)* | Optional (Required for live AI) | Google Gemini API key. If absent, DEBOT runs in Demo Benchmark mode. |
| `GEMINI_MODEL` | `gemini-2.5-flash` | No | Configurable model identifier (`gemini-2.5-flash`, `gemini-3.7-flash`, etc.). |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000,*` | No | Comma-separated CORS whitelist for client requests. |
| `LOG_USER_TEXT` | `false` | No | When `false`, user text payloads are never logged to console or disk. |
| `MAX_TEXT_LENGTH` | `5000` | No | Maximum input character threshold allowed per request. |
| `MIN_TEXT_LENGTH` | `5` | No | Minimum input character threshold. |
| `REQUEST_TIMEOUT_SECONDS`| `35` | No | Provider timeout safety limit. |
| `PORT` | `8000` | No | Port for Uvicorn server binding. |

### Frontend (`frontend/.env`)
| Variable | Default | Required | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | *(empty)* | No | Base URL for FastAPI backend. Leave blank when using Vite development proxy. Set to e.g. `https://api.yourdomain.com` for decoupled hosting. |

---

## 2. Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm 9+

### A. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# (Optionally add your GEMINI_API_KEY to .env)

# Run test suite
pytest -v

# Start the server
python run.py
# Server runs at http://localhost:8000
```

### B. Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Build check
npm run build

# Start development server
npm run dev
# Vite runs at http://localhost:5173 with proxy to backend at localhost:8000
```

---

## 3. Production Deployment Options

### Option A: Unified Container Stack (Docker Compose)
Deploy both the FastAPI service and static Nginx server with one command:
```bash
# Set your API key in environment
export GEMINI_API_KEY="your-api-key-here"

# Build and start services
docker compose up -d --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Health check: `http://localhost:8000/health`

### Option B: Google Cloud Run (Recommended for Backend)
1. Build and push backend image to Google Artifact Registry:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/debot-backend ./backend
   ```
2. Deploy service:
   ```bash
   gcloud run deploy debot-backend \
     --image gcr.io/YOUR_PROJECT_ID/debot-backend \
     --platform managed \
     --region us-central1 \
     --set-env-vars GEMINI_MODEL=gemini-2.5-flash,LOG_USER_TEXT=false \
     --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
     --allow-unauthenticated
   ```

### Option C: Static Frontend Hosting (Vercel / Cloudflare Pages / Netlify)
1. Set the build directory to `frontend`.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Set Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.com`

---

## 4. Health Check & Diagnostics

The backend provides a standardized diagnostic endpoint at `GET /health`:
```json
{
  "status": "healthy",
  "app": "DEBOT - AI Writing Refinement",
  "version": "1.0.0",
  "model": "gemini-2.5-flash",
  "has_api_key": true,
  "allowed_modes": [
    "standard",
    "academic",
    "casual",
    "professional",
    "creative",
    "simple"
  ]
}
```

Use this endpoint for container orchestrator liveness and readiness probes (`interval: 30s`, `timeout: 5s`).

---

## 5. Security & Verification Checklist

- [x] **No Secret Leakage**: API keys reside solely in server environment variables and are never forwarded to the browser.
- [x] **Untrusted Prompt Isolation**: User-provided inputs are enclosed within `<untrusted_user_text>` tags with strict system boundaries preventing prompt injection.
- [x] **Deterministic Entity Verification**: Rule-based regex token extraction runs independently of LLM claims, checking names, dates, numbers, currencies, quotes, and technical acronyms.
- [x] **Honest Disclaimers**: Verification panel explicitly notes uncertainty and does not guarantee 100% semantic equivalence or detector bypass.
- [x] **Zero-Logging Default**: `LOG_USER_TEXT=false` ensures user writing is never persisted in logs.
- [x] **Input Length Guards**: Hard character limit of 5,000 characters prevents resource exhaustion and abusive payloads.
- [x] **Client-Side Privacy**: Revision history is stored exclusively in `localStorage` with full user controls to clear history at any time.
