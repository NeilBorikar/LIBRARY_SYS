from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ---------- REQUEST ----------

class LibraryStaffRegister(BaseModel):
    staff_id: str
    name: str
    email: EmailStr
    password: str = Field(..., min_length=6)


class LibraryStaffLogin(BaseModel):
    identifier: str  # email or staff_id
    password: str


class IssueBookRequest(BaseModel):
    user_type: str  # "student" | "staff"
    user_id: str
    book_id: str
    issue_date: datetime
    due_date: datetime


class ReturnBookRequest(BaseModel):
    user_type: str
    user_id: str
    book_id: str
    return_date: datetime


class CollectFineRequest(BaseModel):
    user_type: str
    user_id: str
    book_id: str
    amount: int
    payment_mode: str
