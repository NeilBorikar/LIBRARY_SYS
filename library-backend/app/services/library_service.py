from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from ..repositories.library_staff_repo import LibraryStaffRepository
from ..repositories.transaction_repo import TransactionRepository
from ..utils.fine_calculator import FineCalculator


class LibraryService:
    """Core library operations service"""
    
    def __init__(self):
        self.library_repo = LibraryStaffRepository()
        self.transaction_repo = TransactionRepository()
        self.fine_calculator = FineCalculator()
    
    async def issue_book(self, issue_data: Dict[str, Any]) -> Dict[str, Any]:
        """Issue a book to a user"""
        try:
            # Check if book is available
            book = await self.library_repo.get_book_by_name(issue_data["book_name"])
            if not book:
                raise ValueError(f"Book '{issue_data['book_name']}' not found")
            
            if book["available_quantity"] <= 0:
                raise ValueError("Book is not available for issue")
            
            # Check if user already has this book issued
            existing_issue = await self.transaction_repo.get_active_issue(
                issue_data["user_type"], 
                issue_data["user_id"], 
                issue_data["book_name"]
            )
            if existing_issue:
                raise ValueError("User already has this book issued")
            
            # Create transaction
            transaction_data = {
                "user_type": issue_data["user_type"],
                "user_id": issue_data["user_id"],
                "book_id": book["book_id"],
                "book_name": issue_data["book_name"],
                "issue_date": issue_data["issue_date"],
                "due_date": issue_data["due_date"],
                "status": "issued"
            }
            
            transaction = await self.transaction_repo.create_transaction(transaction_data)
            
            # Update book availability
            await self.library_repo.update_book_availability(
                book["book_id"], 
                book["available_quantity"] - 1
            )
            
            return {
                "success": True,
                "transaction_id": transaction["transaction_id"],
                "message": f"Book '{issue_data['book_name']}' issued successfully",
                "due_date": issue_data["due_date"]
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def return_book(self, return_data: Dict[str, Any]) -> Dict[str, Any]:
        """Return a book from a user"""
        try:
            # Find active transaction
            transaction = await self.transaction_repo.get_active_issue(
                return_data["user_type"],
                return_data["user_id"],
                return_data["book_name"]
            )
            
            if not transaction:
                raise ValueError("No active issue found for this book")
            
            # Calculate fine if overdue
            fine_amount = 0
            if return_data["return_date"] > transaction["due_date"]:
                fine_amount = self.fine_calculator.calculate_fine(
                    transaction["due_date"],
                    return_data["return_date"]
                )
            
            # Update transaction
            update_data = {
                "return_date": return_data["return_date"],
                "fine_amount": fine_amount,
                "status": "returned"
            }
            
            await self.transaction_repo.update_transaction(
                transaction["transaction_id"], 
                update_data
            )
            
            # Update book availability
            book = await self.library_repo.get_book_by_name(return_data["book_name"])
            if book:
                await self.library_repo.update_book_availability(
                    book["book_id"],
                    book["available_quantity"] + 1
                )
            
            response = {
                "success": True,
                "transaction_id": transaction["transaction_id"],
                "message": f"Book '{return_data['book_name']}' returned successfully"
            }
            
            if fine_amount > 0:
                response["fine_amount"] = fine_amount
                response["fine_message"] = f"Fine of ₹{fine_amount} applicable for late return"
            
            return response
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def add_book(self, book_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new book to the library"""
        try:
            # Check if book already exists
            existing_book = await self.library_repo.get_book_by_name(book_data["book_name"])
            if existing_book:
                # Update quantity if book exists
                new_quantity = existing_book["total_quantity"] + book_data["quantity"]
                new_available = existing_book["available_quantity"] + book_data["quantity"]
                
                await self.library_repo.update_book_quantity(
                    existing_book["book_id"],
                    new_quantity,
                    new_available
                )
                
                return {
                    "success": True,
                    "book_id": existing_book["book_id"],
                    "message": f"Book quantity updated. Total quantity: {new_quantity}"
                }
            else:
                # Create new book
                book = await self.library_repo.create_book(book_data)
                return {
                    "success": True,
                    "book_id": book["book_id"],
                    "message": f"Book '{book_data['book_name']}' added successfully"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_issued_books(self) -> List[Dict[str, Any]]:
        """Get all currently issued books"""
        try:
            return await self.transaction_repo.get_all_issued_books()
        except Exception as e:
            raise Exception(f"Error fetching issued books: {str(e)}")
    
    async def get_returned_books(self) -> List[Dict[str, Any]]:
        """Get all returned books history"""
        try:
            return await self.transaction_repo.get_all_returned_books()
        except Exception as e:
            raise Exception(f"Error fetching returned books: {str(e)}")
    
    async def collect_fine(self, fine_data: Dict[str, Any]) -> Dict[str, Any]:
        """Collect fine from user"""
        try:
            # Create fine record
            fine_record = await self.transaction_repo.create_fine_record(fine_data)
            
            return {
                "success": True,
                "fine_id": fine_record["fine_id"],
                "message": f"Fine of ₹{fine_data['amount']} collected successfully"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_library_stats(self) -> Dict[str, Any]:
        """Get library statistics for dashboard"""
        try:
            stats = await self.library_repo.get_library_stats()
            return stats
        except Exception as e:
            raise Exception(f"Error fetching library stats: {str(e)}")


# Singleton instance
library_service = LibraryService()
