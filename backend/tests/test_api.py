import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.seed_data import seed_database

@pytest.fixture(scope="module")
def client():
    # Ensure tables exist and are seeded
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
    
    with TestClient(app) as test_client:
        yield test_client

def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["app"] == "GrandPulse API"

def test_get_members(client):
    res = client.get("/api/members")
    assert res.status_code == 200
    members = res.json()
    assert len(members) >= 3
    # Verify rankings and keys
    assert "score" in members[0]
    assert "rank" in members[0]
    assert members[0]["rank"] == 1

def test_get_summary_analytics(client):
    res = client.get("/api/analytics/summary")
    assert res.status_code == 200
    summary = res.json()
    assert summary["active_members"] >= 3
    assert summary["total_tasks"] >= 20
    assert summary["total_logs"] >= 20
    assert summary["total_points"] > 0

def test_tasks_attribution_trigger(client):
    # Fetch pending tasks
    res = client.get("/api/tasks?status=Pending")
    assert res.status_code == 200
    tasks = res.json()
    assert len(tasks) > 0
    task_id = tasks[0]["id"]
    assignee_id = tasks[0]["assignee_id"]

    # Mark as completed to trigger automated attribution engine
    res_status = client.patch(f"/api/tasks/{task_id}/status", json={"status": "Completed"})
    assert res_status.status_code == 200
    body = res_status.json()
    assert body["status"] == "Completed"
    assert body["attribution"] is not None
    assert "credited to" in body["attribution"]["message"]

def test_excel_export_openpyxl(client):
    res = client.get("/api/export/excel")
    assert res.status_code == 200
    assert "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" in res.headers["content-type"]
    assert len(res.content) > 1000  # Valid binary excel content

def test_csv_export(client):
    res = client.get("/api/export/csv")
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    assert b"Member ID" in res.content

def test_auth_flow(client):
    # Login as seed user
    res = client.post("/api/auth/login", json={"username": "shuvo", "password": "password123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    token = data["access_token"]

    # Verify protected /me
    res_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    user_data = res_me.json()
    assert user_data["username"] == "shuvo"
    assert user_data["role"] == "Lead Architect"
