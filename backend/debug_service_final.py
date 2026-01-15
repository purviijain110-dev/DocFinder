import asyncio
import os
import sys
from dotenv import load_dotenv

# Ensure we can import from app
sys.path.append(os.getcwd())

from app.services.gemini_service import GeminiService
from app.models import Message

load_dotenv()

async def debug_service():
    print("--- Debugging GeminiService with Pydantic Models ---")
    
    # Mock history with Pydantic models, exactly as FastAPI would provide
    history = [
        Message(role="user", parts=["I have a headache"]),
        Message(role="model", parts=["How long have you had it?"])
    ]
    user_input = "For 2 days"
    
    service = GeminiService()
    print("Service initialized.")
    
    try:
        print("Calling get_assessment...")
        result = await service.get_assessment(history, user_input)
        print("--- Result ---")
        print(result)
    except Exception as e:
        print("\n!!! CRITICAL EXCEPTION !!!")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_service())
