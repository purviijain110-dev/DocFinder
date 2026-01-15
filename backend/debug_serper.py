
import asyncio
import os
from dotenv import load_dotenv
from app.services.serper_service import SerperService

# Load env vars to get the key
load_dotenv()

async def test_serper():
    print(f"API KEY PRESENT: {'Yes' if os.getenv('SERPER_API_KEY') else 'No'}")
    
    service = SerperService()
    
    # Test 1: Doctor Search in Indore
    print("\n--- Testing Doctor Search in Indore ---")
    doctors = await service.search_doctors(query="Cardiologist", location="Indore, Madhya Pradesh")
    print(f"Doctors Found: {len(doctors)}")
    if doctors:
        print(f"First Doctor: {doctors[0]['name']} - {doctors[0]['location']}")
    else:
        print("Response from Serper was empty.")

    # Test 2: Store Search in Indore
    print("\n--- Testing Store Search in Indore ---")
    stores = await service.search_stores(category="Pharmacy", location="Indore")
    print(f"Stores Found: {len(stores)}")
    if stores:
        print(f"First Store: {stores[0]['name']}")
        
    # Test 3: Raw Place Search (to debug query)
    print("\n--- Testing Raw Place Search ---")
    raw = await service._search_places("Doctors in Indore, Madhya Pradesh")
    print(f"Raw Items: {len(raw)}")

if __name__ == "__main__":
    asyncio.run(test_serper())
