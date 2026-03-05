from pydantic import BaseModel, EmailStr, Field
from typing import List
from datetime import datetime

class AdminRegister(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=6)


class AdminDashboardMetrics(BaseModel):
    total_books: int
    active_issues: int
    total_issued: int
    total_returns: int
    total_fines_collected: int


class AdminDailyReport(BaseModel):
    issued: List[dict]
    returned: List[dict]
    fines: List[dict]
