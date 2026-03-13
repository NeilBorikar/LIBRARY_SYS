from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
import os

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class AuthService:
    """Core authentication service"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Generate password hash"""
        return pwd_context.hash(password)
    
    @staticmethod
    def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    @staticmethod
    def authenticate_user(identifier: str, password: str, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Authenticate user with identifier (email/PRN/staff_id) and password"""
        # Check if identifier matches email or PRN/staff_id
        if not (
            user_data.get("email", "").lower() == identifier.lower() or
            user_data.get("prn", "").lower() == identifier.lower() or
            user_data.get("staff_id", "").lower() == identifier.lower()
        ):
            return None
        
        if not AuthService.verify_password(password, user_data.get("password_hash", "")):
            return None
        
        return user_data
    
    @staticmethod
    def create_user_token(user_data: Dict[str, Any], user_type: str) -> Dict[str, Any]:
        """Create access token for user"""
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = AuthService.create_access_token(
            data={
                "sub": user_data.get("email"),
                "user_type": user_type,
                "user_id": user_data.get("prn") or user_data.get("staff_id"),
                "name": user_data.get("name")
            },
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": user_data.get("email"),
                "name": user_data.get("name"),
                "user_type": user_type,
                "user_id": user_data.get("prn") or user_data.get("staff_id")
            }
        }


# Singleton instance
auth_service = AuthService()
