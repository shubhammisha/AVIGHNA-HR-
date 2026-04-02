import os
import json
from groq import Groq
from typing import List, Dict, Any, Optional
from services.llm_service import llm_service

class InterviewService:
    def __init__(self):
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            self.client = Groq(api_key=groq_key)

    async def transcribe_audio(self, audio_file_path: str) -> str:
        """Transcribe audio using Groq Whisper."""
        if not hasattr(self, 'client'):
            return "Groq client not configured for transcription."
        
        try:
            with open(audio_file_path, "rb") as audio_file:
                # Using whisper-large-v3-turbo on Groq for even faster performance
                translation = self.client.audio.transcriptions.create(
                    file=(os.path.basename(audio_file_path), audio_file.read()),
                    model="whisper-large-v3-turbo",
                    response_format="json",
                )
            return translation.text
        except Exception as e:
            return f"Transcription error: {str(e)}"

    async def analyze_transcript(self, transcript: str, must_ask_questions: List[str]) -> Dict[str, Any]:
        """Check for missed questions and generate an initial evaluation."""
        prompt = f"""
        Analyze the following interview transcript.
        
        MUST-ASK QUESTIONS:
        {must_ask_questions}
        
        TRANSCRIPT:
        {transcript}
        
        TASK:
        1. Identify which "Must-Ask" questions were NOT asked or adequately answered.
        2. Provide a 2-3 sentence summary of the candidate's performance.
        3. Score the candidate's responses (1-10) against technical competence.
        
        OUTPUT FORMAT (JSON):
        {{
            "missed_questions": [],
            "performance_summary": "",
            "technical_score": 0
        }}
        """
        response = await llm_service.generate_response(prompt, model="llama-3.3-70b-versatile")
        return {
            "raw_analysis": response
        }

    async def extract_entities(self, text: str) -> List[Dict[str, str]]:
        """Extract names and companies from a transcript segment using Groq."""
        prompt = f"""
        TASK: Extract any mentioned colleagues, former coworkers, or professional contacts from the following interview transcript snippet.
        
        TRANSCRIPT:
        {text}
        
        OUTPUT FORMAT (JSON List):
        [
            {{"name": "Full Name", "company": "Company Name", "role": "Full Role Description"}}
        ]
        
        RULES:
        1. Only include REAL PEOPLE mentioned.
        2. If company is not mentioned, guess it from context or use your knowledge.
        3. Keep it empty [] if no names are found. Output ONLY the JSON list.
        """
        response = await llm_service.generate_response(prompt, model="llama-3.3-70b-versatile")
        try:
            import json, re
            match = re.search(r'\[.*\]', response, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            return []
        except:
            return []

    async def search_linkedin_profiles(self, name: str, company: str) -> List[Dict[str, Any]]:
        """Search for LinkedIn profiles using Serper.dev."""
        serper_key = os.getenv("SERPER_API_KEY")
        if not serper_key:
            return []
        
        import requests
        url = "https://google.serper.dev/search"
        # Search for Name + Company on LinkedIn
        query = f'site:linkedin.com/in "{name}" {company}'
        payload = json.dumps({"q": query})
        headers = {
            'X-API-KEY': serper_key,
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.request("POST", url, headers=headers, data=payload)
            results = response.json().get("organic", [])
            matches = []
            for res in results[:2]: # Top 2 matches
                matches.append({
                    "title": res.get("title"),
                    "link": res.get("link"),
                    "snippet": res.get("snippet")
                })
            return matches
        except Exception as e:
            print(f"Serper error: {e}")
            return []

interview_service = InterviewService()
