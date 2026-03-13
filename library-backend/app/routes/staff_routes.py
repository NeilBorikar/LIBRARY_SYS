from fastapi import APIRouter, HTTPException, Depends
from app.database_utils import users_collection, books_collection, transactions_collection, verify_jwt_token
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter(prefix="/staff", tags=["Staff"])

# JWT dependency
def get_current_user(token: str = Depends(verify_jwt_token)):
    return token

@router.get("/profile")
def get_staff_profile(current_user: dict = Depends(get_current_user)):
    """Get staff profile"""
    try:
        if current_user.get("role") != "staff":
            raise HTTPException(status_code=403, detail="Access denied")
        
        staff = users_collection.find_one({"email": current_user["email"], "role": "staff"})
        if not staff:
            raise HTTPException(status_code=404, detail="Staff not found")
        
        # Convert ObjectId to string
        staff["_id"] = str(staff["_id"])
        return {"staff": staff}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/books")
def get_all_books(current_user: dict = Depends(get_current_user)):
    """Get all books (staff can see all books)"""
    try:
        if current_user.get("role") != "staff":
            raise HTTPException(status_code=403, detail="Access denied")
        
        books = list(books_collection.find({}))
        for book in books:
            book["_id"] = str(book["_id"])
        
        return {"books": books}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/books")
def add_book(book_data: dict, current_user: dict = Depends(get_current_user)):
    """Add a new book"""
    try:
        if current_user.get("role") != "staff":
            raise HTTPException(status_code=403, detail="Access denied")
        
        book = {
            "title": book_data["title"],
            "author": book_data["author"],
            "isbn": book_data["isbn"],
            "genre": book_data.get("genre", "Fiction"),
            "available": True,
            "added_date": datetime.now(),
            "added_by": current_user["email"]
        }
        
        result = books_collection.insert_one(book)
        book["_id"] = str(result.inserted_id)
        
        return {"message": "Book added successfully", "book": book}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/books/{book_id}")
def update_book(book_id: str, book_data: dict, current_user: dict = Depends(get_current_user)):
    """Update book information"""
    try:
        if current_user.get("role") != "staff":
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check if book exists
        book = books_collection.find_one({"_id": ObjectId(book_id)})
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        # Update book
        update_data = {
            "title": book_data.get("title", book["title"]),
            "author": book_data.get("author", book["author"]),
            "isbn": book_data.get("isbn", book["isbn"]),
            "genre": book_data.get("genre", book["genre"]),
            "available": book_data.get("available", book["available"]),
            "updated_date": datetime.now(),
            "updated_by": current_user["email"]
        }
        
        books_collection.update_one(
            {"_id": ObjectId(book_id)},
            {"$set": update_data}
        )
        
        return {"message": "Book updated successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions")
def get_all_transactions(current_user: dict = Depends(get_current_user)):
    """Get all transactions (staff view)"""
    try:
        if current_user.get("role") != "staff":
            raise HTTPException(status_code=403, detail="Access denied")
        
        transactions = list(transactions_collection.find({}))
        for transaction in transactions:
            transaction["_id"] = str(transaction["_id"])
            transaction["student_id"] = str(transaction["student_id"])
            transaction["book_id"] = str(transaction["book_id"])
        
        return {"transactions": transactions}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
