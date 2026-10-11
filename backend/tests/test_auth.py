import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import create_tables

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    create_tables()

def test_register_and_login_flow():
    uid = str(uuid.uuid4())[:8]
    email = f"user_{uid}@example.com"
    username = f"user_{uid}"
    reg_payload = {
        "email": email,
        "username": username,
        "password": "SecurePassword123!",
        "full_name": "Test User"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 200, reg_res.text
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == email
    assert reg_data["user"]["username"] == username

    # 2. Duplicate registration fails
    dup_res = client.post("/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 400
    assert "already exists" in dup_res.json()["detail"].lower()

    # 3. Login with email
    login_res = client.post("/api/auth/login", json={
        "username_or_email": email,
        "password": "SecurePassword123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token

    # 4. Login with username
    login_user_res = client.post("/api/auth/login", json={
        "username_or_email": username,
        "password": "SecurePassword123!"
    })
    assert login_user_res.status_code == 200

    # 5. Login with invalid password fails
    bad_login = client.post("/api/auth/login", json={
        "username_or_email": username,
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # 6. Fetch profile (/api/auth/me) with bearer token
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["username"] == username

    # 7. Unauthenticated profile request fails
    unauth_res = client.get("/api/auth/me")
    assert unauth_res.status_code == 401

def test_user_saved_drafts_workflow():
    uid = str(uuid.uuid4())[:8]
    # Register a user for draft saving
    reg_payload = {
        "email": f"draft_{uid}@example.com",
        "username": f"draft_{uid}",
        "password": "Password123!",
        "full_name": "Draft Tester"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Save a draft
    draft_payload = {
        "original_text": "Draft original text for testing MySQL storage.",
        "rewritten_text": "Refined draft text safely stored in database.",
        "mode": "academic",
        "language": "en",
        "change_summary": "Scholarly syntax applied.",
        "preservation_score": 98.5
    }
    save_res = client.post("/api/user/saved-drafts", json=draft_payload, headers=headers)
    assert save_res.status_code == 200
    draft_data = save_res.json()
    draft_id = draft_data["id"]
    assert draft_data["mode"] == "academic"

    # Retrieve saved drafts
    get_res = client.get("/api/user/saved-drafts", headers=headers)
    assert get_res.status_code == 200
    drafts = get_res.json()
    assert len(drafts) >= 1
    assert any(d["id"] == draft_id for d in drafts)

    # Delete draft
    del_res = client.delete(f"/api/user/saved-drafts/{draft_id}", headers=headers)
    assert del_res.status_code == 200

    # Verify deleted
    get_after = client.get("/api/user/saved-drafts", headers=headers)
    assert all(d["id"] != draft_id for d in get_after.json())
