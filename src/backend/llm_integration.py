from dotenv import load_dotenv
from typing import Literal
from langchain.chat_models import init_chat_model
from pathlib import Path
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent.parent.parent
dotenv_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=dotenv_path)

class CVTailorResponse(BaseModel):
    status: Literal["success", "failure"] = Field(
        description="Processing status"
    )
    tailored_cv: str = Field(
        description="Improved version of the CV"
    )
    match_score: int = Field(
        ge=0, le=100, description="Match score between 0 and 100"
    )
    recommendations: list[str] = Field(
        description="List of concise recommendations"
    )

system_prompt = """
    You are an AI CV tailor. You will receive a transcript of a CV and a job offer.
    Your task is to grade how well the CV matches the offer on a scale 0-100, return
    an improved version of CV and provide the user with some concise recommendations.

    Your input will hav the form of the following f-string:
    f"CV TRANSCRIPT:\n{cv_transcript}\nJOB OFFER:\n{job_offer}"

    You MUST return ONLY the json of a following structure as your response:
    {
        "status": "success" or "failure",
        "tailored_cv": improved CV as a string,
        "match_score": integer from 0 to 100 including 0 and 100,
        "recommendations": short reccomendations for the user as a list of strings,
    }
    DO NOT return any additional messages.
    """

model = init_chat_model(
    model="gemini-2.5-flash",
    model_provider="google_genai",
    temperature=0.1,
    system_prompt=system_prompt,
)

def get_tailored_results(cv_transcript: str, job_offer: str):
    response = model.invoke({
        "messages": [
            {"role": "user", "content": f"CV TRANSCRIPT:\n{cv_transcript}\nJOB OFFER:\n{job_offer}"}
        ]
    })

    return response
