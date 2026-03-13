from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


# ---------- REQUEST SCHEMAS ----------

class LibraryStaffRegister(BaseModel):
    staff_id: str = Field(..., min_length=3)
    name: str
    email: EmailStr
    mobile: Optional[str] = None
    password: str = Field(..., min_length=6)


class LibraryStaffLogin(BaseModel):
    identifier: str  # email or staff_id
    password: str


# ---------- BOOK OPERATION SCHEMAS ----------

class IssueBookRequest(BaseModel):
    user_type: str = Field(..., pattern="^(student|staff)$")
    user_id: str
    book_name: str
    issue_date: datetime
    due_date: datetime


class ReturnBookRequest(BaseModel):
    user_type: str = Field(..., pattern="^(student|staff)$")
    user_id: str
    book_name: str
    issue_date: datetime
    due_date: datetime
    return_date: datetime


class AddBookRequest(BaseModel):
    book_name: str
    author: str
    isbn: Optional[str] = None
    quantity: int = Field(..., gt=0)
    category: Optional[str] = None


class CollectFineRequest(BaseModel):
    user_type: str = Field(..., pattern="^(student|staff)$")
    user_id: str
    amount: float = Field(..., gt=0)
    fine_type: str
    description: Optional[str] = None


# ---------- RESPONSE SCHEMAS ----------

class LibraryStaffDashboardResponse(BaseModel):
    total_books: int
    issued_books: int
    available_books: int
    overdue_books: int
    pending_fines: float
    recent_activity: List[dict]


class LibraryStaffProfileResponse(BaseModel):
    staff_id: str
    name: str
    email: str
    mobile: Optional[str]
    created_at: datetime


class BookResponse(BaseModel):
    book_id: str
    book_name: str
    author: str
    isbn: Optional[str]
    quantity: int
    available: int
    category: Optional[str]


class IssuedBookResponse(BaseModel):
    transaction_id: str
    user_type: str
    user_id: str
    book_name: str
    issue_date: datetime
    due_date: datetime
    return_date: Optional[datetime]
    fine_amount: Optional[float]
    status: str


# ---------- INTERNAL SCHEMAS ----------

class LibraryStaff(BaseModel):
    staff_id: str
    name: str
    email: str
    mobile: Optional[str]
    password_hash: str
    created_at: datetime
    is_active: bool = True


class LibraryStaffUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None


class Book(BaseModel):
    book_id: str
    book_name: str
    author: str
    isbn: Optional[str]
    total_quantity: int
    available_quantity: int
    category: Optional[str]
    created_at: datetime
    updated_at: datetime


class Transaction(BaseModel):
    transaction_id: str
    user_type: str
    user_id: str
    book_id: str
    book_name: str
    issue_date: datetime
    due_date: datetime
    return_date: Optional[datetime]
    fine_amount: Optional[float]
    status: str
    created_at: datetime
    updated_at: datetime
