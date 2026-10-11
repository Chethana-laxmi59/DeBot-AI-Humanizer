from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

class WritingMode(str, Enum):
    STANDARD = "standard"
    ACADEMIC = "academic"
    CASUAL = "casual"
    PROFESSIONAL = "professional"
    CREATIVE = "creative"
    SIMPLE = "simple"

class SupportedLanguage(str, Enum):
    EN = "en"  # English
    TE = "te"  # Telugu (తెలుగు)
    HI = "hi"  # Hindi (हिन्दी)
    ES = "es"  # Spanish
    FR = "fr"  # French
    DE = "de"  # German
    IT = "it"  # Italian
    PT = "pt"  # Portuguese
    JA = "ja"  # Japanese
    ZH = "zh"  # Chinese
    KO = "ko"  # Korean
    NL = "nl"  # Dutch

class RewriteRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=5,
        max_length=5000,
        description="The source text to be refined and rewritten."
    )
    mode: WritingMode = Field(
        default=WritingMode.STANDARD,
        description="Target refinement tone/style."
    )
    language: str = Field(
        default="en",
        description="Target output language code (e.g. en, es, fr, de)."
    )
    custom_instructions: Optional[str] = Field(
        default=None,
        max_length=300,
        description="Optional stylistic nuance or preservation directive."
    )

    @field_validator("text")
    @classmethod
    def validate_text(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Input text cannot be purely whitespace.")
        return stripped

class DeterministicEntityCheck(BaseModel):
    entity_type: str
    entity_value: str
    found_in_rewrite: bool

class VerificationResult(BaseModel):
    exact_entities_detected: int = 0
    exact_entities_preserved: int = 0
    preservation_score_pct: float = 100.0
    missing_entities: List[str] = Field(default_factory=list)
    preserved_entities: List[str] = Field(default_factory=list)
    potential_meaning_changes: List[str] = Field(default_factory=list)
    unsupported_additions: List[str] = Field(default_factory=list)
    review_warnings: List[str] = Field(default_factory=list)
    confidence_statement: str = ""

class RewriteResponse(BaseModel):
    original_text: str
    rewritten_text: str
    mode: WritingMode
    language: str
    change_summary: str
    word_count_original: int
    word_count_rewritten: int
    char_count_original: int
    char_count_rewritten: int
    reading_time_seconds_original: int
    reading_time_seconds_rewritten: int
    preserved_details: List[str] = Field(default_factory=list)
    verification: VerificationResult
    is_sample: bool = False
    model_used: str

class TTSRequest(BaseModel):
    text: str = Field(..., max_length=2000, description="Text to synthesize")
    language: Optional[str] = Field(default="en", description="Target language code")

class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
    model: str
    has_api_key: bool
    allowed_modes: List[str]
    has_elevenlabs_key: bool = False

class ModeInfo(BaseModel):
    id: str
    label: str
    tagline: str
    description: str
    tone_characteristics: List[str]
    sample_preview: str

class SamplePreset(BaseModel):
    id: str
    title: str
    mode: WritingMode
    original_text: str
    rewritten_text: str
    change_summary: str
    preserved_details: List[str]
    potential_meaning_changes: List[str]
    unsupported_additions: List[str]
    review_warnings: List[str]
