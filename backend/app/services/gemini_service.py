import os
import json
from google import genai
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

class GeminiService:
    def __init__(self):
        self.client = None
        self._init_client()

    def _init_client(self):
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                print("CRITICAL ERROR: GEMINI_API_KEY is missing from environment variables.")
                return

            # Initialize client with v1beta to access the widest range of models
            self.client = genai.Client(api_key=api_key, http_options={'api_version': 'v1beta'})
            print("Gemini Client (google-genai v1beta) initialized successfully.")
        except Exception as e:
            print(f"Error initializing Gemini client: {e}")

    async def get_assessment(self, history, user_input):
        if not self.client:
            self._init_client()
            if not self.client:
                 return {
                    "text": "System Error: Gemini API Key is missing or invalid. Please check backend logs.",
                    "recommendation": None
                }
        
        # List of models to try in order of preference
        models_to_try = [
            'gemini-2.0-flash', 
            'gemini-2.0-flash-lite-preview-02-05',
            'gemini-flash-latest',
            'gemini-1.5-flash'
        ]

        system_instruction = """
        You are DocFinder AI, a first-contact medical assistant.
        
        YOUR GOAL:
        Assess the user's symptoms and recommend the MOST APPROPRIATE type of doctor.
        
        RESPONSE FORMAT:
        You must output a VALID JSON object. Do not include markdown formatting (like ```json ... ```).
        
        JSON SCHEMA:
        {
            "text": "A friendly, empathetic response to the user. Ask follow-up questions here if you need more info (e.g., duration, severity). If you have a recommendation, explain it briefly here.",
            "assessment_complete": boolean, // true if you are giving a recommendation, false if you are asking follow-up questions
            "recommendation": { // null if assessment_complete is false
                "urgency": "low" | "medium" | "high" | "emergency",
                "recommendedType": "Specialty Recommendation (e.g. Cardiologist)",
                "recommendedTypeHindi": "Hindi Translation",
                "reason": "Brief reason for this recommendation"
            }
        }
        
        RULES:
        1. If the user says "hair loss", recommend a "Dermatologist".
        2. If the user says something vague like "pain", ask "Where is the pain located?".
        3. If EMERGENCY (heart attack symptoms, trouble breathing, severe trauma), set urgency to "emergency".
        """

        # Simplify interaction: Provide recent context + current input
        # Fix: Ensure we access msg.parts[0] correctly as per Pydantic model
        context_str = "\n".join([f"{msg.role}: {msg.parts[0]}" for msg in history[-3:]]) if history else ""
        
        full_prompt = f"""{system_instruction}

        PREVIOUS CONTEXT:
        {context_str}

        CURRENT USER INPUT:
        {user_input}
        """

        last_error = None

        for model_name in models_to_try:
            try:
                print(f"Attempting API call with model: {model_name}")
                # Run synchronous call in threadpool to allow other async tasks (like Serper) to run
                from fastapi.concurrency import run_in_threadpool
                response = await run_in_threadpool(
                    self.client.models.generate_content,
                    model=model_name,
                    contents=full_prompt
                )
                
                raw_text = response.text.strip()
                
                # ... (rest of parsing logic)
                # Clean up potential markdown code blocks
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                if raw_text.startswith("```"):
                    raw_text = raw_text[3:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                
                raw_text = raw_text.strip()
                print(f"Gemini Success with {model_name}")
                
                try:
                    return json.loads(raw_text)
                except json.JSONDecodeError:
                    print("Failed to parse JSON")
                    return {
                        "text": raw_text,
                        "assessment_complete": False,
                        "recommendation": None
                    }

            except Exception as e:
                print(f"Model {model_name} failed: {e}")
                last_error = e
                # Continue to next model loop
                continue

        # If we get here, all models failed
        import traceback
        traceback.print_exc()
        return {
            "text": "I am experiencing high traffic right now and cannot process your request. Please wait 1 minute and try again.",
            "assessment_complete": False,
            "recommendation": None
        }
