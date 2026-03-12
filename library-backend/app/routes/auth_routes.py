from fastapi import APIRouter, HTTPException

from app.repositories.auth_repo import AuthRepository
from app.models.student import StudentLogin
from app.models.staff import StaffLogin
from app.models.library_staff import LibraryStaffLogin

router = APIRouter()
auth_repo = AuthRepository()


@router.post("/login")
def login(data: dict):
    role = data.get("role")
    identifier = data.get("identifier")
    password = data.get("password")

    user = auth_repo.authenticate(role, identifier, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "role": role
    }
