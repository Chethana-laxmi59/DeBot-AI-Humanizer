from fastapi.testclient import TestClient
from app.main import app
from app.sample_data import SAMPLE_PRESETS
from app.schemas import WritingMode

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app"] == "DEBOT - AI Writing Refinement"
    assert "allowed_modes" in data
    assert len(data["allowed_modes"]) == 6

def test_modes_endpoint():
    response = client.get("/api/modes")
    assert response.status_code == 200
    modes = response.json()
    assert len(modes) == 6
    ids = [m["id"] for m in modes]
    assert "standard" in ids
    assert "academic" in ids
    assert "casual" in ids
    assert "professional" in ids
    assert "creative" in ids
    assert "simple" in ids

def test_languages_endpoint():
    response = client.get("/api/languages")
    assert response.status_code == 200
    languages = response.json()
    assert any(lang["code"] == "en" for lang in languages)
    assert any(lang["code"] == "te" for lang in languages)
    assert any(lang["code"] == "hi" for lang in languages)
    assert any(lang["code"] == "es" for lang in languages)

def test_samples_endpoint():
    response = client.get("/api/samples")
    assert response.status_code == 200
    samples = response.json()
    assert "standard" in samples
    assert "academic" in samples

def test_rewrite_missing_api_key_custom_text(monkeypatch):
    # Without API key, arbitrary user text should return 503 explaining how to set key
    monkeypatch.setattr("app.main.gemini_service.has_api_key", lambda: False)
    response = client.post("/api/rewrite", json={
        "text": "This is completely arbitrary text that is not a sample preset.",
        "mode": "standard",
        "language": "en"
    })
    assert response.status_code == 503
    assert "Gemini API key is not configured" in response.json()["detail"]

def test_rewrite_sample_text_fallback(monkeypatch):
    # Matching sample text should return 200 with is_sample=True in demo mode
    monkeypatch.setattr("app.main.gemini_service.has_api_key", lambda: False)
    standard_sample = SAMPLE_PRESETS[WritingMode.STANDARD]
    response = client.post("/api/rewrite", json={
        "text": standard_sample.original_text,
        "mode": "standard",
        "language": "en"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["is_sample"] is True
    assert data["mode"] == "standard"
    assert data["language"] == "en"
    assert data["verification"]["exact_entities_detected"] > 0
    assert "Thorne" in data["rewritten_text"]

def test_rewrite_sample_text_telugu_and_hindi(monkeypatch):
    monkeypatch.setattr("app.main.gemini_service.has_api_key", lambda: False)
    standard_sample = SAMPLE_PRESETS[WritingMode.STANDARD]
    
    # Test Telugu output
    res_te = client.post("/api/rewrite", json={
        "text": standard_sample.original_text,
        "mode": "standard",
        "language": "te"
    })
    assert res_te.status_code == 200
    data_te = res_te.json()
    assert data_te["language"] == "te"
    assert data_te["is_sample"] is True
    # Preserves numbers, names, quotes in Telugu
    assert "12,000" in data_te["rewritten_text"]
    assert "42.8%" in data_te["rewritten_text"]
    assert "Aris Thorne" in data_te["rewritten_text"] or "Thorne" in data_te["rewritten_text"]
    assert "$0.003" in data_te["rewritten_text"]
    
    # Test Hindi output
    res_hi = client.post("/api/rewrite", json={
        "text": standard_sample.original_text,
        "mode": "standard",
        "language": "hi"
    })
    assert res_hi.status_code == 200
    data_hi = res_hi.json()
    assert data_hi["language"] == "hi"
    assert data_hi["is_sample"] is True
    # Preserves numbers, names, quotes in Hindi
    assert "12,000" in data_hi["rewritten_text"]
    assert "42.8%" in data_hi["rewritten_text"]
    assert "Thorne" in data_hi["rewritten_text"]
    assert "$0.003" in data_hi["rewritten_text"]

def test_rewrite_all_six_modes_distinct(monkeypatch):
    monkeypatch.setattr("app.main.gemini_service.has_api_key", lambda: False)
    standard_sample = SAMPLE_PRESETS[WritingMode.STANDARD]
    modes_tested = ["standard", "academic", "casual", "professional", "creative", "simple"]
    outputs = {}
    
    for mode in modes_tested:
        res = client.post("/api/rewrite", json={
            "text": standard_sample.original_text,
            "mode": mode,
            "language": "en"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["mode"] == mode
        assert data["is_sample"] is True
        outputs[mode] = data["rewritten_text"]
    
    # All 6 outputs must be distinct from one another
    distinct_rewrites = set(outputs.values())
    assert len(distinct_rewrites) == len(modes_tested)

def test_rewrite_live_mode_with_mocked_gemini(monkeypatch):
    from unittest.mock import MagicMock
    from app.gemini_service import GeminiStructuredOutput
    
    monkeypatch.setattr("app.main.gemini_service.has_api_key", lambda: True)
    mock_rewrite = MagicMock(return_value=GeminiStructuredOutput(
        rewritten_text="Live AI refined text with 100% accuracy and Thorne preserved.",
        change_summary="Live polish.",
        preserved_details=["Thorne"],
        potential_meaning_changes=[],
        unsupported_additions=[],
        review_warnings=[]
    ))
    monkeypatch.setattr("app.main.gemini_service.rewrite_text", mock_rewrite)
    
    response = client.post("/api/rewrite", json={
        "text": "Original text with Thorne for live processing.",
        "mode": "academic",
        "language": "en"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["is_sample"] is False
    assert "gemini" in data["model_used"]
    assert "Thorne" in data["rewritten_text"]

def test_tts_missing_key_returns_501(monkeypatch):
    from app.config import settings
    monkeypatch.setattr(settings, "ELEVENLABS_API_KEY", "")
    response = client.post("/api/tts", json={"text": "Hello world", "language": "en"})
    assert response.status_code == 501

def test_tts_with_mocked_elevenlabs(monkeypatch):
    from app.config import settings
    import httpx
    monkeypatch.setattr(settings, "ELEVENLABS_API_KEY", "test_elevenlabs_key")
    
    class MockResponse:
        status_code = 200
        content = b"fake-mp3-audio-bytes"
    
    async def mock_post(*args, **kwargs):
        return MockResponse()
        
    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)
    response = client.post("/api/tts", json={"text": "Testing ElevenLabs voice", "language": "hi"})
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/mpeg"
    assert response.content == b"fake-mp3-audio-bytes"


