from fastapi import APIRouter, File, UploadFile, HTTPException
from services.interview_service import interview_service
from typing import List

router = APIRouter(prefix="/interview", tags=["Interview Copilot"])

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """Transcribe interview audio."""
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    
    try:
        transcript = await interview_service.transcribe_audio(temp_path)
        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        import os
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/analyze")
async def analyze(transcript: str, must_ask: List[str]):
    """Analyze transcript for missed questions and performance."""
    try:
        analysis = await interview_service.analyze_transcript(transcript, must_ask)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
