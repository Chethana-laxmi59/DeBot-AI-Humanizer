import pytest
from pydantic import ValidationError
from app.schemas import RewriteRequest, WritingMode

def test_rewrite_request_valid():
    req = RewriteRequest(
        text="This is a valid piece of text for testing writing refinement.",
        mode=WritingMode.ACADEMIC,
        language="en",
        custom_instructions="Preserve passive markers."
    )
    assert req.mode == WritingMode.ACADEMIC
    assert req.text.startswith("This is a valid")

def test_rewrite_request_too_short():
    with pytest.raises(ValidationError):
        RewriteRequest(text="Hi")

def test_rewrite_request_whitespace_only():
    with pytest.raises(ValidationError):
        RewriteRequest(text="     \n\t   ")

def test_rewrite_request_too_long():
    long_text = "a" * 5001
    with pytest.raises(ValidationError):
        RewriteRequest(text=long_text)

def test_rewrite_request_invalid_mode():
    with pytest.raises(ValidationError):
        RewriteRequest(text="Valid length input text.", mode="super_hyper_mode")
