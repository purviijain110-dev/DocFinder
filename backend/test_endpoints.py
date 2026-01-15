import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    print("Testing /health...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}, Body: {response.json()}")
    except Exception as e:
        print(f"Failed to connect: {e}")

def test_doctors():
    print("\nTesting /api/doctors...")
    try:
        response = requests.get(f"{BASE_URL}/api/doctors")
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Found {len(data)} doctors")
        if len(data) > 0:
            print(f"First doctor: {data[0]['name']}")
    except Exception as e:
        print(f"Failed: {e}")

def test_stores():
    print("\nTesting /api/medical-stores...")
    try:
        response = requests.get(f"{BASE_URL}/api/medical-stores")
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Found {len(data)} stores")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    print("Ensure the backend is running (uvicorn main:app --reload) before running this script.")
    test_health()
    test_doctors()
    test_stores()
