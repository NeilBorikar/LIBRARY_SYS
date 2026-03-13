from datetime import datetime
from typing import Optional, List

from app.database import (
    library_staff_collection,
    issues_collection,
    returns_collection,
    fines_collection,
    books_collection
)
from app.repositories.base_repo import BaseRepository
from app.utils.password import hash_password, verify_password
from bson import ObjectId


class LibraryStaffRepository(BaseRepository):
    def __init__(self):
        super().__init__(library_staff_collection)

    # -------------------------
    # CREATE LIBRARY STAFF
    # -------------------------
    def create_library_staff(self, data: dict) -> str:
        if self.find_one({"email": data["email"]}):
            raise ValueError("Library staff with this email already exists")

        if self.find_one({"staff_id": data["staff_id"]}):
            raise ValueError("Library staff with this ID already exists")

        data["password"] = hash_password(data["password"])
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = None

        return self.insert_one(data)

    # -------------------------
    # AUTHENTICATE LIBRARY STAFF
    # -------------------------
    def authenticate_library_staff(
        self,
        staff_id_or_email: str,
        password: str
    ) -> Optional[dict]:

        staff = self.find_one({
            "$or": [
                {"email": staff_id_or_email},
                {"staff_id": staff_id_or_email}
            ]
        })

        if not staff:
            return None

        if not verify_password(password, staff["password"]):
            return None

        return staff

    # -------------------------
    # DASHBOARD DATA
    # -------------------------
    def get_dashboard_data(self) -> dict:
        active_issues = issues_collection.count_documents({"status": "issued"})
        total_books = books_collection.count_documents({})
        total_fines_collected = sum(
            fine.get("amount", 0) for fine in fines_collection.find({})
        )

        return {
            "active_issues": active_issues,
            "total_books": total_books,
            "total_fines_collected": total_fines_collected
        }

    # -------------------------
    # ISSUE BOOK
    # -------------------------
    def issue_book(
        self,
        user_type: str,     # "student" | "staff"
        user_id: str,       # PRN | EMP_ID
        book_id: str,
        issue_date: datetime,
        due_date: datetime
    ) -> str:

        book = books_collection.find_one({"_id": ObjectId(book_id)})
        if not book:
            raise ValueError("Book not found")

        if book.get("quantity", 0) <= 0:
            raise ValueError("Book not available")

        books_collection.update_one(
            {"_id": ObjectId(book_id)},
            {"$inc": {"quantity": -1}}
        )

        issue = {
            "user_type": user_type,
            "user_id": user_id,
            "book_id": ObjectId(book_id),
            "book_name": book["title"],
            "issue_date": issue_date,
            "due_date": due_date,
            "status": "issued",
            "created_at": datetime.utcnow()
        }

        return issues_collection.insert_one(issue).inserted_id

    # -------------------------
    # RETURN BOOK
    # -------------------------
    def return_book(self, issue_id: str, return_date: datetime) -> dict:

        issue = issues_collection.find_one({"_id": ObjectId(issue_id)})
        if not issue:
            raise ValueError("Issue record not found")

        book_id = issue["book_id"]
        books_collection.update_one(
            {"_id": book_id},
            {"$inc": {"quantity": 1}}
        )

        issues_collection.update_one(
            {"_id": ObjectId(issue_id)},
            {
                "$set": {
                    "status": "returned",
                    "return_date": return_date,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        return {"message": "Book returned successfully"}

    # -------------------------
    # COLLECT FINE
    # -------------------------
    def collect_fine(self, issue_id: str, amount: float) -> str:

        fine = {
            "issue_id": ObjectId(issue_id),
            "amount": amount,
            "collected_at": datetime.utcnow()
        }

        return fines_collection.insert_one(fine).inserted_id

    # -------------------------
    # GET BOOK BY NAME
    # -------------------------
    def get_book_by_name(self, book_name: str) -> Optional[dict]:
        return books_collection.find_one({"title": book_name})

    # -------------------------
    # CREATE BOOK
    # -------------------------
    def create_book(self, book_data: dict) -> dict:
        book = {
            "title": book_data["book_name"],
            "author": book_data.get("author", "Unknown"),
            "isbn": book_data.get("isbn"),
            "total_quantity": book_data["quantity"],
            "available_quantity": book_data["quantity"],
            "category": book_data.get("category"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = books_collection.insert_one(book)
        book["_id"] = result.inserted_id
        return book

    # -------------------------
    # UPDATE BOOK AVAILABILITY
    # -------------------------
    def update_book_availability(self, book_id: str, available_quantity: int) -> dict:
        books_collection.update_one(
            {"_id": ObjectId(book_id)},
            {"$set": {"available_quantity": available_quantity, "updated_at": datetime.utcnow()}}
        )

    # -------------------------
    # UPDATE BOOK QUANTITY
    # -------------------------
    def update_book_quantity(self, book_id: str, total_quantity: int, available_quantity: int) -> dict:
        books_collection.update_one(
            {"_id": ObjectId(book_id)},
            {
                "$set": {
                    "total_quantity": total_quantity,
                    "available_quantity": available_quantity,
                    "updated_at": datetime.utcnow()
                }
            }
        )

    # -------------------------
    # GET LIBRARY STATISTICS
    # -------------------------
    def get_library_stats(self) -> dict:
        total_books = books_collection.count_documents({})
        issued_books = issues_collection.count_documents({"status": "issued"})
        
        # Calculate available books
        available_books = 0
        for book in books_collection.find({}, {"available_quantity": 1}):
            available_books += book.get("available_quantity", 0)

        return {
            "total_books": total_books,
            "issued_books": issued_books,
            "available_books": available_books
        }

    # -------------------------
    # GET STAFF STATISTICS
    # -------------------------
    def get_staff_statistics(self) -> dict:
        total_staff = library_staff_collection.count_documents({})
        
        return {
            "total_staff": total_staff
        }
