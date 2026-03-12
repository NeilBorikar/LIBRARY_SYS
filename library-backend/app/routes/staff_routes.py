from fastapi import APIRouter, HTTPException
from typing import List

from app.repositories.staff_repo import StaffRepository
from app.models.staff import (
    StaffRegister,
    StaffDashboardResponse,
    StaffDepositRequest
)
from app.models.transaction import IssueTransactionResponse

router = APIRouter()
staff_repo = StaffRepository()


@router.post("/register")
def register_staff(data: StaffRegister):
    try:
        staff_repo.create_staff(data.dict())
        return {"message": "Staff registered successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/dashboard", response_model=StaffDashboardResponse)
def staff_dashboard(emp_id: str):
    return staff_repo.get_dashboard_data(emp_id)


@router.get("/books-issued", response_model=List[IssueTransactionResponse])
def books_issued(emp_id: str):
    return staff_repo.get_issued_books(emp_id)


@router.get("/books-returned", response_model=List[IssueTransactionResponse])
def books_returned(emp_id: str):
    return staff_repo.get_returned_books(emp_id)


@router.post("/deposit")
def pay_deposit(emp_id: str, data: StaffDepositRequest):
    staff_repo.pay_deposit(emp_id, data.amount, data.payment_mode)
    return {"message": "Deposit paid successfully"}
