import os
import math
import logging
from typing import List, Dict, Optional
import httpx
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import settings
from .database import (
    get_db,
    create_tables,
    active_db_type,
    UserModel,
    SavedDraftModel,
)
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_current_user,
)
from .schemas import (
    RewriteRequest,
    RewriteResponse,
    HealthResponse,
    ModeInfo,
    SamplePreset,
    WritingMode,
    SupportedLanguage,
    TTSRequest,
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
    SaveDraftRequest,
    SavedDraftResponse,
)
from .verifier import DeterministicEntityVerifier
from .prompts import MODE_PROFILES
from .sample_data import MODES_METADATA, SAMPLE_PRESETS, get_sample_output
from .gemini_service import gemini_service, MissingApiKeyException, ProviderServiceException

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("debot.api")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Refinement & balance writing engine with deterministic token verification."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_reading_time_seconds(word_count: int, words_per_minute: int = 200) -> int:
    """Estimated reading time in seconds assuming 200 wpm standard."""
    if word_count <= 0:
        return 0
    return max(1, math.ceil((word_count / words_per_minute) * 60))

@app.on_event("startup")
def on_startup():
    """Initialize database tables on application startup."""
    create_tables()

@app.get("/health", response_model=HealthResponse)
@app.get("/api/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    """Health check, model status, and database type inspection."""
    return HealthResponse(
        status="healthy",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        model=settings.GEMINI_MODEL,
        has_api_key=gemini_service.has_api_key(),
        allowed_modes=[m.value for m in WritingMode],
        has_elevenlabs_key=bool(settings.ELEVENLABS_API_KEY.strip()),
        database_type=active_db_type
    )

@app.get("/api/modes", response_model=List[ModeInfo])
def get_modes() -> List[ModeInfo]:
    """Available writing modes with descriptions and guidance."""
    return MODES_METADATA

@app.get("/api/samples", response_model=Dict[str, SamplePreset])
def get_samples() -> Dict[str, SamplePreset]:
    """Curated realistic samples for all modes."""
    return {k.value: v for k, v in SAMPLE_PRESETS.items()}

@app.get("/api/languages")
def get_languages():
    """Languages supported for writing refinement."""
    return [
        {"code": "en", "name": "English"},
        {"code": "te", "name": "Telugu (తెలుగు)"},
        {"code": "hi", "name": "Hindi (हिन्दी)"},
        {"code": "es", "name": "Spanish (Español)"},
        {"code": "fr", "name": "French (Français)"},
        {"code": "de", "name": "German (Deutsch)"},
        {"code": "it", "name": "Italian (Italiano)"},
        {"code": "pt", "name": "Portuguese (Português)"},
        {"code": "ja", "name": "Japanese (日本語)"},
        {"code": "zh", "name": "Chinese (中文)"},
        {"code": "ko", "name": "Korean (한국어)"},
        {"code": "nl", "name": "Dutch (Nederlands)"},
    ]

@app.post("/api/tts")
async def generate_speech(req: TTSRequest):
    """
    Generate lifelike multilingual speech via ElevenLabs API if configured.
    Returns 501 if no key is configured so client seamlessly falls back to browser synthesis.
    """
    if not settings.ELEVENLABS_API_KEY.strip():
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="ElevenLabs API key is not configured in backend/.env"
        )

    clean_text = req.text.strip()
    if not clean_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text cannot be empty."
        )

    try:
        # If user configured the legacy/blocked Rachel voice ID (21m00Tcm4TlvDq8ikWAM),
        # automatically route to Sarah (EXAVITQu4vr4xnSDxMaL) which is fully accessible on all plans
        voice_id = settings.ELEVENLABS_VOICE_ID.strip()
        if not voice_id or voice_id == "21m00Tcm4TlvDq8ikWAM":
            voice_id = "EXAVITQu4vr4xnSDxMaL"

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        headers = {
            "xi-api-key": settings.ELEVENLABS_API_KEY.strip(),
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }
        # Tuned parameters: 0.0 style and 0.55 stability yield accurate multilingual phonetics for Indic languages
        payload = {
            "text": clean_text[:1200],
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.55,
                "similarity_boost": 0.85,
                "style": 0.0,
                "use_speaker_boost": True
            }
        }
        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code != 200:
                logger.warning("ElevenLabs upstream error: status %s - %s", resp.status_code, resp.text[:200])
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"ElevenLabs TTS service returned status {resp.status_code}"
                )
            return Response(content=resp.content, media_type="audio/mpeg")
    except httpx.RequestError as exc:
        logger.error("Network error contacting ElevenLabs: %s", str(exc))
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Network timeout while connecting to ElevenLabs TTS service."
        )

@app.post("/api/rewrite", response_model=RewriteResponse)
def rewrite_text(req: RewriteRequest) -> RewriteResponse:
    """
    Main refinement endpoint.
    Performs context-aware natural-language rewrite and independent deterministic verification.
    """
    # Validation checks
    char_len = len(req.text)
    if char_len < settings.MIN_TEXT_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Text is too short. Minimum allowed is {settings.MIN_TEXT_LENGTH} characters."
        )
    if char_len > settings.MAX_TEXT_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Text exceeds limit of {settings.MAX_TEXT_LENGTH} characters (received {char_len})."
        )

    # Privacy-conscious logging
    if settings.LOG_USER_TEXT:
        logger.info(f"Processing rewrite: mode={req.mode.value}, len={char_len}")
    else:
        logger.info(f"Processing rewrite: mode={req.mode.value}, char_length={char_len} (content not logged)")

    # Fast path for preset samples without custom instructions
    normalized_input = req.text.strip().lower()
    matching_sample = None
    if not (req.custom_instructions and req.custom_instructions.strip()):
        for mode_key, sample in SAMPLE_PRESETS.items():
            if sample.original_text.strip().lower() == normalized_input:
                matching_sample = sample
                break

    if matching_sample:
        # Retrieve mode and language calibrated benchmark output
        sample_out = get_sample_output(mode=req.mode, language=req.language)

        # Deterministic verification on output
        verification = DeterministicEntityVerifier.verify(
            original_text=req.text,
            rewritten_text=sample_out["rewritten_text"],
            ai_meaning_changes=sample_out.get("potential_meaning_changes", []),
            ai_unsupported_additions=sample_out.get("unsupported_additions", []),
            ai_warnings=sample_out.get("review_warnings", [])
        )
        words_orig = len(req.text.split())
        words_rew = len(sample_out["rewritten_text"].split())
        return RewriteResponse(
            original_text=req.text,
            rewritten_text=sample_out["rewritten_text"],
            mode=req.mode,
            language=req.language,
            change_summary=sample_out.get("change_summary", f"Calibrated {req.mode.value} refinement in {req.language}."),
            word_count_original=words_orig,
            word_count_rewritten=words_rew,
            char_count_original=len(req.text),
            char_count_rewritten=len(sample_out["rewritten_text"]),
            reading_time_seconds_original=calculate_reading_time_seconds(words_orig),
            reading_time_seconds_rewritten=calculate_reading_time_seconds(words_rew),
            preserved_details=sample_out.get("preserved_details", []),
            verification=verification,
            is_sample=True,
            model_used=f"calibrated-benchmark-{req.language}"
        )

    # Check API key status for custom text
    if not gemini_service.has_api_key():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Gemini API key is not configured on the server. "
                "Please configure GEMINI_API_KEY in the server .env file to enable live AI refinement. "
                "You can load realistic sample presets from the UI to test all workflow features."
            )
        )

    # Perform live AI rewrite with Gemini
    try:
        ai_result = gemini_service.rewrite_text(
            text=req.text,
            mode=req.mode,
            language=req.language,
            custom_instructions=req.custom_instructions
        )
    except MissingApiKeyException as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except ProviderServiceException as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in rewrite route: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected server error occurred during text refinement."
        )

    # Run independent rule-based entity and token verification
    verification = DeterministicEntityVerifier.verify(
        original_text=req.text,
        rewritten_text=ai_result.rewritten_text,
        ai_meaning_changes=ai_result.potential_meaning_changes,
        ai_unsupported_additions=ai_result.unsupported_additions,
        ai_warnings=ai_result.review_warnings
    )

    words_orig = len(req.text.split())
    words_rew = len(ai_result.rewritten_text.split())

    return RewriteResponse(
        original_text=req.text,
        rewritten_text=ai_result.rewritten_text,
        mode=req.mode,
        language=req.language,
        change_summary=ai_result.change_summary or "Refined prose cadence and clarity.",
        word_count_original=words_orig,
        word_count_rewritten=words_rew,
        char_count_original=len(req.text),
        char_count_rewritten=len(ai_result.rewritten_text),
        reading_time_seconds_original=calculate_reading_time_seconds(words_orig),
        reading_time_seconds_rewritten=calculate_reading_time_seconds(words_rew),
        preserved_details=ai_result.preserved_details,
        verification=verification,
        is_sample=False,
        model_used=ai_result.model_used or gemini_service.model_name
    )

# ==============================================================================
# User Authentication & Database Sync Routes
# ==============================================================================

@app.post("/api/auth/register", response_model=TokenResponse)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account in MySQL/database."""
    email_clean = req.email.strip().lower()
    username_clean = req.username.strip().lower()

    # Check for duplicate email
    if db.query(UserModel).filter(UserModel.email == email_clean).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Check for duplicate username
    if db.query(UserModel).filter(UserModel.username == username_clean).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This username is already taken. Please choose another."
        )

    # Create new user record
    new_user = UserModel(
        email=email_clean,
        username=username_clean,
        hashed_password=hash_password(req.password),
        full_name=req.full_name.strip() if req.full_name else None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Issue JWT token
    token = create_access_token({"sub": new_user.email, "uid": new_user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )

@app.post("/api/auth/login", response_model=TokenResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    """Authenticate existing user credentials against MySQL/database."""
    query_str = req.username_or_email.strip().lower()
    user = db.query(UserModel).filter(
        (UserModel.email == query_str) | (UserModel.username == query_str)
    ).first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your email/username and password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({"sub": user.email, "uid": user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@app.get("/api/auth/me", response_model=UserResponse)
def get_authenticated_profile(current_user: UserModel = Depends(require_current_user)):
    """Retrieve profile of currently authenticated user."""
    return UserResponse.model_validate(current_user)

@app.post("/api/auth/logout")
def logout_user():
    """Client-side token disposal endpoint."""
    return {"status": "success", "message": "Logged out successfully."}

@app.post("/api/user/saved-drafts", response_model=SavedDraftResponse)
def save_user_draft(
    req: SaveDraftRequest,
    current_user: UserModel = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    """Save a refined draft to the user's persistent MySQL storage."""
    draft = SavedDraftModel(
        user_id=current_user.id,
        original_text=req.original_text,
        rewritten_text=req.rewritten_text,
        mode=req.mode,
        language=req.language,
        change_summary=req.change_summary,
        preservation_score=req.preservation_score
    )
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return SavedDraftResponse.model_validate(draft)

@app.get("/api/user/saved-drafts", response_model=List[SavedDraftResponse])
def get_user_saved_drafts(
    current_user: UserModel = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all saved drafts for the authenticated user from MySQL."""
    drafts = db.query(SavedDraftModel).filter(
        SavedDraftModel.user_id == current_user.id
    ).order_by(SavedDraftModel.created_at.desc()).all()
    return [SavedDraftResponse.model_validate(d) for d in drafts]

@app.delete("/api/user/saved-drafts/{draft_id}")
def delete_user_saved_draft(
    draft_id: int,
    current_user: UserModel = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    """Delete a saved draft by ID."""
    draft = db.query(SavedDraftModel).filter(
        SavedDraftModel.id == draft_id,
        SavedDraftModel.user_id == current_user.id
    ).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found.")
    db.delete(draft)
    db.commit()
    return {"status": "success", "message": "Draft deleted."}


# ---------------------------------------------------------------------------
# Single-Service Static Frontend Serving (All-in-One Deployment)
# ---------------------------------------------------------------------------
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Check potential static directory locations (Docker /app/static or local frontend/dist)
_STATIC_CANDIDATES = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist"),
]

_STATIC_DIR = next((p for p in _STATIC_CANDIDATES if os.path.isdir(p) and os.path.exists(os.path.join(p, "index.html"))), None)

if _STATIC_DIR:
    _assets_dir = os.path.join(_STATIC_DIR, "assets")
    if os.path.isdir(_assets_dir):
        app.mount("/assets", StaticFiles(directory=_assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("health"):
            raise HTTPException(status_code=404, detail="Endpoint not found")
        file_path = os.path.join(_STATIC_DIR, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(_STATIC_DIR, "index.html"))

