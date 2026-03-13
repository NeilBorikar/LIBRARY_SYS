# Database initialization and utilities
import os
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from pymongo import MongoClient
from app.config import settings

# Database connection
def get_database():
    try:
        client = MongoClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
        return db
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        return None

# Initialize database
db = get_database()

# Collections
if db is not None:
    users_collection = db.users
    books_collection = db.books
    transactions_collection = db.transactions
    fines_collection = db.fines
else:
    users_collection = None
    books_collection = None
    transactions_collection = None
    fines_collection = None

# Initialize default data
def initialize_database():
    if db is None or users_collection is None:
        return False
    
    try:
        # Initialize default users if empty
        if users_collection.count_documents({}) == 0:
            default_users = [
                {
                    "email": "admin@college.edu",
                    "password": bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    "role": "admin",
                    "name": "System Administrator",
                    "created_at": datetime.utcnow()
                },
                {
                    "email": "staff@college.com", 
                    "password": bcrypt.hashpw("staff123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    "role": "staff",
                    "name": "College Staff",
                    "employee_id": "STAFF001",
                    "created_at": datetime.utcnow()
                },
                {
                    "email": "library@college.edu",
                    "password": bcrypt.hashpw("library123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    "role": "library_staff",
                    "name": "Library Staff",
                    "employee_id": "LIB001",
                    "created_at": datetime.utcnow()
                },
                {
                    "email": "student@college.edu",
                    "password": bcrypt.hashpw("student123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    "role": "student",
                    "name": "Student User",
                    "prn": "STU001",
                    "created_at": datetime.utcnow()
                }
            ]
            users_collection.insert_many(default_users)
            print("✅ Default users initialized")

        # Initialize default books if empty
        if books_collection.count_documents({}) == 0:
            default_books = [
                {
                    "title": "Python Programming",
                    "author": "John Doe",
                    "isbn": "978-1234567890",
                    "total_copies": 5,
                    "available_copies": 5,
                    "category": "Programming",
                    "added_date": datetime.utcnow()
                },
                {
                    "title": "Data Structures",
                    "author": "Jane Smith", 
                    "isbn": "978-0987654321",
                    "total_copies": 3,
                    "available_copies": 3,
                    "category": "Computer Science",
                    "added_date": datetime.utcnow()
                },
                {
                    "title": "Algorithms",
                    "author": "Bob Johnson",
                    "isbn": "978-1122334455",
                    "total_copies": 4,
                    "available_copies": 4,
                    "category": "Computer Science",
                    "added_date": datetime.utcnow()
                }
            ]
            books_collection.insert_many(default_books)
            print("✅ Default books initialized")
        
        return True
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        return False

# JWT Helper Functions
def create_jwt_token(user_data: dict) -> str:
    payload = {
        "email": user_data["email"],
        "role": user_data["role"],
        "exp": datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRATION)
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def verify_jwt_token(token: str):
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Initialize database on import
initialize_database()
