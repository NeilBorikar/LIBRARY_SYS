<<<<<<< HEAD
from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from app.repositories.library_staff_repo import LibraryStaffRepository
from app.repositories.book_repo import BookRepository
from app.repositories.transaction_repo import TransactionRepository
from app.repositories.student_repo import StudentRepository
from app.models.library_staff import LibraryStaffCreate, LibraryStaffResponse
from app.utils.reminder_service import ReminderService

router = APIRouter(prefix="/library-staff", tags=["Library Staff"])

library_staff_repo = LibraryStaffRepository()
book_repo = BookRepository()
transaction_repo = TransactionRepository()
student_repo = StudentRepository()
reminder_service = ReminderService()
=======
from fastapi import APIRouter, HTTPException
from typing import List

from app.repositories.library_staff_repo import LibraryStaffRepository
from app.models.library_staff import (
    LibraryStaffRegister,
    IssueBookRequest,
    ReturnBookRequest,
    CollectFineRequest
)
from app.models.transaction import IssueTransactionResponse

router = APIRouter()
library_repo = LibraryStaffRepository()
>>>>>>> e6d8db4533e4bd76b2850fb35827a25a589cf1bb


@router.post("/register")
def register_library_staff(data: LibraryStaffRegister):
    try:
        library_repo.create_library_staff(data.dict())
        return {"message": "Library staff created"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/issue-book")
def issue_book(data: IssueBookRequest):
    library_repo.issue_book(**data.dict())
    return {"message": "Book issued successfully"}


@router.post("/return-book")
def return_book(data: ReturnBookRequest):
    library_repo.return_book(**data.dict())
    return {"message": "Book returned successfully"}


<<<<<<< HEAD
@router.post("/send-reminder/{student_id}")
async def send_manual_reminder(student_id: str):
    """Send manual reminder to a specific student"""
    try:
        # Get student info by PRN (not ObjectId)
        student = await student_repo.async_find_one({"prn": student_id})
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        # Get student's current books
        current_books = await transaction_repo.get_current_books(student_id)
        overdue_books = [book for book in current_books if not book.get('returned_at') and book['due_date'] < datetime.now()]
        
        if not overdue_books:
            return {"message": "No overdue books found for this student"}
        
        # Send reminder for each overdue book
        reminders_sent = 0
        for book in overdue_books:
            days_overdue = (datetime.now() - book['due_date']).days
            try:
                await reminder_service._send_email_reminder(student, book, -days_overdue)
                reminders_sent += 1
            except Exception as e:
                print(f"Failed to send reminder for book {book['book_title']}: {str(e)}")
        
        return {
            "message": f"Reminder sent successfully to {student['name']}",
            "reminders_sent": reminders_sent,
            "student_email": student['email']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send reminder: {str(e)}"
        )
=======
@router.post("/collect-fine")
def collect_fine(data: CollectFineRequest):
    library_repo.collect_fine(**data.dict())
    return {"message": "Fine collected"}


@router.get("/books-issued", response_model=List[IssueTransactionResponse])
def issued_books():
    return library_repo.get_issued_books()


@router.get("/books-returned", response_model=List[IssueTransactionResponse])
def returned_books():
    return library_repo.get_returned_books()
>>>>>>> e6d8db4533e4bd76b2850fb35827a25a589cf1bb
