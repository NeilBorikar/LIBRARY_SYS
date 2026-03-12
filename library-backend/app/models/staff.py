from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ---------- REQUEST ----------

class StaffRegister(BaseModel):
    emp_id: str
    name: str
    email: EmailStr
    department: str
    password: str = Field(..., min_length=6)


class StaffLogin(BaseModel):
    identifier: str  # email or emp_id
    password: str


class StaffDepositRequest(BaseModel):
    amount: int = Field(..., gt=0)
    payment_mode: str


# ---------- RESPONSE ----------

class StaffDashboardResponse(BaseModel):
    active_issues: int
    deposit_status: str
    deposit_details: Optional[dict] = None
