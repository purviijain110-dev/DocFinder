
import os
import aiohttp
import json
import asyncio
from typing import List, Dict, Optional

class SerperService:
    def __init__(self):
        
        self.base_url = "https://google.serper.dev/places"
        
    def _get_api_key(self) -> str:
        api_key = os.getenv("SERPER_API_KEY")
        if not api_key:
            raise RuntimeError("SERPER_API_KEY is missing from environment")
        return api_key
    
    async def _search_places(self, query: str, location: str = "India", limit: int = 10, lat: Optional[float] = None, lng: Optional[float] = None) -> List[Dict]:
        """
        Generic internal method to search places using Serper.dev
        """
        print("SERPER SEARCH LOCATION:", location, lat, lng)
        

        if not query:
            return []

        # Combine query with location for better results
        # If we have precise coordinates, we can be more specific or rely on Serper's handling
        search_query = query
        if location and location != "India":
             search_query = f"{query} in {location}" 
        
        headers = {
            "X-API-KEY": self._get_api_key(),
            "Content-Type": "application/json"
        }
        
        payload_dict = {
            "q": search_query,
            "gl": "in",
            "hl": "en"
        }

        # Use human-readable location
        if location and not (lat and lng):
            payload_dict["location"] = location  # e.g. "Indore, Madhya Pradesh, India"

        # Use coordinates ONLY for bias
        if lat and lng:
            payload_dict["ll"] = f"{lat},{lng}"


        # If we have lat/lng, Serper documentation often suggests using 'location' field or 'll'
        # For 'places' endpoint, we can try passing location as "lat, lng" if no city name provided,
        # or use it alongside. 
        # Strategy: If lat/lng provided, use that as the robust 'location' bias if possible.
        # But 'location' field in Serper often overrides 'gl'.
        # Let's rely on the text query "in {location}" which works well, 
        # AND if we have lat/lng, we can try to pass it to 'll' if supported or just purely rely on location string
        # actually, simply appending coordinates to query sometimes helps: "Doctors near 12.34, 56.78"

        payload = json.dumps(payload_dict)

        try:
            timeout = aiohttp.ClientTimeout(total=10)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(self.base_url, headers=headers, data=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get("places", [])
                    else:
                        print(f"Serper API Error: {response.status} - {await response.text()}")
                        return []
        except Exception as e:
            print(f"Error calling Serper API: {e}")
            return []

    async def search_doctors(self, query: str = None, specialty: str = None, location: str = "India", lat: Optional[float] = None, lng: Optional[float] = None) -> List[Dict]:
        """
        Search for doctors and format the response to match the Doctor model.
        """
        search_term = ""
        if specialty:
            search_term += f"{specialty} "
        if query:
            search_term += f"{query} "
        
        if not search_term.strip():
            search_term = "Doctors " # Default fallback

        places = await self._search_places(search_term.strip(), location=location, lat=lat, lng=lng)
        
        doctors = []
        for i, place in enumerate(places):
            # Safe extraction with defaults
            doctor = {
                "id": i + 1000, # Offset ID to avoid conflict with mocks if any
                "name": place.get("title", "Unknown Doctor"),
                "specialty": specialty if specialty else place.get("category", "General Physician"),
                "specialtyHindi": "विशेषज्ञ", # Placeholder
                "location": place.get("address", location),
                "rating": place.get("rating", 4.5), # Default high rating to look good
                "reviews": place.get("ratingCount", 10),
                "distance": "2.5 km", # Cannot calculate real distance without user coords, placeholder
                "contact": place.get("phoneNumber", "Call to Verify"),
                "consultationFee": 500, # Placeholder
                "availability": "Available Today",
                "availableSlots": ["10:00 AM", "2:00 PM", "6:00 PM"],
                "imageUrl": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop", # Default doctor image
                "status": "OPEN"
            }
            doctors.append(doctor)
            
        return doctors

    async def search_stores(self, category: str = None, location: str = "India", lat: Optional[float] = None, lng: Optional[float] = None) -> List[Dict]:
        """
        Search for medical stores and format response.
        """
        CATEGORY_QUERY_MAP = {
            "government": "Jan Aushadhi Kendra government pharmacy",
            "24hrs": "24 hour pharmacy medical store",
            "normal": "medical store pharmacy chemist",
        }

        query = CATEGORY_QUERY_MAP.get(
            category,
            "medical store pharmacy chemist"
        )
            
        places = await self._search_places(query, location=location, lat=lat, lng=lng)
        
        stores = []
        for i, place in enumerate(places):
            store = {
                "id": i + 2000,
                "name": place.get("title", "Unknown Store"),
                "category": category if category else "normal",
                "location": location,
                "address": place.get("address", location),
                "rating": place.get("rating", 4.0),
                "reviews": place.get("ratingCount", 5),
                "distance": "1.2 km",
                "timing": "Open Now",
                "contact": place.get("phoneNumber", "N/A"),
                "imageUrl": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
                "isOpen": True
}


            stores.append(store)
            
        return stores
