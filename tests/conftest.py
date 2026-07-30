import io
import pytest
from fastapi.testclient import TestClient
from backend.api import app


@pytest.fixture
def api_client():
    return TestClient(app)


@pytest.fixture
def sample_pdf_bytes():
    return (
        b"%PDF-1.4\n"
        b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
        b"2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n"
        b"3 0 obj<</Type/Page/MediaBox[0 0 300 144]/Parent 2 0 R/Resources<<>>>>endobj\n"
        b"xref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\n"
        b"trailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\n"
    )


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
