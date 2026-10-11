import math
import logging
from typing import List, Dict
import httpx
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .schemas import (
    RewriteRequest,
    RewriteResponse,
    HealthResponse,
    ModeInfo,
    SamplePreset,
    WritingMode,
    SupportedLanguage,
    TTSRequest,
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

@app.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    """Health check and model status inspection."""
    return HealthResponse(
        status="healthy",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        model=settings.GEMINI_MODEL,
        has_api_key=gemini_service.has_api_key(),
        allowed_modes=[m.value for m in WritingMode],
        has_elevenlabs_key=bool(settings.ELEVENLABS_API_KEY.strip())
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

    # Check API key status
    if not gemini_service.has_api_key():
        # Check if the user text corresponds to any of the sample presets
        normalized_input = req.text.strip().lower()
        matching_sample = None
        for mode_key, sample in SAMPLE_PRESETS.items():
            if sample.original_text.strip().lower() in normalized_input or normalized_input in sample.original_text.strip().lower():
                matching_sample = sample
                break

        if matching_sample:
            # Retrieve mode and language calibrated demo benchmark output
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
                change_summary=sample_out.get("change_summary", f"Demo {req.mode.value} refinement in {req.language}."),
                word_count_original=words_orig,
                word_count_rewritten=words_rew,
                char_count_original=len(req.text),
                char_count_rewritten=len(sample_out["rewritten_text"]),
                reading_time_seconds_original=calculate_reading_time_seconds(words_orig),
                reading_time_seconds_rewritten=calculate_reading_time_seconds(words_rew),
                preserved_details=sample_out.get("preserved_details", []),
                verification=verification,
                is_sample=True,
                model_used=f"demo-benchmark-{req.language}"
            )

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
