from fastapi import APIRouter, File, UploadFile, HTTPException
from services.interview_service import interview_service
from typing import List

router = APIRouter(prefix="/interview", tags=["Interview Copilot"])

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """Transcribe interview audio."""
    print(f">>> [DEBUG] Received audio chunk: {file.filename}")
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    
    try:
        transcript = await interview_service.transcribe_audio(temp_path)
        print(f">>> [DEBUG] Transcript: {transcript[:100]}...")
        return {"transcript": transcript}
    except Exception as e:
        print(f">>> [DEBUG] Transcription Error: {e}")
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
@router.post("/analyze-stream")
async def analyze_stream(text: str):
    """Real-time entity extraction and LinkedIn matching."""
    print(f">>> [DEBUG] Analyzing stream text: {text[:50]}...")
    entities = await interview_service.extract_entities(text)
    print(f">>> [DEBUG] Extracted entities: {entities}")
    enriched_entities = []
    
    for ent in entities:
        if ent.get("name"):
            print(f">>> [DEBUG] Searching LinkedIn for: {ent['name']} @ {ent.get('company')}")
            matches = await interview_service.search_linkedin_profiles(ent["name"], ent.get("company", ""))
            print(f">>> [DEBUG] Matches found: {len(matches)}")
            enriched_entities.append({
                "entity": ent,
                "matches": matches
            })
            
    return {"entities": enriched_entities}
