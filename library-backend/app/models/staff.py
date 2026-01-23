from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class StaffBase(BaseModel):
    name: str
    staff_id: str
    email: EmailStr
    department: str
    mobile: str = Field(..., min_length=10, max_length=10)


class StaffCreate(StaffBase):
    password: str = Field(..., min_length=6)
    security_deposit_paid: bool = False


class StaffResponse(StaffBase):
    id: str
    security_deposit_paid: bool
    created_at: datetime

    class Config:
        from_attributes = True
