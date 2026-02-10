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
