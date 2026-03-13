from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


# ---------- REQUEST SCHEMAS ----------

class StaffRegister(BaseModel):
    staff_id: str = Field(..., min_length=3)
    name: str
    email: EmailStr
    department: str
    mobile: Optional[str] = None
    password: str = Field(..., min_length=6)


class StaffLogin(BaseModel):
    identifier: str  # email or staff_id
    password: str


# ---------- RESPONSE SCHEMAS ----------

class StaffDashboardResponse(BaseModel):
    total_students: int
    total_staff: int
    total_books: int
    issued_books: int
    available_books: int


class StaffProfileResponse(BaseModel):
    staff_id: str
    name: str
    email: str
    department: str
    mobile: Optional[str]
    created_at: datetime


# ---------- INTERNAL SCHEMAS ----------

class Staff(BaseModel):
    staff_id: str
    name: str
    email: str
    department: str
    mobile: Optional[str]
    password_hash: str
    created_at: datetime
    is_active: bool = True


class StaffUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    mobile: Optional[str] = None
