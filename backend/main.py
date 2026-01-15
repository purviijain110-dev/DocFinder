from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routers import doctors, stores, assessment, auth



# Load environment variables
load_dotenv()
print("SERPER CHECK:", os.getenv("SERPER_API_KEY"))

print("ENV CHECK:", os.getenv("GEMINI_API_KEY"))


app = FastAPI(title="DocFinder Backend", version="1.0.0")

# CORS setup to allow frontend communication
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
    "*" #Allow all for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(stores.router)
app.include_router(assessment.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to DocFinder API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
