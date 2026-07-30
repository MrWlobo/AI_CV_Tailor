from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_read_root_status_code():
    response = client.get("/")
    assert response.status_code == 200


def test_read_root_json_content():
    response = client.get("/")
    assert response.json() == {"Hello": "World"}
