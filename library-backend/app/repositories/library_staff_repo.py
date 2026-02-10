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
            "issue_date": issue_date,
            "due_date": due_date,
            "status": "issued",
            "created_at": datetime.utcnow()
        }

        result = issues_collection.insert_one(issue)
        return str(result.inserted_id)

    # -------------------------
    # RETURN BOOK
    # -------------------------
    def return_book(
        self,
        user_type: str,
        user_id: str,
        book_id: str,
        return_date: datetime
    ) -> None:

        issue = issues_collection.find_one({
            "user_type": user_type,
            "user_id": user_id,
            "book_id": ObjectId(book_id),
            "status": "issued"
        })

        if not issue:
            raise ValueError("Active issue record not found")

        issues_collection.update_one(
            {"_id": issue["_id"]},
            {"$set": {"status": "returned"}}
        )

        returns_collection.insert_one({
            "user_type": user_type,
            "user_id": user_id,
            "book_id": ObjectId(book_id),
            "issue_date": issue["issue_date"],
            "return_date": return_date,
            "created_at": datetime.utcnow()
        })

        books_collection.update_one(
            {"_id": ObjectId(book_id)},
            {"$inc": {"quantity": 1}}
        )

    # -------------------------
    # CALCULATE FINE
    # -------------------------
    def calculate_fine(
        self,
        due_date: datetime,
        return_date: datetime,
        per_day: int = 5
    ) -> int:

        late_days = (return_date.date() - due_date.date()).days
        return max(0, late_days * per_day)

    # -------------------------
    # COLLECT FINE
    # -------------------------
    def collect_fine(
        self,
        user_type: str,
        user_id: str,
        book_id: str,
        amount: int,
        payment_mode: str
    ) -> str:

        fine = {
            "user_type": user_type,
            "user_id": user_id,
            "book_id": ObjectId(book_id),
            "amount": amount,
            "payment_mode": payment_mode,
            "paid_at": datetime.utcnow()
        }

        result = fines_collection.insert_one(fine)
        return str(result.inserted_id)

    # -------------------------
    # VIEW DATA
    # -------------------------
    def get_issued_books(self) -> List[dict]:
        return list(issues_collection.find({"status": "issued"}))

    def get_returned_books(self) -> List[dict]:
        return list(returns_collection.find({}))

    def get_fines_collected(self) -> List[dict]:
        return list(fines_collection.find({}))
