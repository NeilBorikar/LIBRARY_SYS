from typing import Optional

from app.database import (
    students_collection,
    staff_collection,
    library_staff_collection
)
from app.utils.password import verify_password


class AuthRepository:
    """
    Authentication-only repository.
    No creation. No updates. No business logic.
    """

    COLLECTION_MAP = {
        "student": {
            "collection": students_collection,
            "id_fields": ["email", "prn"]
        },
        "staff": {
            "collection": staff_collection,
            "id_fields": ["email", "emp_id"]
        },
        "library_staff": {
            "collection": library_staff_collection,
            "id_fields": ["email", "staff_id"]
        }
    }

    def authenticate(
        self,
        role: str,
        identifier: str,
        password: str
    ) -> Optional[dict]:

        role_config = self.COLLECTION_MAP.get(role)
        if not role_config:
            return None

        collection = role_config["collection"]
        id_fields = role_config["id_fields"]

        query = {
            "$or": [{field: identifier} for field in id_fields]
        }

        user = collection.find_one(query)
        if not user:
            return None

        if not verify_password(password, user.get("password")):
            return None

        return user
