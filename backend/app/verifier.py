import re
from typing import List, Tuple, Set
from .schemas import VerificationResult

class DeterministicEntityVerifier:
    """
    Performs purely deterministic, rule-based extraction and verification
    of critical data points (names, numbers, dates, technical terms, quotations)
    between the original and rewritten text. Does not rely on LLM self-evaluation.
    """

    # Numbers, currencies, percentages, ratios (using negative lookahead for word char instead of trailing \b which fails on %)
    NUMERIC_PATTERN = re.compile(
        r'(?:[\$€£¥]\s*)?\b\d+(?:,\d{3})*(?:\.\d+)?(?:%|x|k|M|B|bn)?(?!\w)',
        re.IGNORECASE
    )

    # Dates (e.g., 2024, 2026-10-10, 10/12/2025, Oct 12, October 2026, Q3 2024)
    DATE_PATTERN = re.compile(
        r'\b(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|'
        r'Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}|'
        r'\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|Q[1-4]\s+\d{4})\b',
        re.IGNORECASE
    )

    # Direct quotations in single, double, or curly quotes
    QUOTE_PATTERN = re.compile(r'["“\']([^"”\']{3,80})["”\']')

    # Common technical terms, acronyms (2+ capital letters like API, NASA, HTTP, OAuth)
    ACRONYM_PATTERN = re.compile(r'\b[A-Z0-9]{2,}\b')

    # Multi-word proper names and capitalized entities (e.g., "Dr. Elena Rostova", "Google DeepMind")
    PROPER_NOUN_PATTERN = re.compile(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b')

    @classmethod
    def extract_entities(cls, text: str) -> List[Tuple[str, str]]:
        """
        Extract unique critical entities from the source text.
        Returns a list of tuples: (entity_type, entity_value).
        """
        entities: List[Tuple[str, str]] = []
        seen: Set[str] = set()

        # 1. Quotations
        for match in cls.QUOTE_PATTERN.finditer(text):
            val = match.group(1).strip()
            if val and val.lower() not in seen:
                seen.add(val.lower())
                entities.append(("Quotation", val))

        # 2. Dates
        for match in cls.DATE_PATTERN.finditer(text):
            val = match.group(0).strip()
            if val and val.lower() not in seen:
                seen.add(val.lower())
                entities.append(("Date/Time", val))

        # 3. Numeric & Metrics
        for match in cls.NUMERIC_PATTERN.finditer(text):
            val = match.group(0).strip()
            # filter out single digits if trivial unless meaningful
            if val and val.lower() not in seen:
                seen.add(val.lower())
                entities.append(("Numeric/Metric", val))

        # 4. Proper Nouns (Names, Places, Organizations)
        for match in cls.PROPER_NOUN_PATTERN.finditer(text):
            val = match.group(0).strip()
            if val and val.lower() not in seen:
                seen.add(val.lower())
                entities.append(("Proper Name", val))

        # 5. Acronyms & Technical Codes
        for match in cls.ACRONYM_PATTERN.finditer(text):
            val = match.group(0).strip()
            # Ignore standard common English 2-letter uppercase words like 'IN', 'IS', 'AT', 'TO'
            if len(val) == 2 and val in {"IN", "IS", "AT", "TO", "ON", "OF", "IT", "BY", "AN", "AS", "BE", "DO", "HE", "WE", "ME", "MY", "SO", "UP", "NO", "OR", "IF"}:
                continue
            if val and val.lower() not in seen:
                seen.add(val.lower())
                entities.append(("Acronym/Tech", val))

        return entities

    @classmethod
    def verify(
        cls,
        original_text: str,
        rewritten_text: str,
        ai_meaning_changes: List[str] = None,
        ai_unsupported_additions: List[str] = None,
        ai_warnings: List[str] = None
    ) -> VerificationResult:
        ai_meaning_changes = ai_meaning_changes or []
        ai_unsupported_additions = ai_unsupported_additions or []
        ai_warnings = list(ai_warnings or [])

        entities = cls.extract_entities(original_text)
        preserved: List[str] = []
        missing: List[str] = []

        rewritten_lower = rewritten_text.lower()

        for entity_type, entity_val in entities:
            # Check presence (case-insensitive substring check or clean token check)
            clean_val = entity_val.lower().strip()
            if clean_val in rewritten_lower:
                preserved.append(f"{entity_type}: {entity_val}")
            else:
                missing.append(f"{entity_type}: {entity_val}")

        total_detected = len(entities)
        total_preserved = len(preserved)

        if total_detected > 0:
            preservation_score = round((total_preserved / total_detected) * 100, 1)
        else:
            preservation_score = 100.0

        # Construct honest review warnings
        if missing:
            ai_warnings.append(
                f"Attention: {len(missing)} exact entity token(s) may have been rephrased, altered, or omitted."
            )

        if ai_meaning_changes:
            ai_warnings.append(
                f"Semantic review flagged {len(ai_meaning_changes)} possible nuance adjustment(s)."
            )

        if ai_unsupported_additions:
            ai_warnings.append(
                f"Notice: {len(ai_unsupported_additions)} supplemental phrasing addition(s) detected."
            )

        # Standard non-deceptive confidence statement
        if preservation_score == 100.0 and not ai_meaning_changes:
            confidence_statement = (
                "High Deterministic Integrity: All key numeric, nominal, and quote tokens match. "
                "Semantic alignment remains subject to probabilistic nuance."
            )
        elif preservation_score >= 80.0:
            confidence_statement = (
                "Moderate Deterministic Integrity: Most factual tokens were preserved, "
                "with slight rephrasing or entity contraction detected."
            )
        else:
            confidence_statement = (
                "Careful Review Recommended: Significant token omissions or changes detected. "
                "Please cross-examine proper names, numbers, or dates against the original."
            )

        return VerificationResult(
            exact_entities_detected=total_detected,
            exact_entities_preserved=total_preserved,
            preservation_score_pct=preservation_score,
            missing_entities=missing,
            preserved_entities=preserved,
            potential_meaning_changes=ai_meaning_changes,
            unsupported_additions=ai_unsupported_additions,
            review_warnings=ai_warnings,
            confidence_statement=confidence_statement
        )
