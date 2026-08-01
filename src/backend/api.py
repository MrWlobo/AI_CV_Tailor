from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import io
from pypdf import PdfReader
from backend.llm_integration import get_tailored_results
from fastapi.middleware.cors import CORSMiddleware
import io
from xhtml2pdf import pisa

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def convert_html_to_pdf(html_string: str) -> bytes:
    pdf_buffer = io.BytesIO()
    pisa_status = pisa.CreatePDF(io.StringIO(html_string), dest=pdf_buffer)

    if pisa_status.err:
        raise Exception("Failed to convert HTML to PDF")

    return pdf_buffer.getvalue()


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/tailor")
async def tailor_cv(cv_file: UploadFile = File(...), job_offer: str = Form(...)):
    try:
        # Get CV content as bytes
        cv_bytes = await cv_file.read()

        # Transform bytes to readable content
        pdf_stream = io.BytesIO(cv_bytes)
        reader = PdfReader(pdf_stream)
        cv_text = "".join([page.extract_text() or "" for page in reader.pages])

        # Call LLM to make its assessments
        tailored_results = get_tailored_results(cv_text, job_offer)

        # Return results to frontend
        return {
            "status": tailored_results.status,
            "tailored_cv": convert_html_to_pdf(tailored_results.tailored_cv),
            "match_score": tailored_results.match_score,
            "recommendations": tailored_results.recommendations,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
