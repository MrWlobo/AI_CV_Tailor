from fastapi import FastAPI, UploadFile, File, Form
import io
from pypdf import PdfReader

app = FastAPI()

@app.post("/tailor")
async def tailor_cv(
    cv_file: UploadFile = File(...),
    job_url: str = Form(...),
):
    # Get CV content as bytes
    cv_bytes = await cv_file.read()

    # Transform bytes to readable content
    pdf_stream = io.BytesIO(cv_bytes)
    reader = PdfReader(pdf_stream)
    cv_text = "".join([page.extract_text() for page in reader.pages])