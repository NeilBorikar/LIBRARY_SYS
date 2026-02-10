from fastapi import APIRouter, HTTPException
from typing import List

from app.repositories.student_repo import StudentRepository
from app.models.student import (
    StudentRegister,
    StudentDashboardResponse,
    StudentBookResponse,
    StudentFineResponse
)

router = APIRouter()
student_repo = StudentRepository()


@router.post("/register")
def register_student(data: StudentRegister):
    try:
        student_repo.create_student(data.dict())
        return {"message": "Student registered successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/dashboard", response_model=StudentDashboardResponse)
def student_dashboard(prn: str):
    return student_repo.get_dashboard_data(prn)


@router.get("/books-issued", response_model=List[StudentBookResponse])
def books_issued(prn: str):
    return student_repo.get_issued_books(prn)


@router.get("/books-returned", response_model=List[StudentBookResponse])
def books_returned(prn: str):
    return student_repo.get_returned_books(prn)


@router.get("/fine-paid", response_model=List[StudentFineResponse])
def fine_history(prn: str):
    return student_repo.get_fine_history(prn)
