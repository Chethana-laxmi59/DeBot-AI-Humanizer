from unittest.mock import MagicMock, patch
import pytest
from app.gemini_service import GeminiService, GeminiStructuredOutput, MissingApiKeyException, ProviderServiceException
from app.schemas import WritingMode

def test_missing_api_key_raises():
    with patch("app.gemini_service.settings.GEMINI_API_KEY", ""):
        svc = GeminiService()
        with pytest.raises(MissingApiKeyException):
            svc.rewrite_text("Sample valid text to rewrite", WritingMode.STANDARD)

def test_successful_mocked_gemini_call():
    with patch("app.gemini_service.settings.GEMINI_API_KEY", "dummy_test_key_abc123"):
        svc = GeminiService()
        mock_response = MagicMock()
        mock_response.text = (
            '{"rewritten_text": "Enhanced polished prose.", '
            '"change_summary": "Improved sentence rhythm.", '
            '"preserved_details": ["Detail 1"], '
            '"potential_meaning_changes": [], '
            '"unsupported_additions": [], '
            '"review_warnings": []}'
        )
        svc._client = MagicMock()
        svc._client.models.generate_content.return_value = mock_response

        res = svc.rewrite_text("Original clunky text.", WritingMode.STANDARD)
        assert isinstance(res, GeminiStructuredOutput)
        assert res.rewritten_text == "Enhanced polished prose."
        assert res.change_summary == "Improved sentence rhythm."

def test_provider_failure_sanitized_error():
    with patch("app.gemini_service.settings.GEMINI_API_KEY", "dummy_test_key_abc123"):
        svc = GeminiService()
        svc._client = MagicMock()
        svc._client.models.generate_content.side_effect = Exception("Internal connection timeout or socket error")

        with pytest.raises(ProviderServiceException) as exc_info:
            svc.rewrite_text("Original clunky text.", WritingMode.STANDARD)
        # Verify secrets and tracebacks are not leaked in the exception message
        assert "dummy_test_key" not in str(exc_info.value)
        assert "AI service" in str(exc_info.value)

def test_build_rewrite_prompt_multilingual():
    from app.prompts import build_rewrite_prompt
    
    # Telugu prompt check
    prompt_te = build_rewrite_prompt("Sample draft to translate", WritingMode.ACADEMIC, language="te")
    assert "Telugu (తెలుగు)" in prompt_te
    assert "Academic" in prompt_te
    assert "Entity Preservation" in prompt_te
    assert "<untrusted_user_text>" in prompt_te
    
    # Hindi prompt check
    prompt_hi = build_rewrite_prompt("Sample draft to translate", WritingMode.CASUAL, language="hi")
    assert "Hindi (हिन्दी)" in prompt_hi
    assert "Casual" in prompt_hi
    assert "Entity Preservation" in prompt_hi

def test_gemini_service_migrates_deprecated_model_2_5_flash():
    with patch("app.gemini_service.settings.GEMINI_MODEL", "gemini-2.5-flash"):
        svc = GeminiService()
        assert svc.model_name == "gemini-3.1-flash-lite"

def test_gemini_service_safe_diagnostic_logging_404():
    from google.genai.errors import APIError
    with patch("app.gemini_service.settings.GEMINI_API_KEY", "secret_key_9999"):
        svc = GeminiService()
        svc._client = MagicMock()
        
        # Simulate 404 APIError from Gemini
        api_error = APIError(404, {"error": {"code": 404, "message": "This model is no longer available with key secret_key_9999", "status": "NOT_FOUND"}})
        svc._client.models.generate_content.side_effect = api_error
        
        with pytest.raises(ProviderServiceException) as exc_info:
            svc.rewrite_text("Test draft text.", WritingMode.STANDARD)
        
        # Verify secret key is NOT in exception message or exposed
        error_msg = str(exc_info.value)
        assert "secret_key_9999" not in error_msg
        assert "404" in error_msg
        assert "gemini-3.1-flash-lite" in error_msg


