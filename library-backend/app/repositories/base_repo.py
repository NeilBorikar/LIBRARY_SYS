from typing import Any, Dict, List, Optional
from bson import ObjectId, errors
from pymongo.collection import Collection
import asyncio


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
        try:
            return self.collection.find_one(
                {"_id": ObjectId(document_id)}
            )
        except (errors.InvalidId, TypeError):
            return None

    def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        return self.collection.find_one(query)

    def find_many(
        self,
        query: Optional[Dict[str, Any]] = None,
        limit: int = 100,
        skip: int = 0
    ) -> List[Dict[str, Any]]:
        query = query or {}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        return list(cursor)

    # -----------------------------
    # ASYNC METHODS
    # -----------------------------
    async def async_find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.find_one, query)

    async def async_find_many(
        self,
        query: Dict[str, Any] = {},
        limit: int = 100,
        skip: int = 0
    ) -> List[Dict[str, Any]]:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.find_many, query, limit, skip)

    async def count_documents(self, query: Dict[str, Any]) -> int:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.collection.count_documents, query)

    async def aggregate(self, pipeline: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        loop = asyncio.get_event_loop()
        cursor = self.collection.aggregate(pipeline)
        return await loop.run_in_executor(None, list, cursor)

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
