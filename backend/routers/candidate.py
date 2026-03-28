from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from routers.job_description import get_jd
from services.cv_parser import cv_parser
from services.llm_service import llm_service
from services.vector_db import vector_service
import os
import uuid
import json

router = APIRouter(prefix="/candidates", tags=["Candidates"])

@router.post("/upload-cv")
async def upload_cv(
    file: UploadFile = File(...),
    jd_text: str = Form(None)
):
    """Upload, parse, and compare a CV against a JD."""
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Unsupported file format.")
    
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    
    try:
        # 1. Parse Document
        print(f"DEBUG: Starting parsing for {file.filename}...")
        raw_text = await cv_parser.parse_document(temp_path)
        print(f"DEBUG: Parsing complete. Length of raw_text: {len(raw_text)}, Preview: {raw_text[:100]}")
        
        # 2. Extract Structured JSON
        print("DEBUG: Starting LLM parsing...")
        structured_data = await llm_service.parse_cv_to_json(raw_text)
        print(f"DEBUG: LLM parsing complete. Structured Data Preview: {str(structured_data)[:150]}")
        
        # 3. Generate Embedding & Index in Vector DB
        print("DEBUG: Generating embedding...")
        candidate_id = str(uuid.uuid4())
        embedding = await llm_service.get_embedding(raw_text)
        await vector_service.add_candidate(
            candidate_id=candidate_id,
            vector=embedding,
            payload={"name": file.filename, "summary": structured_data.get("raw_response", "")}
        )
        print("DEBUG: Indexing complete.")
        
        # 4. Comparative Analysis (if JD provided)
        comparison_result = None
        if jd_text:
            print("DEBUG: Starting comparative analysis...")
            prompt = f"""
            Compare this candidate's CV against the Job Description (JD).
            
            JD:
            {jd_text}
            
            CV SUMMARY:
            {structured_data.get("raw_response", "")}
            
            TASK:
            1. Rank the candidate (0-100%) for this role.
            2. List specific requirements or lines from the JD that the candidate satisfies (matched_requirements).
            3. List top 3 matching skills.
            4. List top 2 gaps or missing skills.
            5. Provide a 1-sentence AI justification.
            
            OUTPUT FORMAT (JSON):
            {{
                "matching_score": 0,
                "matched_requirements": [],
                "top_skills": [],
                "gaps": [],
                "justification": ""
            }}
            
            IMPORTANT: Return ONLY the raw JSON object. Do not include any markdown styling (like ```json), introduction, or conversational text.
            """
            comparison_raw = await llm_service.generate_response(prompt, model="groq")
            print("DEBUG: Comparison complete.", comparison_raw[:100])
            try:
                import re
                # Find JSON block even if there is conversational text
                match = re.search(r'\{.*\}', comparison_raw, re.DOTALL)
                if match:
                    json_str = match.group(0)
                else:
                    json_str = comparison_raw.replace("```json", "").replace("```", "").strip()
                comparison_result = json.loads(json_str)
            except Exception as e:
                print(f"JSON Parsing error: {e}\nRaw output: {comparison_raw}")
                comparison_result = {
                    "matching_score": "N/A",
                    "top_skills": [],
                    "gaps": [],
                    "justification": comparison_raw # Fallback to raw text
                }

        return {
            "candidate_id": candidate_id,
            "candidate_data": structured_data,
            "comparison": comparison_result,
            "indexed": True
        }
    except Exception as e:
        print(f"DEBUG ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

