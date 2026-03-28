import os
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
        response = await llm_service.generate_response(prompt, model="gemini-1.5-pro")
        return {
            "raw_analysis": response
        }

interview_service = InterviewService()
