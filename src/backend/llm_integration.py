import requests
from dotenv import load_dotenv
from langchain.agents import create_agent
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
dotenv_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=dotenv_path)

