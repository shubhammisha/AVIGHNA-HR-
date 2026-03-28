import os
from dotenv import load_dotenv

# Load env variables BEFORE any other imports that might use them
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import routers.job_description as job_description
import routers.candidate as candidate
import routers.interview as interview
import routers.psychometric as psychometric

app = FastAPI(title="AI-Powered TA Module API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(job_description.router)
app.include_router(candidate.router)
app.include_router(interview.router)
app.include_router(psychometric.router)

@app.get("/")
async def root():
    return {"message": "AI-Powered TA Module API is running"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
