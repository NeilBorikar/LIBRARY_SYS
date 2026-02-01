from fastapi import APIRouter, HTTPException, status
from app.repositories.auth_repo import AuthRepository
from app.utils.password import verify_password
from app.utils.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

auth_repo = AuthRepository()


@router.post("/login")
def login(role: str, email: str, password: str):
    user = auth_repo.get_user_by_email(role, email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_password(password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "user_id": str(user["_id"]),
        "role": role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role
    }
