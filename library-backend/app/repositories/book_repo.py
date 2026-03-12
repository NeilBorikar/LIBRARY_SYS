from datetime import datetime
from typing import List, Optional

from bson import ObjectId

from app.database import books_collection
from app.repositories.base_repo import BaseRepository


class BookRepository(BaseRepository):
    def __init__(self):
        super().__init__(books_collection)

    # -------------------------
    # ADD BOOK
    # -------------------------
    def add_book(self, data: dict) -> str:
        if self.find_one({"book_name": data["book_name"]}):
            raise ValueError("Book with this name already exists")

        book = {
            "book_name": data["book_name"],
            "author": data.get("author"),
            "isbn": data.get("isbn"),
            "quantity": int(data["quantity"]),
            "created_at": datetime.utcnow(),
            "updated_at": None
        }

        return self.insert_one(book)

    # -------------------------
    # GET ALL BOOKS
    # -------------------------
    def get_all_books(self) -> List[dict]:
        return list(self.collection.find({}))

    # -------------------------
    # GET BOOK BY ID
    # -------------------------
    def get_book_by_id(self, book_id: str) -> Optional[dict]:
        try:
            return self.collection.find_one({"_id": ObjectId(book_id)})
        except Exception:
            return None

    # -------------------------
    # GET BOOK BY NAME
    # -------------------------
    def get_book_by_name(self, book_name: str) -> Optional[dict]:
        return self.find_one({"book_name": book_name})

    # -------------------------
    # UPDATE BOOK QUANTITY
    # -------------------------
    def update_book_quantity(self, book_id: str, quantity: int) -> bool:
        if quantity < 0:
            raise ValueError("Quantity cannot be negative")

        result = self.collection.update_one(
            {"_id": ObjectId(book_id)},
            {
                "$set": {
                    "quantity": quantity,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    # -------------------------
    # INCREMENT / DECREMENT STOCK
    # -------------------------
    def change_stock(self, book_id: str, delta: int) -> bool:
        book = self.get_book_by_id(book_id)
        if not book:
            raise ValueError("Book not found")

        new_quantity = book.get("quantity", 0) + delta
        if new_quantity < 0:
            raise ValueError("Insufficient book stock")

        return self.update_book_quantity(book_id, new_quantity)

    # -------------------------
    # DELETE BOOK
    # -------------------------
    def delete_book(self, book_id: str) -> bool:
        result = self.collection.delete_one({"_id": ObjectId(book_id)})
        return result.deleted_count > 0
