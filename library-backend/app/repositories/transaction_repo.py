from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.database import transactions_collection
from app.repositories.base_repo import BaseRepository


class TransactionRepository(BaseRepository):
    def __init__(self):
        super().__init__(transactions_collection)

    def log_transaction(self, data: dict) -> str:
        data["timestamp"] = datetime.utcnow()
        return self.insert_one(data)
    
    async def get_current_books(self, user_id: str) -> List[Dict[str, Any]]:
        """Get currently borrowed books for a user"""
        query = {
            "user_id": user_id,
            "returned_at": None
        }
        return await self.async_find_many(query)
    
    async def get_book_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get complete book borrowing history for a user"""
        query = {
            "user_id": user_id,
            "returned_at": {"$ne": None}
        }
        return await self.async_find_many(query)
    
    async def get_fine_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get fine payment history for a user"""
        query = {
            "user_id": user_id,
            "fine_amount": {"$gt": 0}
        }
        return await self.async_find_many(query)
    
    async def get_total_books(self) -> int:
        """Get total number of books in library"""
        # This would typically query the books collection
        # For now, return a mock count
        return 1000
    
    async def get_issued_books_count(self) -> int:
        """Get count of currently issued books"""
        query = {"returned_at": None}
        return await self.count_documents(query)
    
    async def get_overdue_books_count(self) -> int:
        """Get count of overdue books"""
        query = {
            "returned_at": None,
            "due_date": {"$lt": datetime.utcnow()}
        }
        return await self.count_documents(query)
    
    async def get_pending_fines_amount(self) -> float:
        """Get total amount of pending fines"""
        pipeline = [
            {
                "$match": {
                    "returned_at": None,
                    "due_date": {"$lt": datetime.utcnow()}
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total_fine": {"$sum": "$fine_amount"}
                }
            }
        ]
        result = await self.aggregate(pipeline)
        return result[0]["total_fine"] if result else 0.0
    
    async def get_student_fine_alerts(self) -> List[Dict[str, Any]]:
        """Get students with high fines or overdue books"""
        pipeline = [
            {
                "$match": {
                    "returned_at": None,
                    "due_date": {"$lt": datetime.utcnow()}
                }
            },
            {
                "$group": {
                    "_id": "$user_id",
                    "overdue_books": {"$sum": 1},
                    "total_fine": {"$sum": "$fine_amount"}
                }
            },
            {
                "$match": {
                    "$or": [
                        {"total_fine": {"$gt": 100}},
                        {"overdue_books": {"$gt": 2}}
                    ]
                }
            }
        ]
        return await self.aggregate(pipeline)
    
    async def get_all_current_books(self) -> List[Dict[str, Any]]:
        """Get all currently borrowed books"""
        query = {"returned_at": None}
        return await self.async_find_many(query)
    
    async def get_overdue_books(self) -> List[Dict[str, Any]]:
        """Get all overdue books"""
        query = {
            "returned_at": None,
            "due_date": {"$lt": datetime.utcnow()}
        }
        return await self.async_find_many(query)
    
    async def get_department_statistics(self) -> List[Dict[str, Any]]:
        """Get department-wise book usage statistics"""
        # This would typically join with user data to get department info
        # For now, return mock data
        return [
            {"department": "Computer Science", "books_issued": 150, "students": 45},
            {"department": "Electronics", "books_issued": 120, "students": 38},
            {"department": "Mechanical", "books_issued": 95, "students": 32},
            {"department": "Civil", "books_issued": 80, "students": 28},
            {"department": "Electrical", "books_issued": 70, "students": 25}
        ]
    
    async def get_defaulter_students(self) -> List[Dict[str, Any]]:
        """Get students with unpaid fines or overdue books"""
        pipeline = [
            {
                "$match": {
                    "$or": [
                        {"returned_at": None, "due_date": {"$lt": datetime.utcnow()}},
                        {"fine_amount": {"$gt": 0}}
                    ]
                }
            },
            {
                "$group": {
                    "_id": "$user_id",
                    "overdue_books": {
                        "$sum": {
                            "$cond": [
                                {"$and": [
                                    {"$eq": ["$returned_at", None]},
                                    {"$lt": ["$due_date", datetime.utcnow()]}
                                ]},
                                1,
                                0
                            ]
                        }
                    },
                    "pending_fine": {"$sum": "$fine_amount"}
                }
            },
            {
                "$match": {
                    "$or": [
                        {"overdue_books": {"$gt": 0}},
                        {"pending_fine": {"$gt": 0}}
                    ]
                }
            }
        ]
        return await self.aggregate(pipeline)
    
    async def get_monthly_trends(self, months: int = 12) -> Dict[str, List[Dict[str, Any]]]:
        """Get monthly book issue and fine collection trends"""
        start_date = datetime.utcnow() - timedelta(days=30 * months)
        
        # Book issue trends
        book_pipeline = [
            {
                "$match": {
                    "issued_at": {"$gte": start_date}
                }
            },
            {
                "$group": {
                    "_id": {
                        "year": {"$year": "$issued_at"},
                        "month": {"$month": "$issued_at"}
                    },
                    "books_issued": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id.year": 1, "_id.month": 1}
            }
        ]
        
        # Fine collection trends
        fine_pipeline = [
            {
                "$match": {
                    "timestamp": {"$gte": start_date},
                    "fine_amount": {"$gt": 0}
                }
            },
            {
                "$group": {
                    "_id": {
                        "year": {"$year": "$timestamp"},
                        "month": {"$month": "$timestamp"}
                    },
                    "fine_collected": {"$sum": "$fine_amount"}
                }
            },
            {
                "$sort": {"_id.year": 1, "_id.month": 1}
            }
        ]
        
        book_trends = await self.aggregate(book_pipeline)
        fine_trends = await self.aggregate(fine_pipeline)
        
        return {
            "book_issues": book_trends,
            "fine_collections": fine_trends
        }
