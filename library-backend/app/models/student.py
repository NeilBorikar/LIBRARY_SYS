from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


# ---------- REQUEST SCHEMAS ----------

class StudentRegister(BaseModel):
    prn: str = Field(..., min_length=5)
    name: str
    email: EmailStr
    branch: str
    password: str = Field(..., min_length=6)


class StudentLogin(BaseModel):
    identifier: str  # email or PRN
    password: str


# ---------- RESPONSE SCHEMAS ----------

class StudentDashboardResponse(BaseModel):
    active_issues: int
    total_fine_amount: int


class StudentBookResponse(BaseModel):
    book_id: str
    issue_date: datetime
    due_date: Optional[datetime] = None
    status: str


class StudentFineResponse(BaseModel):
    book_id: str
    amount: int
    payment_mode: str
    paid_at: datetime
