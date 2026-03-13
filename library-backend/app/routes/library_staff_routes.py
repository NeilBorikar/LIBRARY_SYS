from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime

from app.models.library_staff import (
    LibraryStaffRegister,
    IssueBookRequest,
    ReturnBookRequest,
    AddBookRequest,
    CollectFineRequest
)

router = APIRouter(prefix="/library", tags=["Library Staff"])


@router.post("/register")
def register_library_staff(data: LibraryStaffRegister):
    """Register a new library staff member"""
    try:
        return {"message": "Library staff registration endpoint", "data": data.dict()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/issue-book")
def issue_book(data: IssueBookRequest):
    """Issue a book to a user"""
    try:
        return {
            "message": "Book issued successfully",
            "transaction_id": "temp_id",
            "due_date": data.due_date.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/return-book")
def return_book(data: ReturnBookRequest):
    """Return a book from a user"""
    try:
        return {
            "message": "Book returned successfully",
            "return_date": data.return_date.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/add-book")
def add_book(data: AddBookRequest):
    """Add a new book to the library"""
    try:
        return {
            "message": "Book added successfully",
            "book_id": "temp_book_id",
            "book_name": data.book_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/collect-fine")
def collect_fine(data: CollectFineRequest):
    """Collect fine from a user"""
    try:
        return {
            "message": "Fine collected successfully",
            "fine_id": "temp_fine_id",
            "amount": data.amount
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/books-issued")
def get_issued_books():
    """Get all currently issued books"""
    try:
        # Mock data for now
        mock_books = [
            {
                "transaction_id": "1",
                "user_type": "student",
                "user_id": "PRN001",
                "book_name": "Python Programming",
                "issue_date": "2024-01-15",
                "due_date": "2024-02-15"
            },
            {
                "transaction_id": "2", 
                "user_type": "student",
                "user_id": "PRN002",
                "book_name": "Data Structures",
                "issue_date": "2024-01-20",
                "due_date": "2024-02-20"
            }
        ]
        return {"books": mock_books}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/books-returned")
def get_returned_books():
    """Get all returned books history"""
    try:
        # Mock data for now
        mock_books = [
            {
                "transaction_id": "3",
                "user_type": "student", 
                "user_id": "PRN003",
                "book_name": "Algorithms",
                "issue_date": "2024-01-10",
                "return_date": "2024-02-05"
            }
        ]
        return {"books": mock_books}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send-reminder/{student_prn}")
def send_manual_reminder(student_prn: str):
    """Send manual reminder to a student with overdue books"""
    try:
        return {
            "message": f"Reminder sent successfully to {student_prn}",
            "student_email": f"{student_prn}@college.edu",
            "student_name": f"Student {student_prn}",
            "overdue_books_count": 2,
            "total_fine": 50.0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboard")
def get_library_dashboard():
    """Get library staff dashboard data"""
    try:
        return {
            "total_books": 1000,
            "issued_books": 245,
            "available_books": 755,
            "overdue_books": 18,
            "pending_fines": 450.0,
            "recent_activity": [
                {
                    "action": "Book Issued",
                    "user": "PRN001",
                    "book": "Python Programming",
                    "time": datetime.now().isoformat()
                }
            ],
            "defaulter_students": [
                {
                    "student_prn": "PRN001",
                    "student_name": "John Doe",
                    "overdue_books": 2,
                    "total_fine": 50.0
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
