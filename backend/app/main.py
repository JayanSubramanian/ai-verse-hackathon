from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List

from .models.schemas import UserProfile, AgentResponse, User, ApplicationFeedback, RoadmapDB
from .agents.core import CareerAgent
from .services.resume_parser import ResumeParser
from .database.db import engine, get_session, create_db_and_tables

app = FastAPI(title="CareerCompass AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = CareerAgent()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "CareerCompass AI Backend is running"}

@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = ResumeParser.extract_text(content)
        metadata = ResumeParser.parse_metadata(text)
        return {"text": text, "metadata": metadata}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume upload failed: {str(e)}")

@app.post("/api/analyze", response_model=AgentResponse)
async def analyze_profile(profile: UserProfile, session: Session = Depends(get_session)):
    try:
        # Check if user exists in memory (persistent memory)
        statement = select(User).where(User.email == "user@example.com") # Mock email for now
        user = session.exec(statement).first()
        
        history = []
        if user:
            history = user.feedbacks
        
        response = agent.analyze_profile(profile, history=history)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/feedback")
async def submit_feedback(feedback: ApplicationFeedback, session: Session = Depends(get_session)):
    try:
        session.add(feedback)
        session.commit()
        return {"message": "Feedback received. Agent will adapt future plans."}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/jobs")
async def get_job_recommendations(profile: UserProfile):
    return agent.recommend_jobs(profile)