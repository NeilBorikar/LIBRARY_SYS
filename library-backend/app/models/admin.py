from pydantic import BaseModel, EmailStr
from datetime import datetime


class AdminBase(BaseModel):
    name: str
    email: EmailStr


class AdminCreate(AdminBase):
    password: str


class AdminResponse(AdminBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
