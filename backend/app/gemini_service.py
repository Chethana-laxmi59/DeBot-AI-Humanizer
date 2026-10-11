import json
import time
import logging
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from google.genai.errors import APIError

from .config import settings
from .schemas import WritingMode
from .prompts import SYSTEM_INSTRUCTION, build_rewrite_prompt

logger = logging.getLogger("debot.gemini_service")

class GeminiStructuredOutput(BaseModel):
    rewritten_text: str = Field(description="The complete refined rewritten prose")
    change_summary: str = Field(default="", description="Summary of stylistic and flow adjustments")
    preserved_details: list[str] = Field(default_factory=list, description="List of preserved facts/entities")
    potential_meaning_changes: list[str] = Field(default_factory=list, description="Subtle nuances altered")
    unsupported_additions: list[str] = Field(default_factory=list, description="Rhetorical additions")
    review_warnings: list[str] = Field(default_factory=list, description="Review warnings")
    model_used: Optional[str] = Field(default=None, description="Actual model that generated output")

class MissingApiKeyException(Exception):
    """Raised when no API key is provided and a live rewrite is requested."""
    pass

class ProviderServiceException(Exception):
    """Raised when the AI provider fails, times out, or returns invalid structure."""
    pass

class GeminiService:
    def __init__(self):
        self._client: Optional[genai.Client] = None
        self._configured_key = settings.GEMINI_API_KEY.strip()
        
        configured_model = settings.GEMINI_MODEL.strip()
        # Automatically migrate deprecated or retired model identifiers
        if configured_model in ("gemini-2.5-flash", "models/gemini-2.5-flash", "gemini-2.5-flash-lite", "models/gemini-2.5-flash-lite"):
            logger.warning(
                f"Configured model '{configured_model}' is deprecated/retired by Google GenAI. "
                "Migrating request model to 'gemini-3.1-flash-lite'."
            )
            self.model_name = "gemini-3.1-flash-lite"
        else:
            self.model_name = configured_model or "gemini-3.1-flash-lite"

        if self._configured_key:
            try:
                self._client = genai.Client(
                    api_key=self._configured_key,
                    http_options=types.HttpOptions(timeout=settings.REQUEST_TIMEOUT_SECONDS * 1000)
                )
                logger.info(f"Gemini client initialized with model: {self.model_name}")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}")
                self._client = None

    def has_api_key(self) -> bool:
        return bool(self._configured_key and self._client)

    def _sanitize_message(self, message: str) -> str:
        """Strip API keys and sensitive tokens from error text."""
        if not message:
            return ""
        sanitized = message
        if self._configured_key and self._configured_key in sanitized:
            sanitized = sanitized.replace(self._configured_key, "[REDACTED_API_KEY]")
        return sanitized

    def rewrite_text(
        self,
        text: str,
        mode: WritingMode,
        language: str = "en",
        custom_instructions: Optional[str] = None
    ) -> GeminiStructuredOutput:
        """
        Calls Gemini to perform structured rewrite according to the requested mode.
        """
        if not self.has_api_key():
            raise MissingApiKeyException(
                "Gemini API key is not configured. Live AI rewriting is unavailable. "
                "Please set the GEMINI_API_KEY environment variable on the server or explore Sample Mode."
            )

        prompt = build_rewrite_prompt(
            text=text,
            mode=mode,
            language=language,
            custom_instructions=custom_instructions
        )

        # Candidate models to try: primary model, with gemini-3.1-flash-lite as resilient fallback
        candidate_models = [self.model_name]
        if self.model_name != "gemini-3.1-flash-lite":
            candidate_models.append("gemini-3.1-flash-lite")

        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=GeminiStructuredOutput,
            thinking_config=types.ThinkingConfig(thinking_budget=0),
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
            temperature=0.3,
        )

        last_error = None
        for idx, model_to_use in enumerate(candidate_models):
            start_time = time.time()
            try:
                response = self._client.models.generate_content(
                    model=model_to_use,
                    contents=prompt,
                    config=config
                )

                raw_text = response.text
                if not raw_text:
                    raise ProviderServiceException("Provider returned an empty response.")

                # Parse JSON
                try:
                    parsed_dict = json.loads(raw_text)
                    result = GeminiStructuredOutput(**parsed_dict)
                except (json.JSONDecodeError, TypeError) as parse_err:
                    logger.warning(f"Failed to parse schema directly: {parse_err}. Attempting fallback clean.")
                    clean_json = raw_text.strip()
                    if clean_json.startswith("```json"):
                        clean_json = clean_json[7:]
                    if clean_json.startswith("```"):
                        clean_json = clean_json[3:]
                    if clean_json.endswith("```"):
                        clean_json = clean_json[:-3]
                    parsed_dict = json.loads(clean_json.strip())
                    result = GeminiStructuredOutput(**parsed_dict)

                duration = round(time.time() - start_time, 2)
                logger.info(f"Gemini live rewrite finished in {duration}s [model={model_to_use}, status=200]")
                result.model_used = model_to_use
                return result

            except MissingApiKeyException:
                raise
            except APIError as api_err:
                duration = round(time.time() - start_time, 2)
                code = getattr(api_err, "code", None) or "API error"
                raw_msg = getattr(api_err, "message", str(api_err))
                safe_msg = self._sanitize_message(raw_msg)
                category = "NOT_FOUND" if code == 404 else ("SERVICE_UNAVAILABLE" if code == 503 else "API_ERROR")
                logger.error(f"Gemini API upstream error after {duration}s [model={model_to_use}, status={code}, category={category}]: {safe_msg}")
                
                # If another candidate model is available and error was 404 or 503, try next candidate
                if idx < len(candidate_models) - 1 and code in (404, 503):
                    next_model = candidate_models[idx + 1]
                    logger.warning(f"Model '{model_to_use}' encountered {category} ({code}). Attempting fallback model '{next_model}'.")
                    continue

                if code == 404:
                    raise ProviderServiceException(
                        f"Gemini AI provider model '{model_to_use}' was not found or is unavailable (404). "
                        "Please verify GEMINI_MODEL in the server environment (e.g. gemini-flash-latest)."
                    )
                if code == 503:
                    raise ProviderServiceException(
                        "Gemini AI provider is temporarily experiencing high demand (503). Please try again shortly."
                    )
                raise ProviderServiceException(
                    f"Gemini AI provider encountered an error ({code}). Please try again."
                )
            except Exception as e:
                duration = round(time.time() - start_time, 2)
                safe_err = self._sanitize_message(str(e))
                category = type(e).__name__
                logger.error(f"Unexpected error during rewrite execution after {duration}s [model={model_to_use}, category={category}]: {safe_err}")
                if "timeout" in safe_err.lower() or "deadline" in safe_err.lower():
                    raise ProviderServiceException(
                        "Gemini AI service timed out (504). Please verify your connection or try again."
                    )
                raise ProviderServiceException(
                    "An unexpected error occurred while communicating with the AI service. Please verify your connection or try again."
                )

gemini_service = GeminiService()
