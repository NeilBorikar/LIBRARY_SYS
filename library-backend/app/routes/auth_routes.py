from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timedelta
from app.database_utils import users_collection, create_jwt_token, verify_jwt_token
import bcrypt

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/login")
def login(credentials: dict):
    """Login endpoint for all user types"""
    try:
        if users_collection is None:
            raise HTTPException(status_code=500, detail="Database not initialized")
        
        role = credentials.get("role")
        identifier = credentials.get("identifier")
        password = credentials.get("password")
        
        # Find user in database
        user = users_collection.find_one({"email": identifier})
        
        if not user:
            # Try with employee_id or prn for other roles
            if role == "staff":
                user = users_collection.find_one({"employee_id": identifier, "role": "staff"})
            elif role == "student":
                user = users_collection.find_one({"prn": identifier, "role": "student"})
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create JWT token
        token = create_jwt_token({
            "email": user["email"],
            "role": user["role"]
        })
        
        return {
            "message": "Login successful",
            "user": {
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            },
            "token": token
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
        email = user_data.get("email")
        
        # Check if user already exists
        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Hash password
        hashed_password = bcrypt.hashpw(
            user_data.get("password", "").encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Create user document
        new_user = {
            "email": email,
            "password": hashed_password,
            "role": role,
            "name": user_data.get("name", ""),
            "created_at": datetime.utcnow()
        }
        
        # Add role-specific fields
        if role == "staff":
            new_user["employee_id"] = user_data.get("employee_id", "")
        elif role == "student":
            new_user["prn"] = user_data.get("prn", "")
        elif role == "library_staff":
            new_user["employee_id"] = user_data.get("employee_id", "")
        
        users_collection.insert_one(new_user)
        
        return {
            "message": f"Registration successful for {role}",
            "user": {
                "name": new_user["name"],
                "email": new_user["email"],
                "role": role
            }
        }
        
    except HTTPException:
        raise
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
