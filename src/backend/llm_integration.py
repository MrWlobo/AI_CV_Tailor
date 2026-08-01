from dotenv import load_dotenv
from typing import Literal
from langchain.chat_models import init_chat_model
from pathlib import Path
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent.parent.parent
dotenv_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=dotenv_path)


class CVTailorResponse(BaseModel):
    status: Literal["success", "failure"] = Field(description="Processing status")
    tailored_cv: str = Field(description="Improved version of the CV")
    match_score: int = Field(ge=0, le=100, description="Match score between 0 and 100")
    recommendations: list[str] = Field(description="List of concise recommendations")


system_prompt = """
    You are an AI CV tailor. You will receive a transcript of a CV and a job offer.
    Your task is to grade how well the CV matches the offer on a scale 0-100, return
    an improved version of CV and provide the user with some concise recommendations.

    Your input will hav the form of the following f-string:
    f"CV TRANSCRIPT:\n{cv_transcript}\nJOB OFFER:\n{job_offer}"

    Your tailored_cv response will be converted to pdf using xhtml2pdf Python library,
    so it MUST be a valid HTML file with <style> tags. Use modern layouts and toned colors.
    """

base_model = init_chat_model(
    model="gemini-2.5-flash",
    model_provider="google_genai",
    temperature=0.1,
)

model = base_model.with_structured_output(CVTailorResponse)


def get_tailored_results(cv_transcript: str, job_offer: str):
    user_content = f"CV TRANSCRIPT:\n{cv_transcript}\nJOB OFFER:\n{job_offer}"

    response = model.invoke([("system", system_prompt), ("user", user_content)])
    return response
