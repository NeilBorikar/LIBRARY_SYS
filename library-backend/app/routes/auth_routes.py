from fastapi import APIRouter, HTTPException, status
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login")
def login(credentials: dict):
    """Login endpoint for all user types"""
    try:
        role = credentials.get("role")
        identifier = credentials.get("identifier")
        password = credentials.get("password")
        
        # Mock authentication for now (since database not integrated)
        # Based on the image, these are the expected credentials:
        mock_users = {
            "library_staff": {
                "staff@library.com": {"password": "library123", "name": "Library Staff"},
                "admin@library.com": {"password": "admin123", "name": "Library Admin"}
            },
            "student": {
                "student@college.com": {"password": "student123", "name": "Student User"},
                "john@college.com": {"password": "john123", "name": "John Doe"}
            },
            "staff": {
                "staff@college.com": {"password": "staff123", "name": "College Staff"}
            },
            "admin": {
                "admin@system.com": {"password": "admin123", "name": "System Admin"}
            }
        }
        
        if role not in mock_users:
            raise HTTPException(status_code=400, detail="Invalid user role")
        
        user_data = mock_users[role].get(identifier)
        if not user_data or user_data["password"] != password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {
            "message": "Login successful",
            "user": {
                "name": user_data["name"],
                "email": identifier,
                "role": role
            },
            "token": f"mock_token_{role}_{identifier}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/register")
def register(user_data: dict):
    """Registration endpoint for all user types"""
    try:
        role = user_data.get("role")
        
        # Mock registration
        return {
            "message": f"Registration successful for {role}",
            "user": {
                "name": user_data.get("name"),
                "email": user_data.get("email"),
                "role": role
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/logout")
def logout():
    """Logout endpoint"""
    return {"message": "Logout successful"}


@router.get("/me")
def get_current_user():
    """Get current user info (mock)"""
    return {
        "user": {
            "name": "Mock User",
            "email": "mock@example.com",
            "role": "student"
        }
    }
