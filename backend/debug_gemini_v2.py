import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def test():
    print("--- Listing Models ---")
    api_key = os.getenv("GEMINI_API_KEY")
    try:
        # Try default client (v1?)
        client = genai.Client(api_key=api_key)
        print("Client (default) created.")
        
        print("Available models:")
        for m in client.models.list():
            print(f"- {m.name}")
            
    except Exception as e:
        print("Error with default client:", e)

    print("\n--- Listing Models (v1beta) ---")
    try:
        # Try v1beta client if supported via http_options
        client_beta = genai.Client(api_key=api_key, http_options={'api_version': 'v1beta'})
        print("Client (v1beta) created.")
        
        for m in client_beta.models.list():
            print(f"- {m.name}")

    except Exception as e:
        print("Error with v1beta client:", e)

if __name__ == "__main__":
    test()
