from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


# -----------------------------
# BASE MODEL (COMMON FIELDS)
# -----------------------------
class StudentBase(BaseModel):
    name: str = Field(..., min_length=2)
    prn: str = Field(..., min_length=5)
    email: EmailStr
    department: str
    year: int = Field(..., ge=1, le=4)
    mobile: str = Field(..., min_length=10, max_length=10)


# -----------------------------
# CREATE MODEL (INPUT)
# -----------------------------
class StudentCreate(StudentBase):
    password: str = Field(..., min_length=6)


# -----------------------------
# RESPONSE MODEL (OUTPUT)
# -----------------------------
class StudentResponse(StudentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
