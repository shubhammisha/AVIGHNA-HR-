from fastapi import APIRouter, HTTPException
from models.schemas import JobDescription
from services.llm_service import llm_service
from typing import Dict, Any

router = APIRouter(prefix="/jd", tags=["Job Description"])

@router.post("/refine")
async def refine_jd(raw_requirements: str):
    """Refine raw JD requirements into a structured JSON format using Gemini."""
    try:
        structured_jd = await llm_service.generate_structured_jd(raw_requirements)
        return structured_jd
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{jd_id}")
async def get_jd(jd_id: str):
    # Mock data for now
    return {"id": jd_id, "title": "Software Engineer", "requirements": ["Python", "FastAPI"]}
