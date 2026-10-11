import pytest
from app.verifier import DeterministicEntityVerifier

def test_extract_entities_complete_suite():
    text = (
        "On October 14, 2026, Dr. Aris Thorne reported that Project Apex achieved a 42.8% boost "
        "across 12,000 edge nodes. 'We proved that distributed consensus is feasible at under $0.003,' "
        "said Thorne in Geneva regarding the new HTTP protocol."
    )
    entities = DeterministicEntityVerifier.extract_entities(text)
    entity_values = [v for _, v in entities]
    
    # Check date
    assert any("October 14, 2026" in val for val in entity_values)
    # Check numbers / percentages / currencies
    assert any("42.8%" in val for val in entity_values)
    assert any("12,000" in val for val in entity_values)
    assert any("$0.003" in val for val in entity_values)
    # Check proper names
    assert any("Dr. Aris" in val or "Aris Thorne" in val for val in entity_values)
    # Check quotations
    assert any("We proved that distributed consensus is feasible at under $0.003" in val for val in entity_values)
    # Check acronyms/tech
    assert any("HTTP" in val for val in entity_values)

def test_verifier_perfect_preservation():
    orig = "On May 3, 2025, Dr. Elena Rostova recorded 450 cases with 88% precision."
    rewritten = "During the study on May 3, 2025, Dr. Elena Rostova recorded 450 cases achieving 88% precision."
    
    result = DeterministicEntityVerifier.verify(orig, rewritten)
    assert result.preservation_score_pct == 100.0
    assert len(result.missing_entities) == 0
    assert "High Deterministic Integrity" in result.confidence_statement

def test_verifier_missing_entity_warning():
    orig = "On May 3, 2025, Dr. Elena Rostova recorded 450 cases with 88% precision."
    # rewritten drops the date and alters percentage to 'high precision'
    rewritten = "Dr. Elena Rostova recorded 450 cases with high precision."
    
    result = DeterministicEntityVerifier.verify(orig, rewritten)
    assert result.preservation_score_pct < 100.0
    assert any("May 3, 2025" in m for m in result.missing_entities)
    assert any("88%" in m for m in result.missing_entities)
    assert any("exact entity token(s) may have been rephrased" in w for w in result.review_warnings)

def test_verifier_semantic_changes_reported():
    orig = "The system crashed 5 times."
    rewritten = "The system experienced minor hiccups 5 times."
    ai_meaning = ["Altered 'crashed' to 'minor hiccups', minimizing system severity."]
    
    result = DeterministicEntityVerifier.verify(
        orig,
        rewritten,
        ai_meaning_changes=ai_meaning
    )
    assert len(result.potential_meaning_changes) == 1
    assert any("nuance adjustment" in w for w in result.review_warnings)
