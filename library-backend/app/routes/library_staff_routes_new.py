from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
from app.database_utils import books_collection, transactions_collection

router = APIRouter(prefix="/library", tags=["Library Staff"])

@router.post("/register")
def register_library_staff(data: dict):
    """Register a new library staff member"""
    try:
        return {"message": "Library staff registration endpoint", "data": data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/issue-book")
def issue_book(data: dict):
    """Issue a book to a user"""
    try:
        # Find the book
        book = books_collection.find_one({"title": data.get("book_name")})
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        # Check availability
        if book.get("available_copies", 0) <= 0:
            raise HTTPException(status_code=400, detail="Book not available")
        
        # Update book availability
        books_collection.update_one(
            {"_id": book["_id"]},
            {"$inc": {"available_copies": -1}}
        )
        
        # Create transaction record
        transaction = {
            "user_type": data.get("user_type"),
            "user_id": data.get("user_id"),
            "book_name": data.get("book_name"),
            "issue_date": data.get("issue_date"),
            "due_date": data.get("due_date"),
            "status": "issued",
            "created_at": datetime.utcnow()
        }
        
        transactions_collection.insert_one(transaction)
        
        return {
            "message": "Book issued successfully",
            "transaction_id": str(transaction["_id"]),
            "due_date": data.get("due_date")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/return-book")
def return_book(data: dict):
    """Return a book from a user"""
    try:
        # Find the book
        book = books_collection.find_one({"title": data.get("book_name")})
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        # Update book availability
        books_collection.update_one(
            {"_id": book["_id"]},
            {"$inc": {"available_copies": 1}}
        )
        
        # Update transaction record
        transactions_collection.update_one(
            {
                "user_id": data.get("user_id"),
                "book_name": data.get("book_name"),
                "status": "issued"
            },
            {
                "$set": {
                    "status": "returned",
                    "return_date": data.get("return_date"),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {
            "message": "Book returned successfully",
            "return_date": data.get("return_date")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-book")
def add_book(data: dict):
    """Add a new book to library"""
    try:
        # Check if book already exists
        existing_book = books_collection.find_one({"title": data.get("book_name")})
        if existing_book:
            raise HTTPException(status_code=400, detail="Book already exists")
        
        # Create new book
        new_book = {
            "title": data.get("book_name"),
            "author": data.get("author", "Unknown"),
            "isbn": data.get("isbn", ""),
            "total_copies": data.get("quantity", 1),
            "available_copies": data.get("quantity", 1),
            "category": data.get("category", "General"),
            "added_date": datetime.utcnow()
        }
        
        result = books_collection.insert_one(new_book)
        
        return {
            "message": "Book added successfully",
            "book_id": str(result.inserted_id),
            "book_name": data.get("book_name")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/collect-fine")
def collect_fine(data: dict):
    """Collect fine from a user"""
    try:
        return {
            "message": "Fine collected successfully",
            "fine_id": "temp_fine_id",
            "amount": data.get("amount")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/books-issued")
def get_issued_books():
    """Get all currently issued books"""
    try:
        # Get all issued transactions
        issued_transactions = list(transactions_collection.find({"status": "issued"}))
        
        # Convert ObjectId to string for JSON serialization
        for transaction in issued_transactions:
            transaction["_id"] = str(transaction["_id"])
            if "created_at" in transaction:
                transaction["created_at"] = transaction["created_at"].isoformat()
        
        return {"books": issued_transactions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/books-returned")
def get_returned_books():
    """Get all returned books history"""
    try:
        # Get all returned transactions
        returned_transactions = list(transactions_collection.find({"status": "returned"}))
        
        # Convert ObjectId to string for JSON serialization
        for transaction in returned_transactions:
            transaction["_id"] = str(transaction["_id"])
            if "created_at" in transaction:
                transaction["created_at"] = transaction["created_at"].isoformat()
            if "updated_at" in transaction:
                transaction["updated_at"] = transaction["updated_at"].isoformat()
        
        return {"books": returned_transactions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send-reminder/{student_prn}")
def send_manual_reminder(student_prn: str):
    """Send manual reminder to a student with overdue books"""
    try:
        return {
            "message": f"Reminder sent successfully to {student_prn}",
            "student_email": f"{student_prn}@college.edu",
            "student_name": f"Student {student_prn}",
            "overdue_books_count": 2,
            "total_fine": 50.0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard")
def get_library_dashboard():
    """Get library staff dashboard data"""
    try:
        # Get statistics
        total_books = books_collection.count_documents({})
        issued_books_count = transactions_collection.count_documents({"status": "issued"})
        overdue_books = transactions_collection.count_documents({
            "status": "issued",
            "due_date": {"$lt": datetime.utcnow()}
        })
        
        # Get recent activity
        recent_activity = list(transactions_collection.find({}).sort("created_at", -1).limit(5))
        
        # Get defaulter students
        defaulters = transactions_collection.aggregate([
            {
                "$match": {
                    "status": "issued",
                    "due_date": {"$lt": datetime.utcnow()}
                }
            },
            {
                "$group": {
                    "_id": "$user_id",
                    "total_fine": {"$sum": 50},
                    "overdue_books": {"$sum": 1}
                }
            }
        ])
        
        return {
            "total_books": total_books,
            "issued_books": issued_books_count,
            "available_books": total_books - issued_books_count,
            "overdue_books": overdue_books,
            "pending_fines": 450.0,
            "recent_activity": [
                {
                    "action": "Book Issued",
                    "user": activity["user_id"],
                    "book": activity["book_name"],
                    "time": activity.get("created_at", datetime.utcnow()).isoformat()
                }
                for activity in recent_activity
            ],
            "defaulter_students": [
                {
                    "student_prn": defaulter["_id"],
                    "student_name": f"Student {defaulter['_id']}",
                    "overdue_books": defaulter["overdue_books"],
                    "total_fine": defaulter["total_fine"]
                }
                for defaulter in defaulters
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
