import os
import json
import google.generativeai as genai
from groq import AsyncGroq
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Ensure env vars are loaded
load_dotenv()

class LLMService:
    def __init__(self):
        gemini_key = os.getenv("GEMINI_API_KEY")
        groq_key = os.getenv("GROQ_API_KEY")
        
        self.gemini_pro = None
        self.gemini_flash = None
        self.groq_client = None

        if gemini_key:
            genai.configure(api_key=gemini_key)
            self.gemini_pro = genai.GenerativeModel("gemini-1.5-pro")
            self.gemini_flash = genai.GenerativeModel("gemini-1.5-flash")
        
        if groq_key:
            self.groq_client = AsyncGroq(api_key=groq_key)

    async def generate_response(self, prompt: str, model: str = "gemini-1.5-flash") -> str:
        """Generic method to generate response from LLM."""
        try:
            if model.startswith("gemini"):
                target_model = self.gemini_pro if "pro" in model else self.gemini_flash
                if not target_model:
                    return f"Gemini model {model} not initialized. Check API Key."
                response = await target_model.generate_content_async(prompt)
                return response.text
            elif "llama" in model or "mixtral" in model or (model == "groq" and hasattr(self, 'groq_client')):
                real_model = model if model != "groq" else "llama-3.1-8b-instant"
                chat_completion = await self.groq_client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model=real_model,
                )
                return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Error with {model}: {str(e)}"
        return "Model not configured"

    async def get_embedding(self, text: str) -> List[float]:
        """Generate embeddings using Gemini."""
        try:
            if not os.getenv("GEMINI_API_KEY"):
                return [0.0] * 768
            
            import asyncio
            # Adding a 10s timeout to prevent long hangs if DNS fails
            result = await asyncio.wait_for(
                asyncio.to_thread(
                    genai.embed_content,
                    model="models/embedding-001",
                    content=text,
                    task_type="retrieval_document"
                ),
                timeout=10.0
            )
            return result['embedding']
        except Exception as e:
            print(f"Embedding error: {e}")
            return [0.0] * 768

    async def parse_cv_to_json(self, cv_text: str) -> Dict[str, Any]:
        """Convert raw CV text to structured JSON using Gemini Flash."""
        prompt = f"""
        Extract the following information from the candidate's CV text into a structured JSON format:
        - Full Name
        - Contact Information (Email, Phone, Location)
        - Experience (List of: Job Title, Company, Duration, Key Responsibilities)
        - Skills (Categorized into Technical, Soft, and Domain)
        - Education (List of: Degree, Institution, Year)
        - Certifications
        
        CV TEXT:
        {cv_text}
        
        IMPORTANT: Return ONLY the raw JSON object. Do not include any markdown styling (like ```json) or conversational text.
        """
        response_text = await self.generate_response(prompt, model="groq")
        print(f"DEBUG GROQ RAW RESPONSE: {response_text[:400]}")
        
        try:
            import re
            match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if match:
                clean_json = match.group(0)
            else:
                clean_json = response_text.replace("```json", "").replace("```", "").strip()
            # Just to validate if it's JSON
            json.loads(clean_json) 
            return {"raw_response": clean_json}
        except Exception as e:
            print(f"CV parsing JSON error: {e}")
            return {"raw_response": response_text}

llm_service = LLMService()
