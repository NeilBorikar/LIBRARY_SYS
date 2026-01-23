from datetime import datetime
from app.database import books_collection
from app.repositories.base_repo import BaseRepository


class BookRepository(BaseRepository):
    def __init__(self):
        super().__init__(books_collection)

    def add_book(self, book_data: dict) -> str:
        book_data["created_at"] = datetime.utcnow()
        return self.insert_one(book_data)

    def update_availability(self, book_id: str, delta: int) -> bool:
        book = self.find_by_id(book_id)
        if not book:
            return False

        new_count = book["available_copies"] + delta
        if new_count < 0:
            return False

        return self.update_one(
            {"_id": self.collection._id.__class__(book_id)},
            {"available_copies": new_count}
        )
