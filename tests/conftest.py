import io
import pytest
from fastapi.testclient import TestClient
from backend.api import app


@pytest.fixture
def api_client():
    return TestClient(app)


@pytest.fixture
def sample_pdf_bytes():
    return b"%PDF-1.4 sample content for testing"


@pytest.fixture
def valid_payload(sample_pdf_bytes):
    return {
        "files": {
            "cv_file": ("cv.pdf", sample_pdf_bytes, "application/pdf")
        },
        "data": {
            "job_url": "https://example.com/job-offer"
        },
    }
