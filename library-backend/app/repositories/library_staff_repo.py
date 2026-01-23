from datetime import datetime
from app.database import library_staff_collection
from app.repositories.base_repo import BaseRepository
from app.utils.password import hash_password


class LibraryStaffRepository(BaseRepository):
    def __init__(self):
        super().__init__(library_staff_collection)

    def create_library_staff(self, data: dict) -> str:
        data["password"] = hash_password(data["password"])
        data["created_at"] = datetime.utcnow()
        return self.insert_one(data)
