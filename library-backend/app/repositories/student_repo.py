from datetime import datetime
from typing import List, Optional
from bson import ObjectId

from app.database import (
    students_collection,
    issues_collection,
    returns_collection,
    fines_collection,
    books_collection
)
from app.repositories.base_repo import BaseRepository
from app.utils.password import hash_password, verify_password


class StudentRepository(BaseRepository):
    def __init__(self):
        super().__init__(students_collection)

    # -------------------------
    # REGISTER
    # -------------------------
    def create_student(self, data: dict) -> str:
        if self.find_one({"email": data["email"]}):
            raise ValueError("Student with this email already exists")

        if self.find_one({"prn": data["prn"]}):
            raise ValueError("Student with this PRN already exists")

        data["password"] = hash_password(data["password"])
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = None

        return self.insert_one(data)

    # -------------------------
    # LOGIN
    # -------------------------
    def authenticate_student(
        self,
        prn_or_email: str,
        password: str
    ) -> Optional[dict]:

        student = self.find_one({
            "$or": [
                {"email": prn_or_email},
                {"prn": prn_or_email}
            ]
        })

        if not student:
            return None

        if not verify_password(password, student["password"]):
            return None

        return student

    # -------------------------
    # DASHBOARD
    # -------------------------
    def get_dashboard_data(self, prn: str) -> dict:
        issued_count = issues_collection.count_documents({
            "user_type": "student",
            "user_id": prn,
            "status": "issued"
        })

        total_fine_amount = sum(
            fine.get("amount", 0)
            for fine in fines_collection.find({
                "user_type": "student",
                "user_id": prn
            })
        )

        return {
            "active_issues": issued_count,
            "total_fine_amount": total_fine_amount
        }

    # -------------------------
    # BOOKS
    # -------------------------
    def _add_book_details(self, record: dict) -> dict:
        if "book_id" in record:
            book = books_collection.find_one({"_id": ObjectId(record["book_id"])})
            record["book_name"] = book["book_name"] if book else "Unknown Book"
            record["book_id"] = str(record["book_id"])
        if "_id" in record:
            record["_id"] = str(record["_id"])
        return record

    def get_issued_books(self, prn: str) -> List[dict]:
        records = list(issues_collection.find({
            "user_type": "student",
            "user_id": prn,
            "status": "issued"
        }))
        return [self._add_book_details(r) for r in records]

    def get_returned_books(self, prn: str) -> List[dict]:
        records = list(returns_collection.find({
            "user_type": "student",
            "user_id": prn
        }))
        return [self._add_book_details(r) for r in records]

    def get_fine_history(self, prn: str) -> List[dict]:
        records = list(fines_collection.find({
            "user_type": "student",
            "user_id": prn
        }))
        return [self._add_book_details(r) for r in records]
