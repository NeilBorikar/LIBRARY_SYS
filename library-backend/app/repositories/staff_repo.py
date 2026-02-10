from datetime import datetime
from typing import Optional, List

from app.database import (
    staff_collection,
    issues_collection,
    returns_collection,
    deposits_collection
)
from app.repositories.base_repo import BaseRepository
from app.utils.password import hash_password, verify_password


class StaffRepository(BaseRepository):
    def __init__(self):
        super().__init__(staff_collection)

    # -------------------------
    # REGISTER STAFF
    # -------------------------
    def create_staff(self, data: dict) -> str:
        if self.find_one({"email": data["email"]}):
            raise ValueError("Staff with this email already exists")

        if self.find_one({"emp_id": data["emp_id"]}):
            raise ValueError("Staff with this EMP_ID already exists")

        data["password"] = hash_password(data["password"])
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = None

        return self.insert_one(data)

    # -------------------------
    # AUTHENTICATE STAFF
    # -------------------------
    def authenticate_staff(
        self,
        emp_id_or_email: str,
        password: str
    ) -> Optional[dict]:

        staff = self.find_one({
            "$or": [
                {"email": emp_id_or_email},
                {"emp_id": emp_id_or_email}
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
    def get_dashboard_data(self, emp_id: str) -> dict:
        active_issues = issues_collection.count_documents({
            "user_type": "staff",
            "user_id": emp_id,
            "status": "issued"
        })

        deposit = deposits_collection.find_one(
            {"emp_id": emp_id},
            {"_id": 0, "amount": 1, "payment_mode": 1, "paid_at": 1}
        )

        return {
            "active_issues": active_issues,
            "deposit_status": "paid" if deposit else "unpaid",
            "deposit_details": deposit
        }

    # -------------------------
    # BOOKS ISSUED
    # -------------------------
    def get_issued_books(self, emp_id: str) -> List[dict]:
        return list(
            issues_collection.find({
                "user_type": "staff",
                "user_id": emp_id,
                "status": "issued"
            })
        )

    # -------------------------
    # BOOKS RETURNED
    # -------------------------
    def get_returned_books(self, emp_id: str) -> List[dict]:
        return list(
            returns_collection.find({
                "user_type": "staff",
                "user_id": emp_id
            })
        )

    # -------------------------
    # PAY DEPOSIT
    # -------------------------
    def pay_deposit(
        self,
        emp_id: str,
        amount: int,
        payment_mode: str
    ) -> str:

        if deposits_collection.find_one({"emp_id": emp_id}):
            raise ValueError("Deposit already paid")

        deposit = {
            "emp_id": emp_id,
            "amount": amount,
            "payment_mode": payment_mode,
            "paid_at": datetime.utcnow()
        }

        result = deposits_collection.insert_one(deposit)
        return str(result.inserted_id)
