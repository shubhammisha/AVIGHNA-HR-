import os
from docx import Document
from typing import Optional

class CVParser:
    def __init__(self):
        # We no longer need LlamaParse keys here as we use native Gemini for PDF
        pass

    async def parse_document(self, file_path: str) -> str:
        """
        Fast local parsing for DOCX. 
        PDFs are handled natively by Gemini, so we just return the path for PDFs.
        """
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == ".docx":
            try:
                doc = Document(file_path)
                full_text = []
                for para in doc.paragraphs:
                    full_text.append(para.text)
                return "\n".join(full_text)
            except Exception as e:
                return f"DOCX parsing error: {str(e)}"
        
        elif ext == ".pdf":
            # For PDF, we return the path so LLMService can read it directly
            return file_path
            
        return "Unsupported file format."

cv_parser = CVParser()
