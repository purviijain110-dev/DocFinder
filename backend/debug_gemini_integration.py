import asyncio
import os
import sys

# Add the current directory to sys.path to make imports work
sys.path.append(os.getcwd())

from dotenv import load_dotenv
from app.services.gemini_service import GeminiService

load_dotenv()

async def main():
    print("--- Starting Debug Session ---")
    print(f"API Key present: {'Yes' if os.getenv('GEMINI_API_KEY') else 'No'}")
    
    service = GeminiService()
    print("Service initialized.")
    
    try:
        print("Sending request to Gemini...")
        # Mocking history as empty list
        response = await service.get_assessment([], "I have a severe headache and fever.")
        print("--- Response Received ---")
        print(response)
    except Exception as e:
        print("\n!!! EXCEPTION CAUGHT !!!")
        print(e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
