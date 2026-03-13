from datetime import datetime
from typing import Optional, List

from app.database import (
    students_collection,
    issues_collection,
    fines_collection,
    books_collection
)
from app.repositories.base_repo import BaseRepository
from app.utils.password import hash_password, verify_password
from bson import ObjectId


class StudentRepository(BaseRepository):
    def __init__(self):
        super().__init__(students_collection)

    # -------------------------
    # CREATE STUDENT
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
    # AUTHENTICATE STUDENT
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
    # GET STUDENT
    # -------------------------
    def get_student_by_prn(self, prn: str) -> Optional[dict]:
        return self.find_one({"prn": prn})

    # -------------------------
    # STUDENT STATISTICS
    # -------------------------
    def get_student_statistics(self) -> dict:
        total_students = students_collection.count_documents({})
        
        return {
            "total_students": total_students
        }

    # -------------------------
    # BOOK OPERATIONS
    # -------------------------
    def get_student_issued_books(self, prn: str) -> List[dict]:
        """Get all books currently issued by a student"""
        return list(issues_collection.find({
            "user_type": "student",
            "user_id": prn,
            "status": "issued"
        }).sort("issue_date", -1))

    def get_student_returned_books(self, prn: str) -> List[dict]:
        """Get all books returned by a student"""
        return list(issues_collection.find({
            "user_type": "student",
            "user_id": prn,
            "status": "returned"
        }).sort("return_date", -1))

    def get_student_fines(self, prn: str) -> List[dict]:
        """Get all fines for a student"""
        return list(fines_collection.find({
            "user_type": "student",
            "user_id": prn
        }).sort("created_at", -1))
