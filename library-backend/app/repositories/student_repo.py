from datetime import datetime
from typing import Optional

from app.database import students_collection
from app.repositories.base_repo import BaseRepository
from app.utils.password import hash_password


class StudentRepository(BaseRepository):
    def __init__(self):
        super().__init__(students_collection)

    def create_student(self, student_data: dict) -> str:
        # Enforce uniqueness
        if self.find_one({"email": student_data["email"]}):
            raise ValueError("Student with this email already exists")

        if self.find_one({"prn": student_data["prn"]}):
            raise ValueError("Student with this PRN already exists")

        student_data["password"] = hash_password(student_data["password"])
        student_data["created_at"] = datetime.utcnow()

        return self.insert_one(student_data)

    def get_student_by_email(self, email: str) -> Optional[dict]:
        return self.find_one({"email": email})

    def get_student_by_id(self, student_id: str) -> Optional[dict]:
        return self.find_by_id(student_id)

    def update_student(self, student_id: str, update_data: dict) -> bool:
        update_data["updated_at"] = datetime.utcnow()
        return self.update_one(
            {"_id": self.collection._id.__class__(student_id)},
            update_data
        )
