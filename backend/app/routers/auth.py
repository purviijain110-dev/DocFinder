from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/auth", tags=["auth"])

# TEMP in-memory store (OK for now)
OTP_STORE = {}

# --------------------
# Request Models
# --------------------

class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str

# --------------------
# Send OTP
# --------------------

@router.post("/send-otp")
def send_otp(request: SendOTPRequest):
    phone = request.phone

    if len(phone) != 10:
        raise HTTPException(status_code=400, detail="Invalid phone number")

    otp = str(random.randint(100000, 999999))

    OTP_STORE[phone] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=5)
    }

    print(f"OTP for {phone} is {otp}")  # 👈 SMS later

    return {"status": "otp_sent"}

# --------------------
# Verify OTP
# --------------------

@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest):
    phone = request.phone
    otp = request.otp

    record = OTP_STORE.get(phone)

    if not record:
        raise HTTPException(status_code=400, detail="OTP not found")

    if datetime.utcnow() > record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP expired")

    if otp != record["otp"]:
        raise HTTPException(status_code=401, detail="Invalid OTP")

    OTP_STORE.pop(phone)

    # Later: save to DB
    return {
        "status": "verified",
        "user_id": phone  # temporary ID
    }
