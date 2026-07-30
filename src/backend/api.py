from fastapi import FastAPI, UploadFile, File, Form

app = FastAPI()

@app.post("/tailor")
async def upload_cv_and_offer_link(
    cv_file: UploadFile = File(...),
    job_url: str = Form(...),
):
    pass
