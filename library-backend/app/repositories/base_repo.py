from typing import Any, Dict, List, Optional
from bson import ObjectId
from pymongo.collection import Collection


class BaseRepository:
    """
    Base repository containing common MongoDB operations.
    This class should NEVER contain business logic.
    """

    def __init__(self, collection: Collection):
        self.collection = collection

    # -----------------------------
    # CREATE
    # -----------------------------
    def insert_one(self, data: Dict[str, Any]) -> str:
        result = self.collection.insert_one(data)
        return str(result.inserted_id)

    # -----------------------------
    # READ
    # -----------------------------
    def find_by_id(self, document_id: str) -> Optional[Dict[str, Any]]:
        return self.collection.find_one(
            {"_id": ObjectId(document_id)}
        )

    def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        return self.collection.find_one(query)

    def find_many(
        self,
        query: Dict[str, Any] = {},
        limit: int = 100,
        skip: int = 0
    ) -> List[Dict[str, Any]]:
        cursor = self.collection.find(query).skip(skip).limit(limit)
        return list(cursor)

    # -----------------------------
    # UPDATE
    # -----------------------------
    def update_one(
        self,
        query: Dict[str, Any],
        update_data: Dict[str, Any]
    ) -> bool:
        result = self.collection.update_one(
            query,
            {"$set": update_data}
        )
        return result.modified_count > 0

    # -----------------------------
    # DELETE
    # -----------------------------
    def delete_one(self, query: Dict[str, Any]) -> bool:
        result = self.collection.delete_one(query)
        return result.deleted_count > 0
