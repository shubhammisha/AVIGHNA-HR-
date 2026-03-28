from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any

class Candidate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    cv_url: Optional[str] = None

class JobDescription(BaseModel):
    title: str
    requirements: List[str]
    nice_to_have: Optional[List[str]] = None
    min_experience_years: int

class AssessmentSession(BaseModel):
    candidate_id: str
    jd_id: str
    score: Optional[float] = None
    status: str = "pending"

class InterviewTranscript(BaseModel):
    session_id: str
    transcript: str
    missed_questions: List[str]
    summary: str
    technical_score: float
