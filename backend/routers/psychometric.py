from fastapi import APIRouter, HTTPException
from services.psychometric_service import psychometric_service
from typing import Dict

router = APIRouter(prefix="/psychometric", tags=["Psychometric Profiling"])

@router.post("/score")
async def score_responses(responses: Dict[str, int]):
    """Calculate cultural alignment score from Likert responses."""
    try:
        result = psychometric_service.calculate_cultural_score(responses)
        return {"result": result}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))
