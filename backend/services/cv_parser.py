import os
from llama_cloud.client import AsyncLlamaCloud
from typing import List, Dict, Any

class CVParser:
    def __init__(self):
        self.api_key = os.getenv("LLAMAPARSE_API_KEY")
        if self.api_key:
            self.client = AsyncLlamaCloud(token=self.api_key)

    async def parse_document(self, file_path: str) -> str:
        """Parses a PDF or DOCX file using LlamaCloud Async Client."""
        if not self.api_key or not hasattr(self, 'client'):
            return "LlamaCloud API Key not provided or client not initialized."
        
        try:
            # Upload file
            with open(file_path, "rb") as f:
                file_obj = await self.client.files.upload_file(
                    upload_file=f
                )

            # Start parsing job using V2 API
            job_response = await self.client.v_2.parse_file(
                file_id=file_obj.id,
                tier="fast",
                version="latest"
            )
            job_id = job_response.id

            # Poll for completion
            import asyncio
            # Set a more generous timeout for parsing
            for _ in range(30):  
                status_res = await self.client.v_2.get_parse_job(job_id)
                status = status_res.job.status
                if status == "COMPLETED":
                    # Get full result - FAST tier usually only supports text expansion
                    try:
                        full_result = await self.client.v_2.get_parse_job(job_id, expand="text")
                        if full_result.text and full_result.text.pages:
                            text_parts = [page.text for page in full_result.text.pages if hasattr(page, 'text')]
                            final_text = "\n\n".join(text_parts)
                            if final_text.strip():
                                return final_text
                    except Exception as e:
                        print(f"DEBUG: Text extraction failed: {str(e)}")

                    # Fallback to markdown as last resort
                    try:
                        full_result = await self.client.v_2.get_parse_job(job_id, expand="markdown")
                        if full_result.markdown and full_result.markdown.pages:
                            markdown_parts = []
                            for page in full_result.markdown.pages:
                                if hasattr(page, 'markdown'):
                                    markdown_parts.append(page.markdown)
                            final_text = "\n\n".join(markdown_parts)
                            if final_text.strip():
                                return final_text
                    except:
                        pass
                    
                    return "No content extracted from any source."
                elif status == "FAILED":
                    return f"Parsing failed: {status_res.job.error_message}"
                await asyncio.sleep(1)

            return "Parsing timed out."
        except Exception as e:
            return f"Parsing error: {str(e)}"

cv_parser = CVParser()
