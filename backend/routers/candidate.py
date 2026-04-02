from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.cv_parser import cv_parser
from services.llm_service import llm_service
from services.vector_db import vector_service
from typing import List
import os
import uuid
import json
import asyncio

router = APIRouter(prefix="/candidates", tags=["Candidates"])

@router.post("/upload-cv")
async def upload_cv(
    files: List[UploadFile] = File(...),
    jd_text: str = Form(None)
):
    """Upload, parse, and analyze multiple CVs against a JD in parallel."""
    results = []
    
    async def process_single_cv(file: UploadFile):
        if not file.filename.endswith((".pdf", ".docx")):
            return {"name": file.filename, "error": "Unsupported format"}
        
        temp_path = f"/tmp/{uuid.uuid4()}_{file.filename}"
        content = await file.read()
        with open(temp_path, "wb") as f:
            f.write(content)
        
        try:
            # 1. Parse
            is_pdf = file.filename.endswith(".pdf")
            if is_pdf:
                import fitz
                doc = fitz.open(temp_path)
                cv_text = "".join([page.get_text() for page in doc])
            else:
                cv_text = await cv_parser.parse_document(temp_path)
            
            # 2. Parallel LLM Analysis and Embedding
            analysis_task = llm_service.analyze_cv_and_compare(cv_text, jd_text or "")
            embedding_task = llm_service.get_embedding(cv_text[:5000])
            
            analysis_result, embedding = await asyncio.gather(analysis_task, embedding_task)
            
            candidate_id = str(uuid.uuid4())
            
            # 3. Index in Vector DB
            await vector_service.add_candidate(
                candidate_id=candidate_id,
                vector=embedding,
                payload={
                    "name": file.filename, 
                    "summary": str(analysis_result.get("structured_data", ""))
                }
            )
            
            return {
                "name": file.filename,
                "candidate_id": candidate_id,
                "candidate_data": analysis_result.get("structured_data"),
                "comparison": analysis_result.get("comparison"),
                "score": analysis_result.get("comparison", {}).get("matching_score", 0)
            }
        except Exception as e:
            return {"name": file.filename, "error": str(e)}
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    # Process all files sequentially (1-by-1) for accuracy and stability
    results = []
    for file in files:
        result = await process_single_cv(file)
        results.append(result)
    
    # Sort by matching score (Ranking)
    results = sorted(results, key=lambda x: x.get("score", 0), reverse=True)
    
    # Generate Top 5 Summary if we have enough candidates
    top_5 = results[:5]
    summary = ""
    if len(results) > 0:
        summary = await llm_service.generate_top_5_summary(top_5, jd_text or "")
    
    return {
        "candidates": results,
        "top_5_summary": summary
    }
