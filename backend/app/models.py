from pydantic import BaseModel
from typing import List, Optional, Literal

# --- Common Models ---

class Doctor(BaseModel):
    id: int
    name: str
    specialty: str
    specialtyHindi: Optional[str] = "विशेषज्ञ"
    location: str
    rating: Optional[float] = 0.0
    reviews: Optional[int] = 0
    distance: Optional[str] = "N/A"
    contact: Optional[str] = "N/A"
    consultationFee: Optional[int] = 500
    availability: Optional[str] = "Call to check"
    availableSlots: Optional[List[str]] = []
    imageUrl: Optional[str] = None
    status: Optional[str] = "OPEN"

class MedicalStore(BaseModel):
    id: int
    name: str
    category: Optional[str] = "Pharmacy"
    location: str
    address: Optional[str] = ""
    rating: Optional[float] = 0.0
    reviews: Optional[int] = 0
    distance: Optional[str] = "N/A"
    timing: Optional[str] = "9 AM - 9 PM"
    contact: Optional[str] = "N/A"
    offers: Optional[List[str]] = None
    imageUrl: Optional[str] = None
    isOpen: Optional[bool] = True

# --- Assessment Models ---

class Message(BaseModel):
    role: Literal['user', 'model']
    parts: List[str]

class AssessmentRequest(BaseModel):
    messages: List[Message]
    current_input: str
    location: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class BotResponse(BaseModel):
    text: str
    recommendation: Optional[dict] = None
    doctors: Optional[List[dict]] = None # List of recommended doctors based on specialty

class AppointmentRequest(BaseModel):
    doctor_id: int
    slot: str
