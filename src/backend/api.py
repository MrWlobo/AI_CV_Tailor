from fastapi import FastAPI, UploadFile, File, Form
import io
from pypdf import PdfReader

app = FastAPI()

@app.post("/tailor")
async def tailor_cv(cv_file: UploadFile = File(...), job_url: str = Form(...)):
    # Get CV content as bytes
    cv_bytes = await cv_file.read()

    # Transform bytes to readable content
    pdf_stream = io.BytesIO(cv_bytes)
    reader = PdfReader(pdf_stream)
    cv_text = "".join([page.extract_text() or "" for page in reader.pages])

    # Call LLM to make its assessments
    status, tailored_cv, match_score, recommendations = get_tailored_results(cv_text, job_url)

    # Return results to frontend
    return {
        "status": status,
        "tailored_cv": tailored_cv,
        "match_score": match_score,
        "recommendations": recommendations,
    }

def get_tailored_results(cv_text: str, job_url: str):
    return (
        "success",
        f"Tailored CV content generated from {len(cv_text)} characters",
        85,
        ["Add Python keywords", "Highlight FastAPI experience"],
    )
