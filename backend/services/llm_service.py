import os
import json
from groq import AsyncGroq
from openai import AsyncOpenAI
import asyncio
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Ensure env vars are loaded
load_dotenv()

class LLMService:
    def __init__(self):
        groq_key = os.getenv("GROQ_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")
        
        self.groq_client = None
        if groq_key:
            self.groq_client = AsyncGroq(api_key=groq_key)
            self.groq_model = "openai/gpt-oss-120b"
            
        self.openai_client = None
        if openai_key:
            self.openai_client = AsyncOpenAI(api_key=openai_key)
            self.embedding_model = "text-embedding-3-large"

    async def generate_response(self, prompt: str, model: str = None) -> str:
        """Generate response from Groq for maximum speed and instruction following."""
        try:
            if not self.groq_client:
                return "Groq not initialized. Check API Key."
            
            selected_model = model if model else self.groq_model
            
            chat_completion = await self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=selected_model,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq Error: {e}")
            return f"Error with Groq: {str(e)}"

    async def get_embedding(self, text: str) -> List[float]:
        """Generate high-end embeddings using OpenAI text-embedding-3-large (3072 dims)."""
        try:
            if not self.openai_client:
                return [0.0] * 3072
            
            response = await self.openai_client.embeddings.create(
                input=[text.replace("\n", " ")],
                model=self.embedding_model
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"OpenAI Embedding error: {e}")
            return [0.0] * 3072

    async def generate_structured_jd(self, raw_requirements: str) -> Dict[str, Any]:
        """Convert messy requirements into a premium structured JD in JSON format using Groq."""
        prompt = f"""
        TASK: Convert these raw requirements into a professional, premium-standard Job Description.
        
        REQUIREMENTS:
        {raw_requirements}
        
        OUTPUT FORMAT (Return ONLY raw JSON):
        {{
            "job_title": "",
            "role_summary": "",
            "responsibilities": [],
            "must_have_skills": [],
            "preferred_skills": [],
            "experience_required": "",
            "benefits": [],
            "standardized_text": "Full markdown version of the JD here"
        }}
        """
        response_text = await self.generate_response(prompt)
        try:
            import re
            match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            return {"error": "JSON parse error", "raw": response_text}
        except Exception as e:
            return {"error": str(e), "raw": response_text}

    async def analyze_cv_and_compare(self, cv_text: str, jd_text: str) -> Dict[str, Any]:
        """
        Enhanced analysis using Groq for high accuracy and speed.
        """
        prompt = f"""
        TASK:
        1. Extract candidate information from the CV.
        2. Compare candidate against the JD.
        3. Provide a matching score (0-100), matched requirements, gaps, and justification.

        JD:
        {jd_text}

        CV TEXT:
        {cv_text[:10000]} # Limit for token efficiency

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
            response_text = await self.generate_response(prompt)
            import re
            match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            return {"error": "Could not parse JSON", "raw": response_text}
        except Exception as e:
            print(f"Analysis error: {e}")
            return {"error": str(e)}

    async def generate_top_5_summary(self, top_candidates: List[Dict[str, Any]], jd_text: str) -> str:
        """Analyze why the Top 5 candidates are the best fit compared to the general pool."""
        try:
            candidates_data = []
            for c in top_candidates:
                candidates_data.append({
                    "name": c.get("name"),
                    "score": c.get("score"),
                    "matched": c.get("comparison", {}).get("matched_requirements", []),
                    "justification": c.get("comparison", {}).get("justification", "")
                })

            prompt = f"""
            TASK: You are a Lead Recruiter. Review the Top 5 candidates listed below and provide a concise, high-impact summary (3-4 sentences) explaining why these individuals are the absolute best fit for the role compared to the rest of the applicants. Focus on unique strengths, alignment with critical JD requirements, and overall potential.

            JOB DESCRIPTION:
            {jd_text[:2000]}

            TOP 5 CANDIDATES:
            {json.dumps(candidates_data, indent=2)}

            OUTPUT: A professional, persuasive paragraph summarizing the Top 5's collective superiority.
            """
            return await self.generate_response(prompt)
        except Exception as e:
            print(f"Summary generation error: {e}")
            return "Unable to generate comparative summary at this time."

llm_service = LLMService()
