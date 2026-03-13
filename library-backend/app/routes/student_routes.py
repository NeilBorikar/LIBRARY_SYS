from fastapi import APIRouter, HTTPException, Depends
from app.database_utils import users_collection, books_collection, transactions_collection, verify_jwt_token
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter(prefix="/student", tags=["Student"])

# JWT dependency
def get_current_user(token: str = Depends(verify_jwt_token)):
    return token

@router.get("/profile")
def get_student_profile(current_user: dict = Depends(get_current_user)):
    """Get student profile"""
    try:
        if current_user.get("role") != "student":
            raise HTTPException(status_code=403, detail="Access denied")
        
        student = users_collection.find_one({"email": current_user["email"]})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Convert ObjectId to string
        student["_id"] = str(student["_id"])
        return {"student": student}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/books")
def get_available_books(current_user: dict = Depends(get_current_user)):
    """Get all available books"""
    try:
        if current_user.get("role") != "student":
            raise HTTPException(status_code=403, detail="Access denied")
        
        books = list(books_collection.find({"available": True}))
        for book in books:
            book["_id"] = str(book["_id"])
        
        return {"books": books}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/borrow/{book_id}")
def borrow_book(book_id: str, current_user: dict = Depends(get_current_user)):
    """Borrow a book"""
    try:
        if current_user.get("role") != "student":
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check if book exists and is available
        book = books_collection.find_one({"_id": ObjectId(book_id)})
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        if not book.get("available", True):
            raise HTTPException(status_code=400, detail="Book not available")
        
        # Get student
        student = users_collection.find_one({"email": current_user["email"]})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Create transaction
        transaction = {
            "student_id": student["_id"],
            "book_id": book["_id"],
            "borrow_date": datetime.now(),
            "due_date": datetime.now() + timedelta(days=14),
            "status": "borrowed"
        }
        
        transactions_collection.insert_one(transaction)
        
        # Update book availability
        books_collection.update_one(
            {"_id": ObjectId(book_id)},
            {"$set": {"available": False}}
        )
        
        return {"message": "Book borrowed successfully", "due_date": transaction["due_date"]}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions")
def get_my_transactions(current_user: dict = Depends(get_current_user)):
    """Get student's transaction history"""
    try:
        if current_user.get("role") != "student":
            raise HTTPException(status_code=403, detail="Access denied")
        
        student = users_collection.find_one({"email": current_user["email"]})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        transactions = list(transactions_collection.find({"student_id": student["_id"]}))
        for transaction in transactions:
            transaction["_id"] = str(transaction["_id"])
            transaction["student_id"] = str(transaction["student_id"])
            transaction["book_id"] = str(transaction["book_id"])
        
        return {"transactions": transactions}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
