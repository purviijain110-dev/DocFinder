from fastapi import APIRouter, HTTPException
from ..models import AssessmentRequest, BotResponse
from ..services.gemini_service import GeminiService
from ..data.mock_data import MOCK_DOCTORS

router = APIRouter(prefix="/api/assessment", tags=["assessment"])
gemini_service = GeminiService()

@router.post("/chat", response_model=BotResponse)
async def chat_assessment(request: AssessmentRequest):
    print(
        "LOCATION CHECK [ASSESSMENT]:",
        request.location,
        request.lat,
        request.lng
    )
    try:
        response_data = await gemini_service.get_assessment(request.messages, request.current_input)
        
        # specific_doctors = []
        # if response_data.get("recommendation"):
        #     rec_type = response_data["recommendation"].get("recommendedType", "")
        #     if rec_type:
        #         # Simple case-insensitive partial match
        #         specific_doctors = [
        #             d for d in MOCK_DOCTORS 
        #             if rec_type.lower() in d['specialty'].lower() 
        #             or d['specialty'].lower() in rec_type.lower()
        #         ]
        #         # Limit to top 3
        #         specific_doctors = specific_doctors[:3]

        specific_doctors = []
        if response_data.get("recommendation"):
             recommendation = response_data["recommendation"]
             rec_type = recommendation.get("recommendedType", "")
             if rec_type:
                 # Use SerperService to find real doctors
                 from ..services.serper_service import SerperService
                 serper_service = SerperService()
                 # Use real doctor search
                 # We can use the 'location' from request if available
                 specific_doctors = await serper_service.search_doctors(
                     specialty=recommendation.get("recommendedType", "General Physician"),
                     location=request.location or "India",
                     lat=request.lat,
                     lng=request.lng
                 )
                 # Limit to top 3
                 specific_doctors = specific_doctors[:3]

        return BotResponse(
            text=response_data.get("text", "Error processing response"),
            recommendation=response_data.get("recommendation"),
            doctors=specific_doctors
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
