from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models import Doctor, AppointmentRequest
from ..data.mock_data import MOCK_DOCTORS

router = APIRouter(prefix="/api/doctors", tags=["doctors"])

from ..services.serper_service import SerperService

serper_service = SerperService()

@router.get("/", response_model=List[Doctor])
async def get_doctors(
    search: Optional[str] = None,
    specialty: Optional[str] = None,
    location: Optional[str] = "India",
    lat: Optional[float] = None,
    lng: Optional[float] = None
):
    print("LOCATION CHECK [DOCTORS]:", location, lat, lng)
    # Pass location from query params if available
    doctors = await serper_service.search_doctors(query=search, specialty=specialty, location=location, lat=lat, lng=lng)
    return doctors

@router.get("/{doctor_id}", response_model=Doctor)
def get_doctor(doctor_id: int):
    doctor = next((d for d in MOCK_DOCTORS if d['id'] == doctor_id), None)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.post("/book")
def book_appointment(request: AppointmentRequest):
    # In a real app, this would save to a database. 
    # Since we are using Serper API dynamically, we accept the ID.
    
    return {
        "status": "success", 
        "message": f"Appointment confirmed with Doctor #{request.doctor_id} at {request.slot}",
        "appointment_id": 12345
    }
