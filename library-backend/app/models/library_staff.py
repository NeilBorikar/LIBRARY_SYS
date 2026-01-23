from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class LibraryStaffBase(BaseModel):
    name: str
    employee_id: str
    email: EmailStr


class LibraryStaffCreate(LibraryStaffBase):
    password: str = Field(..., min_length=6)


class LibraryStaffResponse(LibraryStaffBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
