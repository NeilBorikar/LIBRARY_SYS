from app.database import (
    students_collection,
    staff_collection,
    library_staff_collection,
    admin_collection
)


class AuthRepository:
    COLLECTION_MAP = {
        "student": students_collection,
        "staff": staff_collection,
        "library_staff": library_staff_collection,
        "admin": admin_collection,
    }

    def get_user_by_email(self, role: str, email: str):
        collection = self.COLLECTION_MAP.get(role)
        if not collection:
            return None
        return collection.find_one({"email": email})
