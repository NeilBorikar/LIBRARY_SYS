from datetime import datetime
from app.database import staff_collection
from app.repositories.base_repo import BaseRepository
from app.utils.password import hash_password


class StaffRepository(BaseRepository):
    def __init__(self):
        super().__init__(staff_collection)

    def create_staff(self, staff_data: dict) -> str:
        if self.find_one({"email": staff_data["email"]}):
            raise ValueError("Staff already exists")

        staff_data["password"] = hash_password(staff_data["password"])
        staff_data["security_deposit_paid"] = False
        staff_data["created_at"] = datetime.utcnow()

        return self.insert_one(staff_data)

    def mark_deposit_paid(self, staff_id: str) -> bool:
        return self.update_one(
            {"_id": self.collection._id.__class__(staff_id)},
            {"security_deposit_paid": True}
        )
