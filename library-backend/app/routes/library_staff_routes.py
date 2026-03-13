from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime

from app.services.library_service import library_service
from app.services.dashboard_service import dashboard_service
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
        # This would use auth_service in a complete implementation
        return {"message": "Library staff registration endpoint"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/issue-book")
async def issue_book(data: IssueBookRequest):
    """Issue a book to a user"""
    try:
        result = await library_service.issue_book(data.dict())
        if result["success"]:
            return {"message": result["message"], "transaction_id": result["transaction_id"]}
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/return-book")
async def return_book(data: ReturnBookRequest):
    """Return a book from a user"""
    try:
        result = await library_service.return_book(data.dict())
        if result["success"]:
            response = {"message": result["message"]}
            if "fine_amount" in result:
                response["fine_amount"] = result["fine_amount"]
                response["fine_message"] = result["fine_message"]
            return response
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/add-book")
async def add_book(data: AddBookRequest):
    """Add a new book to the library"""
    try:
        result = await library_service.add_book(data.dict())
        if result["success"]:
            return {"message": result["message"], "book_id": result["book_id"]}
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/collect-fine")
async def collect_fine(data: CollectFineRequest):
    """Collect fine from a user"""
    try:
        result = await library_service.collect_fine(data.dict())
        if result["success"]:
            return {"message": result["message"], "fine_id": result["fine_id"]}
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/books-issued")
async def get_issued_books():
    """Get all currently issued books"""
    try:
        books = await library_service.get_issued_books()
        return {"books": books}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/books-returned")
async def get_returned_books():
    """Get all returned books history"""
    try:
        books = await library_service.get_returned_books()
        return {"books": books}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send-reminder/{student_prn}")
async def send_manual_reminder(student_prn: str):
    """Send manual reminder to a student with overdue books"""
    try:
        result = await dashboard_service.send_manual_reminder(student_prn)
        if result["success"]:
            return {
                "message": result["message"],
                "student_email": result["student_email"],
                "student_name": result["student_name"],
                "overdue_books_count": result["overdue_books_count"],
                "total_fine": result["total_fine"]
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboard")
async def get_library_dashboard():
    """Get library staff dashboard data"""
    try:
        dashboard_data = await dashboard_service.get_library_dashboard()
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
