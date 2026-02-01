from fastapi import APIRouter, HTTPException, status
from app.repositories.student_repo import StudentRepository
from app.models.student import StudentCreate, StudentResponse

router = APIRouter(prefix="/students", tags=["Students"])

student_repo = StudentRepository()


@router.post("/register", response_model=StudentResponse)
def register_student(student: StudentCreate):
    try:
        student_id = student_repo.create_student(student.dict())
        created_student = student_repo.get_student_by_id(student_id)
        created_student["id"] = str(created_student["_id"])
        return created_student
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: str):
    student = student_repo.get_student_by_id(student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    student["id"] = str(student["_id"])
    return student
