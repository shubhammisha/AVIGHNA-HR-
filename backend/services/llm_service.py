import os
import json
import base64
import google.generativeai as genai
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Ensure env vars are loaded
load_dotenv()

class LLMService:
    def __init__(self):
        gemini_key = os.getenv("GEMINI_API_KEY")
        
        self.client = None
        if gemini_key:
            genai.configure(api_key=gemini_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash")

    async def generate_response(self, prompt: str, model: str = "gemini-1.5-flash") -> str:
        """Generic method to generate response from LLM."""
        try:
            # We standardize on gemini-1.5-flash for speed
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            return f"Error with {model}: {str(e)}"

    async def get_embedding(self, text: str) -> List[float]:
        """Generate embeddings using Gemini (Threaded to avoid blocking)."""
        import asyncio
        import time
        try:
            if not os.getenv("GEMINI_API_KEY"):
                return [0.0] * 768
            
            # Use to_thread because embed_content is a blocking network call
            start = time.time()
            result = await asyncio.to_thread(
                genai.embed_content,
                model="models/embedding-001",
                content=text,
                task_type="retrieval_document"
            )
            print(f"DEBUG: Embedding Latency: {time.time() - start:.2f}s")
            return result['embedding']
        except Exception as e:
            print(f"Embedding error: {e}")
            return [0.0] * 768

    async def analyze_cv_and_compare(self, cv_source: Any, jd_text: str, is_file: bool = False) -> Dict[str, Any]:
        """
        Consolidated method to extract CV data and compare it against JD in ONE call.
        Supports both raw text and PDF file paths.
        """
        import time
        start_all = time.time()
        
        prompt = f"""
        TASK:
        1. Extract candidate information (Name, Contact, Experience, Skills, Education) from the CV.
        2. Compare this candidate against the provided Job Description (JD).
        3. Provide a matching score (0-100), matched requirements, top skills, gaps, and a justification.

        JD:
        {jd_text}

        OUTPUT FORMAT (Return ONLY raw JSON):
        {{
            "structured_data": {{
                "full_name": "",
                "contact": {{ "email": "", "phone": "", "location": "" }},
                "experience": [],
                "skills": {{ "technical": [], "soft": [], "domain": [] }},
                "education": []
            }},
            "comparison": {{
                "matching_score": 0,
                "matched_requirements": [],
                "top_skills": [],
                "gaps": [],
                "justification": ""
            }}
        }}
        """

        try:
            if is_file and cv_source.endswith(".pdf"):
                print(f"DEBUG: Starting Native PDF Analysis for {cv_source}...")
                with open(cv_source, "rb") as f:
                    pdf_data = base64.b64encode(f.read()).decode("utf-8")
                
                response = await self.model.generate_content_async([
                    {"mime_type": "application/pdf", "data": pdf_data},
                    prompt
                ])
            else:
                print("DEBUG: Starting Text-based Analysis...")
                response = await self.model.generate_content_async(f"{prompt}\n\nCV TEXT:\n{cv_source}")
            
            response_text = response.text
            print(f"DEBUG: LLM Analysis complete in {time.time() - start_all:.2f}s")
            
            import re
            match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            return {"error": "Could not parse JSON from model response", "raw": response_text}
            
        except Exception as e:
            print(f"Consolidated analysis error: {e}")
            return {"error": str(e)}

llm_service = LLMService()
