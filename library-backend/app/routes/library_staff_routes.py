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


@router.post("/register", response_model=LibraryStaffResponse)
def register_library_staff(staff: LibraryStaffCreate):
    staff_id = library_staff_repo.create_library_staff(staff.dict())
    created_staff = library_staff_repo.find_by_id(staff_id)
    created_staff["id"] = str(created_staff["_id"])
    return created_staff


@router.post("/issue-book")
def issue_book(user_id: str, user_role: str, book_id: str):
    success = book_repo.update_availability(book_id, -1)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book not available"
        )

    transaction_repo.log_transaction({
        "action": "ISSUE",
        "user_id": user_id,
        "user_role": user_role,
        "book_id": book_id
    })

    return {"message": "Book issued successfully"}


@router.post("/return-book")
def return_book(user_id: str, user_role: str, book_id: str):
    success = book_repo.update_availability(book_id, 1)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid return operation"
        )

    transaction_repo.log_transaction({
        "action": "RETURN",
        "user_id": user_id,
        "user_role": user_role,
        "book_id": book_id
    })

    return {"message": "Book returned successfully"}


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
