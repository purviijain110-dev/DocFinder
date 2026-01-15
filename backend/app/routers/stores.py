from fastapi import APIRouter, Query
from typing import List, Optional
from ..models import MedicalStore
from ..data.mock_data import MOCK_MEDICAL_STORES

router = APIRouter(prefix="/api/medical-stores", tags=["stores"])

from ..services.serper_service import SerperService

serper_service = SerperService()

@router.get("/", response_model=List[MedicalStore])
async def get_stores(category: Optional[str] = None, location: Optional[str] = "India", lat: Optional[float] = None, lng: Optional[float] = None):
    print("LOCATION CHECK [STORES]:", location, lat, lng)
    stores = await serper_service.search_stores(category=category, location=location, lat=lat, lng=lng)
    return stores
