from fastapi import APIRouter, HTTPException, status
from app.repositories.library_staff_repo import LibraryStaffRepository
from app.repositories.book_repo import BookRepository
from app.repositories.transaction_repo import TransactionRepository
from app.models.library_staff import LibraryStaffCreate, LibraryStaffResponse

router = APIRouter(prefix="/library-staff", tags=["Library Staff"])

library_staff_repo = LibraryStaffRepository()
book_repo = BookRepository()
transaction_repo = TransactionRepository()


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
