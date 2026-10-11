# DEBOT — Definitive Editorial & Balancing Optimization Technology

> An original, production-grade AI writing refinement web application designed for a 2-day hackathon.

DEBOT polishes clunky, robotic, or draft prose into articulate, natural writing while providing **deterministic entity and factual verification** to ensure your names, dates, numbers, technical terminology, and direct quotes remain intact.

---

## Key Features

1. **Writing Workspace & Landing**: Responsive, editorial-grade glassmorphic interface with real-time character count, word count, reading time estimation, and clear/paste controls.
2. **6 Calibrated Writing Modes**:
   - **Standard**: Balanced, natural, and fluent with effortless cadence.
   - **Academic**: Rigorous, measured, and evidence-grounded prose suitable for publications.
   - **Casual**: Approachable, warm, and conversational with natural contractions.
   - **Professional**: Crisp, executive, and decisive business correspondence.
   - **Creative**: Evocative sensory imagery, dynamic rhythm, and literary style.
   - **Simple**: Plain language, short sentences, and minimal cognitive load (~6th-8th grade reading level).
3. **Multilingual Refinement Engine**:
   - Refines and preserves core semantics across English, Telugu (తెలుగు), Hindi (हिन्दी), Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Korean, and Dutch.
4. **Voice-Over & Tone Cadence Auditor**:
   - Audio narration with real-time animated equalizer and full playback controls (Play, Pause, Resume, Stop).
   - Automated mode-tailored spoken cadence critique analyzing the stylistic characteristics of the output.
   - Glassmorphic Cadence & Formality Meter Bar visually scoring stylistic formality (from 18% casual to 98% academic).
   - Dual-engine speech architecture: ElevenLabs Neural HD audio with seamless browser Web Speech API fallback.
5. **Deterministic Entity Verification Panel**:
   - Independent rule-based extractor checks proper nouns, dates, numbers, percentages, currencies, quotes, and acronyms.
   - Calculates exact preservation percentage (`%`) completely separate from LLM claims.
   - Identifies omitted or altered tokens.
   - Flags AI-reported subtle nuance shifts and rhetorical additions.
   - Communicates uncertainty honestly without claiming detector bypasses or infallible truth.
6. **Visual Diff Viewer**: Word-level LCS comparison highlighting additions in emerald and removals in rose.
7. **Local Revision History**: Stored privately in `localStorage` with one-click restore and history clearing.
8. **Export & Sharing**: One-click clipboard copy and downloads in both `.txt` and `.md` formats.
9. **Privacy & Security**:
   - Untrusted prompt boundary (`<untrusted_user_text>`) preventing prompt injections.
   - Zero-logging policy (`LOG_USER_TEXT=false`) ensuring user text is never saved to logs.
   - Fully protected API keys (browser never sees credentials).
   - Interactive Demo Benchmark Mode when no API key is configured.

---

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Python 3.13, FastAPI, Pydantic v2, Uvicorn.
- **AI Engine**: Google Gemini API via the official `google-genai` Python SDK (`from google import genai`).
- **Testing**: Pytest & FastAPI TestClient for automated validation and verifier tests.
- **Containerization**: Multi-stage Docker & Docker Compose.

---

## Quickstart Guide

### 1. Backend
```bash
cd backend
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt

# (Optional) Set your Gemini API key in backend/.env:
# GEMINI_API_KEY=your_key_here

# Run backend tests
pytest -v

# Start backend server
python run.py
```
Backend will be live at `http://localhost:8000`. Diagnostic health check available at `http://localhost:8000/health`.

### 2. Frontend
```bash
cd frontend
npm install
npm run build
npm run dev
```
Frontend will be live at `http://localhost:5173`.

---

## Automated Test Suite

Run the comprehensive test suite verifying input validation, entity extraction, boundary conditions, and mock provider error handling:
```bash
cd backend
.venv\Scripts\pytest -v
```
**Test Coverage**:
- `test_extract_entities_complete_suite`: Validates regex extraction of dates, metrics, quotes, names, and acronyms.
- `test_verifier_perfect_preservation`: Validates 100% preservation score calculation.
- `test_verifier_missing_entity_warning`: Validates warnings when tokens are dropped.
- `test_verifier_semantic_changes_reported`: Validates semantic nuance reporting.
- `test_rewrite_request_valid` / `too_short` / `whitespace` / `too_long` / `invalid_mode`: Full Pydantic input validation suite.
- `test_health_endpoint`, `test_modes_endpoint`, `test_languages_endpoint`, `test_samples_endpoint`: API endpoint status and schemas.
- `test_rewrite_missing_api_key_custom_text` & `test_rewrite_sample_text_fallback`: Demo mode benchmark fallback without API key.
- `test_successful_mocked_gemini_call` & `test_provider_failure_sanitized_error`: AI provider mocking and safe exception handling.

---

## License & Attribution

Built for hackathon demonstration. All design, code, and verifier systems are original implementations.
