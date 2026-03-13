from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from bson import ObjectId

from app.database import (
    issues_collection,
    returns_collection,
    fines_collection,
    transactions_collection
)
from app.repositories.base_repo import BaseRepository


class TransactionRepository(BaseRepository):
    """
    Transaction repository for managing book issues, returns, and fines
    """

    def __init__(self):
        super().__init__(transactions_collection)

    # -------------------------
    # CREATE TRANSACTION
    # -------------------------
    def create_transaction(self, data: dict) -> dict:
        """Create a new transaction record"""
        transaction = {
            "transaction_id": str(ObjectId()),
            "user_type": data["user_type"],
            "user_id": data["user_id"],
            "book_id": data.get("book_id"),
            "book_name": data["book_name"],
            "issue_date": data["issue_date"],
            "due_date": data["due_date"],
            "return_date": data.get("return_date"),
            "fine_amount": data.get("fine_amount"),
            "status": data["status"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = self.insert_one(transaction)
        transaction["_id"] = result
        return transaction

    # -------------------------
    # UPDATE TRANSACTION
    # -------------------------
    def update_transaction(self, transaction_id: str, data: dict) -> dict:
        """Update an existing transaction"""
        data["updated_at"] = datetime.utcnow()
        
        self.update_one(
            {"transaction_id": transaction_id},
            {"$set": data}
        )

    # -------------------------
    # GET TRANSACTIONS
    # -------------------------
    def get_user_transactions(self, user_type: str, user_id: str, status: str = None) -> List[dict]:
        """Get all transactions for a specific user"""
        query = {
            "user_type": user_type,
            "user_id": user_id
        }
        
        if status:
            query["status"] = status

        return list(self.find(query).sort("created_at", -1))

    def get_active_issue(self, user_type: str, user_id: str, book_name: str) -> Optional[dict]:
        """Get active issue for a specific book"""
        return self.find_one({
            "user_type": user_type,
            "user_id": user_id,
            "book_name": book_name,
            "status": "issued"
        })

    def get_all_issued_books(self) -> List[dict]:
        """Get all currently issued books"""
        return list(self.find({"status": "issued"}).sort("created_at", -1))

    def get_all_returned_books(self) -> List[dict]:
        """Get all returned books history"""
        return list(self.find({"status": "returned"}).sort("return_date", -1))

    def get_overdue_books(self) -> List[dict]:
        """Get all overdue books"""
        now = datetime.utcnow()
        return list(self.find({
            "status": "issued",
            "due_date": {"$lt": now}
        }).sort("due_date", 1))

    def get_user_overdue_books(self, user_type: str, user_id: str) -> List[dict]:
        """Get overdue books for a specific user"""
        now = datetime.utcnow()
        return list(self.find({
            "user_type": user_type,
            "user_id": user_id,
            "status": "issued",
            "due_date": {"$lt": now}
        }).sort("due_date", 1))

    # -------------------------
    # FINE MANAGEMENT
    # -------------------------
    def create_fine_record(self, fine_data: dict) -> dict:
        """Create a fine record"""
        fine = {
            "fine_id": str(ObjectId()),
            "user_type": fine_data["user_type"],
            "user_id": fine_data["user_id"],
            "amount": fine_data["amount"],
            "fine_type": fine_data["fine_type"],
            "description": fine_data.get("description"),
            "status": "pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = fines_collection.insert_one(fine)
        fine["_id"] = result.inserted_id
        return fine

    def get_pending_fines(self) -> List[dict]:
        """Get all pending fines"""
        return list(fines_collection.find({"status": "pending"}).sort("created_at", -1))

    # -------------------------
    # ACTIVITY LOGGING
    # -------------------------
    def get_recent_activity(self, limit: int = 20) -> List[dict]:
        """Get recent library activity"""
        return list(self.find().sort("created_at", -1).limit(limit))

    def get_user_recent_activity(self, user_type: str, user_id: str, limit: int = 10) -> List[dict]:
        """Get recent activity for a specific user"""
        return list(self.find({
            "user_type": user_type,
            "user_id": user_id
        }).sort("created_at", -1).limit(limit))

    # -------------------------
    # REMINDER LOGGING
    # -------------------------
    def log_reminder(self, reminder_data: dict) -> dict:
        """Log a reminder that was sent"""
        reminder = {
            "reminder_id": str(ObjectId()),
            "student_prn": reminder_data["student_prn"],
            "student_name": reminder_data["student_name"],
            "student_email": reminder_data["student_email"],
            "overdue_books": reminder_data["overdue_books"],
            "total_fine": reminder_data["total_fine"],
            "reminder_sent_at": reminder_data["reminder_sent_at"],
            "reminder_type": "manual"
        }

        # Add to transactions collection as a reminder record
        return self.insert_one(reminder)

    # -------------------------
    # STATISTICS
    # -------------------------
    def get_transaction_stats(self) -> dict:
        """Get transaction statistics"""
        total_transactions = self.count_documents({})
        issued_books = self.count_documents({"status": "issued"})
        returned_books = self.count_documents({"status": "returned"})
        overdue_books = len(self.get_overdue_books())

        return {
            "total_transactions": total_transactions,
            "issued_books": issued_books,
            "returned_books": returned_books,
            "overdue_books": overdue_books
        }
