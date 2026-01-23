from datetime import datetime
from app.database import transactions_collection
from app.repositories.base_repo import BaseRepository


class TransactionRepository(BaseRepository):
    def __init__(self):
        super().__init__(transactions_collection)

    def log_transaction(self, data: dict) -> str:
        data["timestamp"] = datetime.utcnow()
        return self.insert_one(data)
